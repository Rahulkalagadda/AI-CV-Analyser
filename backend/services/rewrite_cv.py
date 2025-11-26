import os
import google.generativeai as genai
from fastapi import HTTPException

def rewrite_cv(cv_text: str, job_description: str) -> str:
    """
    Rewrites a CV based on a job description using the Gemini API.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in environment variables.")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = f"""
You are an expert professional resume writer and ATS optimization specialist.
Your goal is to rewrite the provided CV to target a 90%+ match score for the given Job Description.

Instructions:
1. Analyze the Job Description to identify the top 10 most critical hard skills, tools, and requirements.
2. Analyze the Original CV to identify gaps (missing keywords, weak phrasing).
3. Rewrite the CV content to:
    - Naturally incorporate the missing critical keywords (do not just list them, weave them into bullet points).
    - Use strong action verbs (e.g., "Architected", "Deployed", "Optimized").
    - Ensure the tone is professional, concise, and impact-driven.
    - Maintain the truthfulness of the original candidate's experience but frame it in the most relevant way for this specific job.
4. The output must be the full text of the rewritten CV, ready to be saved or displayed. Do not include any conversational text before or after the CV.

Job Description:
{job_description}

Original CV:
{cv_text}

Rewritten CV:
"""
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error during CV rewrite: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during the CV rewrite process: {e}")
