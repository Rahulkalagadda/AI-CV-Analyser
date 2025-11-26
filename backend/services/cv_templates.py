TEMPLATES = {
    "classic": lambda text: f"--- Classic Resume Format ---\n\n{text}",
    "modern": lambda text: f"*** Modern Resume Format ***\n\n{text}",
    "compact": lambda text: f":: Compact CV ::\n\n{text}"
}

def list_templates():
    return list(TEMPLATES.keys())

def apply_template(template_name: str, content: str) -> str:
    if template_name not in TEMPLATES:
        raise ValueError("Template not found")
    return TEMPLATES[template_name](content)
