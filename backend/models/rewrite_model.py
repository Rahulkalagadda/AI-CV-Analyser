from pydantic import BaseModel

class RewriteInput(BaseModel):
    cv_id: str
    cv_text: str
    job_description: str
