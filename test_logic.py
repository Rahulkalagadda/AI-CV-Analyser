import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.ats_score import calculate_ats_score
from services.rewrite_cv import rewrite_cv

load_dotenv(os.path.join('backend', '.env'))

def test_logic():
    print("Testing Logic Improvements...")
    
    if not os.getenv("GEMINI_API_KEY"):
        print("SKIPPING: GEMINI_API_KEY not found in environment.")
        # Try to load explicitly
        env_path = os.path.join('backend', '.env')
        if os.path.exists(env_path):
            print(f"Found .env at {env_path}")
            load_dotenv(env_path)
        else:
            print(f"No .env found at {env_path}")
            
    if not os.getenv("GEMINI_API_KEY"):
        print("STILL NO API KEY. Exiting.")
        return

    job_description = """
    We are looking for a Senior Python Developer with experience in FastAPI, Docker, and Kubernetes.
    Must have strong knowledge of PostgreSQL and Redis.
    Experience with AWS (EC2, S3) is required.
    """

    cv_text = """
    I am a Python developer with 5 years of experience.
    I have worked with Django and Flask.
    I know SQL and have used some cloud services.
    """

    print("\n--- Testing ATS Score ---")
    try:
        score_result = calculate_ats_score(cv_text, job_description)
        print(f"Score: {score_result['ats_score']}")
        print(f"Matched: {score_result['matched_keywords']}")
        print(f"Missing: {score_result['missing_keywords']}")
    except Exception as e:
        print(f"ATS SCORE FAILED: {e}")
        if hasattr(e, 'detail'):
            print(f"Detail: {e.detail}")

    print("\n--- Testing CV Rewrite ---")
    try:
        rewritten = rewrite_cv(cv_text, job_description)
        print(f"Rewritten CV Length: {len(rewritten)}")
        print("Snippet:", rewritten[:200] + "...")
    except Exception as e:
        print(f"REWRITE FAILED: {e}")
        if hasattr(e, 'detail'):
            print(f"Detail: {e.detail}")

if __name__ == "__main__":
    test_logic()
