from typing import Dict
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException
from models.response_models import UploadResponse, ScoreResponse, RewriteResponse, CV, CVListResponse, CoverLetterResponse, InterviewPrepResponse
from middleware.error_handler import error_handler
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from utils.text_extractor import extract_text_from_docx, extract_text_from_pdf
from services.ats_score import calculate_ats_score
from models.score_model import ScoreRequest
from models.rewrite_model import RewriteInput
from services.cv_templates import list_templates, apply_template
from models.templates import TemplateRequest, TemplateResponse
import tempfile
import google.generativeai as genai
from services.rewrite_cv import rewrite_cv
from services.cover_letter import generate_cover_letter
from services.interview_prep import generate_interview_questions

# Load environment variables
load_dotenv()

# Configure Gemini API
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

app = FastAPI()

# Constants
MAX_TEXT_LENGTH = 5000

# In-memory storage for CVs
cv_storage: Dict[str, CV] = {}

# CORS configuration (include common localhost variants for dev)
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "https://ai-cv-analyser-dcxs.vercel.app,http://localhost:8000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add error handling middleware
app.middleware("http")(error_handler)

# Dependency to get a CV by ID
def get_cv_entry(cv_id: str) -> CV:
    cv_entry = cv_storage.get(cv_id)
    if not cv_entry:
        raise HTTPException(status_code=404, detail="CV not found.")
    return cv_entry

@app.post("/upload", response_model=UploadResponse)
def upload_cv(file: UploadFile = File(...)):
    filename = file.filename.lower()
    extension = os.path.splitext(filename)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
        temp_file.write(file.file.read())
        temp_file_path = temp_file.name

    try:
        if extension == ".pdf":
            text = extract_text_from_pdf(temp_file_path)
        elif extension == ".docx":
            text = extract_text_from_docx(temp_file_path)
        elif extension == ".doc":
            # .doc is not reliably supported by docx2txt; return a clear 400
            raise HTTPException(status_code=400, detail=".doc files are not supported. Please upload PDF or DOCX.")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Upload PDF or DOCX.")
    except HTTPException:
        raise
    except Exception as e:
        # Surface extraction errors as 400 to the client with a helpful message
        raise HTTPException(status_code=400, detail=f"Failed to extract text from file: {str(e)}")
    finally:
        os.remove(temp_file_path)

    cv_id = str(uuid.uuid4())
    truncated_text = text[:MAX_TEXT_LENGTH]
    new_cv = CV(id=cv_id, filename=filename, extracted_text=truncated_text)
    cv_storage[cv_id] = new_cv

    return {"cv_id": cv_id, "extracted_text": truncated_text}

@app.post("/score", response_model=ScoreResponse)
def calculate_score(data: ScoreRequest):
    try:
        cv_entry = cv_storage.get(data.cv_id)
        if not isinstance(data.job_description, str) or not data.job_description.strip():
            raise HTTPException(status_code=400, detail="Job description is required.")
        # Determine text to score: prefer stored CV, else provided cv_text
        if cv_entry and isinstance(cv_entry.extracted_text, str) and cv_entry.extracted_text.strip():
            text_to_score = cv_entry.extracted_text
        elif isinstance(data.cv_text, str) and data.cv_text.strip():
            text_to_score = data.cv_text
        else:
            raise HTTPException(status_code=404, detail="CV not found or text missing.")

        result = calculate_ats_score(text_to_score, data.job_description)
        
        if cv_entry:
            cv_entry.ats_score = result["ats_score"]
            cv_entry.matched_keywords = result["matched_keywords"]
            cv_entry.missing_keywords = result["missing_keywords"]
        
        return result
    except Exception as e:
        print(f"Error during score calculation: {e}")
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail="Failed to calculate ATS score.")

@app.post("/rewrite", response_model=RewriteResponse)
def rewrite_cv_route(data: RewriteInput):
    try:
        cv_entry = cv_storage.get(data.cv_id)
        if not cv_entry:
            raise HTTPException(status_code=404, detail="CV not found.")

        rewritten_cv = rewrite_cv(data.cv_text, data.job_description)
        cv_entry.rewritten_cv = rewritten_cv
        return {"rewritten_cv": rewritten_cv}
    except Exception as e:
        # The rewrite_cv service will log the specific error
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cover-letter", response_model=CoverLetterResponse)
def generate_cover_letter_route(data: RewriteInput):
    try:
        cv_entry = cv_storage.get(data.cv_id)
        if not cv_entry:
            raise HTTPException(status_code=404, detail="CV not found.")

        cover_letter = generate_cover_letter(data.cv_text, data.job_description)
        return {"cover_letter": cover_letter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interview-questions", response_model=InterviewPrepResponse)
def generate_interview_questions_route(data: RewriteInput):
    try:
        cv_entry = cv_storage.get(data.cv_id)
        if not cv_entry:
            raise HTTPException(status_code=404, detail="CV not found.")

        result = generate_interview_questions(data.cv_text, data.job_description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/templates")
def get_templates():
    return {"templates": list_templates()}

@app.post("/templates/apply", response_model=TemplateResponse)
def apply_template_route(data: TemplateRequest):
    try:
        formatted = apply_template(data.template_name, data.cv_text)
        return {"formatted_cv": formatted}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# New endpoints for CV management
@app.get("/api/cvs", response_model=CVListResponse)
def get_all_cvs():
    return {"cvs": list(cv_storage.values())}

@app.get("/api/cvs/{cv_id}", response_model=CV)
def get_cv_by_id(cv_id: str):
    return get_cv_entry(cv_id)

@app.delete("/api/cvs/{cv_id}")
def delete_cv_by_id(cv_id: str):
    if cv_id in cv_storage:
        del cv_storage[cv_id]
        return {"message": f"CV with ID {cv_id} deleted successfully."}
    raise HTTPException(status_code=404, detail="CV not found.")
