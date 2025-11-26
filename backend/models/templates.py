from pydantic import BaseModel

class TemplateRequest(BaseModel):
    template_name: str
    cv_text: str

class TemplateResponse(BaseModel):
    formatted_cv: str
