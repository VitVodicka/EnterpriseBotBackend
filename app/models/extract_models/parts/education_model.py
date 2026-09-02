from typing import List
from pydantic import BaseModel

from .education.school_model import SchoolModel
from .education.course_model import CourseModel


class EducationModel(BaseModel):
    schools: List[SchoolModel]
    is_student: bool
    courses: List[CourseModel]
    other_info: str

