from datetime import date
from typing import List
from pydantic import BaseModel

class CourseModel(BaseModel):
    courseName: str
    institution: str
    year: date
    otherInfo: str
    skills: List[str]