from pydantic import BaseModel


class LanguageModel(BaseModel):
    language: str
    level: str  
    other_info: str = ""
