from datetime import date
from pydantic import BaseModel


class ReferenceModel(BaseModel):
    from_: str  # Od koho
    date: date 
    text: str
    other_info: str = ""
