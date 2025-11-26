import fitz  # PyMuPDF
import docx2txt
import os

def extract_text_from_docx(file_path):
    # First try docx2txt (handles embedded text, headers/footers sometimes)
    try:
        text = docx2txt.process(file_path) or ""
        if text.strip():
            return text
    except Exception:
        # Fallback below
        pass

    # Fallback to python-docx for better compatibility in some environments
    try:
        from docx import Document
        document = Document(file_path)
        paragraphs = [p.text for p in document.paragraphs if p.text]
        return "\n".join(paragraphs)
    except Exception as e:
        # Re-raise to be handled by caller
        raise e

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text
