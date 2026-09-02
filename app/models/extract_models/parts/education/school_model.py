from typing import Literal

from pydantic import BaseModel
from datetime import date

class SchoolModel(BaseModel):
    type: Literal["primary", "high_school", "other", "university"]
    school_name: str
    year_from: date
    year_to: int
    other_info: str
    specialization: str | None = None
    thesis: str | None = None
    degree: str | None = None
    grades: str | None = None