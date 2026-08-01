from pydantic import BaseModel
from datetime import date

class SchoolModel(BaseModel):
    school_name: str
    year_from: date
    year_to: int
    other_info: str