import os
import google.generativeai as genai
import json
from fastapi import HTTPException
from typing import Dict, Any

def generate_interview_questions(cv_text: str, job_description: str) -> Dict[str, Any]:
    """
    Generates interview questions and tips based on CV and Job Description using Gemini.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in environment variables.")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = f"""
You are an expert technical recruiter and interview coach.
Your goal is to prepare a candidate for an interview by generating likely questions based on their CV and the Job Description.

Instructions:
1. Analyze the Job Description to identify the core technical and behavioral competencies required.
2. Analyze the CV to find areas that might be probed (e.g., gaps, specific projects, claimed skills).
3. Generate a JSON response containing:
    - "technical_questions": A list of 5-7 technical questions specific to the role and the candidate's stack.
    - "behavioral_questions": A list of 3-5 behavioral questions (STAR method style) relevant to the role's level (e.g., leadership for seniors).
    - "tips": A list of 3-5 specific tips for this interview (e.g., "Brush up on System Design for the payment gateway project").

Output JSON structure:
{{
  "technical_questions": ["Question 1", "Question 2", ...],
  "behavioral_questions": ["Question 1", "Question 2", ...],
  "tips": ["Tip 1", "Tip 2", ...]
}}

Return ONLY the JSON.

Job Description:
{job_description}

Candidate CV:
{cv_text}
"""
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Clean up potential markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
        return json.loads(content.strip())
    except Exception as e:
        print(f"Error during interview prep generation: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during interview prep generation: {e}")
