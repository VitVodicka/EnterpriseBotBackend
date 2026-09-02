from datetime import date
from typing import List
from pydantic import BaseModel

class CourseModel(BaseModel):
    courseName: str
    institution: str
    year: str
    other_info: str
    skills: List[str]