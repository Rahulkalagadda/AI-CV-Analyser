from pydantic import BaseModel
from typing import List, Optional, Dict

class UploadResponse(BaseModel):
    cv_id: str
    extracted_text: str
    error: Optional[str] = None

class ScoreResponse(BaseModel):
    ats_score: float
    matched_keywords: List[str]
    missing_keywords: List[str]

class RewriteResponse(BaseModel):
    rewritten_cv: str
    error: Optional[str] = None

class CoverLetterResponse(BaseModel):
    cover_letter: str
    error: Optional[str] = None

class InterviewPrepResponse(BaseModel):
    technical_questions: List[str]
    behavioral_questions: List[str]
    tips: List[str]
    error: Optional[str] = None

class CV(BaseModel):
    id: str
    filename: str
    extracted_text: str
    ats_score: Optional[float] = None
    matched_keywords: Optional[List[str]] = None
    missing_keywords: Optional[List[str]] = None
    rewritten_cv: Optional[str] = None

class CVListResponse(BaseModel):
    cvs: List[CV]
