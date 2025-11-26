import os
import google.generativeai as genai
from fastapi import HTTPException

def generate_cover_letter(cv_text: str, job_description: str) -> str:
    """
    Generates a personalized cover letter based on CV and Job Description using Gemini.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in environment variables.")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = f"""
You are an expert career coach and professional writer.
Your task is to write a compelling, personalized cover letter for a candidate applying to a specific job.

Instructions:
1. Analyze the Job Description to understand the company's needs, culture, and key requirements.
2. Analyze the Candidate's CV to identify relevant skills, experiences, and achievements that match the job.
3. Write a professional cover letter that:
    - Hooks the reader in the opening paragraph.
    - clearly articulates why the candidate is a great fit.
    - Highlights specific achievements from the CV that demonstrate the required skills.
    - Expresses genuine enthusiasm for the role and company.
    - Has a professional and confident tone.
4. The output must be ONLY the body of the cover letter. Do not include placeholders like "[Your Name]" or "[Date]" at the top unless they are standard header format, but prefer a clean body text that can be pasted into an email or document.
5. Do not include any conversational text before or after the cover letter.

Job Description:
{job_description}

Candidate CV:
{cv_text}

Cover Letter:
"""
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error during cover letter generation: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during cover letter generation: {e}")
