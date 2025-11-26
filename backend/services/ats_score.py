from typing import List, Set, Dict, Any
import re
import os
import json
import google.generativeai as genai

def _tokenize(text: str) -> List[str]:
    text = (text or "").lower()
    return re.findall(r"[a-z0-9]+", text)

def _stop_words() -> Set[str]:
    return {"the","and","is","in","at","of","a","to","for","on","with","by","an","as","be"}

GENERIC_EXCLUDE = {
    "years","year","experience","experiences","your","should","must","ability","able","good","excellent",
    "required","requirement","requirements","preferred","strong","skill","skills","knowledge","languages",
    "test","tests","unit","units","code","coding","development","developing","design","defined","product",
    "project","projects","quality","qt","manage","managing","maintain","maintenance","problem","solving",
    "communication","communications","application","applications","bring","bringing","independently","expertise",
}

def _filter_keywords(keywords: List[str]) -> List[str]:
    stop_words = _stop_words()
    filtered: List[str] = []
    for w in keywords:
        token = (w or "").strip().lower()
        if not token:
            continue
        if len(token) < 3:
            continue
        if token.isnumeric():
            continue
        if token in stop_words or token in GENERIC_EXCLUDE:
            continue
        filtered.append(token)
    # de-duplicate while preserving order
    seen: Set[str] = set()
    result: List[str] = []
    for t in filtered:
        if t not in seen:
            seen.add(t)
            result.append(t)
    return result[:25]

def _simple_match_score(cv_text: str, job_description: str) -> Dict[str, Any]:
    stop_words = _stop_words()
    cv_words = _tokenize(cv_text)
    jd_words = _tokenize(job_description)
    cv_keywords = {w for w in cv_words if w.isalnum() and w not in stop_words}
    jd_keywords = {w for w in jd_words if w.isalnum() and w not in stop_words}
    matched = cv_keywords.intersection(jd_keywords)
    missing = jd_keywords - cv_keywords
    matched_f = _filter_keywords(sorted(list(matched)))
    missing_f = _filter_keywords(sorted(list(missing)))
    # Recompute score using filtered sets to better reflect relevancy
    denom = len(_filter_keywords(sorted(list(jd_keywords)))) or 1
    score = round(len(matched_f) / denom * 100, 2)
    return {
        "ats_score": float(score),
        "matched_keywords": matched_f,
        "missing_keywords": missing_f,
    }

def _gemini_analyze(cv_text: str, job_description: str) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not configured")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = (
            "You are a strict ATS (Applicant Tracking System) expert. Your goal is to evaluate the relevance of a CV against a Job Description.\n"
            "1. Identify the CRITICAL HARD SKILLS, TOOLS, and DOMAIN KNOWLEDGE required in the Job Description. Ignore generic soft skills like 'communication' or 'teamwork' unless they are absolutely central to the role.\n"
            "2. Check if these specific critical keywords exist in the CV.\n"
            "3. Calculate a score from 0 to 100 based strictly on the presence of these critical skills. A score above 90 requires almost a perfect match of all technical requirements.\n"
            "4. Return the result in STRICT JSON format.\n\n"
            "Job Description:\n" + job_description + "\n\n"
            "CV:\n" + cv_text + "\n\n"
            "Output JSON structure:\n"
            "{\n"
            "  \"score\": <integer 0-100>,\n"
            "  \"matched_keywords\": [<list of specific hard skills found in CV>],\n"
            "  \"missing_keywords\": [<list of specific hard skills missing from CV>]\n"
            "}"
        )
        response = model.generate_content(prompt)
        content = (response.text or "").strip()
        # Attempt to extract JSON from content
        json_str = content
        if '```' in content:
            # Handle potential fenced code blocks
            parts = content.split('```')
            for part in parts:
                part = part.strip()
                if part.startswith('{') and part.endswith('}'):
                    json_str = part
                    break
        # Clean up potential json markdown prefix
        if json_str.startswith('json'):
            json_str = json_str[4:].strip()
            
        data = json.loads(json_str)
        score_val = data.get("score")
        matched = data.get("matched_keywords", [])
        missing = data.get("missing_keywords", [])
        # Normalize
        if isinstance(score_val, str):
            score_val = re.sub(r"[^0-9]", "", score_val)
            score_val = int(score_val) if score_val else 0
        if not isinstance(score_val, int):
            score_val = int(round(float(score_val))) if score_val is not None else 0
        matched = [str(x).strip() for x in matched if str(x).strip()]
        missing = [str(x).strip() for x in missing if str(x).strip()]
        score_val = max(0, min(100, score_val))
        
        # We trust Gemini's filtering more now, but still apply a light cleanup
        matched_f = _filter_keywords(matched)
        missing_f = _filter_keywords(missing)
        
        return {
            "ats_score": float(score_val),
            "matched_keywords": matched_f,
            "missing_keywords": missing_f,
        }
    except Exception as e:
        raise RuntimeError(f"Gemini analysis failed: {e}")

def calculate_ats_score(cv_text: str, job_description: str) -> Dict[str, Any]:
    # Try Gemini first; if it fails, use simple fallback
    try:
        return _gemini_analyze(cv_text, job_description)
    except Exception:
        return _simple_match_score(cv_text, job_description)
