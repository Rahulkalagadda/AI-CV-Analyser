from pydantic import BaseModel
from typing import Optional

class ScoreRequest(BaseModel):
    cv_id: str
    job_description: str
    cv_text: Optional[str] = None
