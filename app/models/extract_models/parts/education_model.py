from typing import List
from pydantic import BaseModel

from .education.school_model import SchoolModel
from .education.high_school_model import HighSchoolModel
from .education.university_model import UniversityModel
from .education.course_model import CourseModel


class EducationModel(BaseModel):
    primary_school: List[SchoolModel]
    high_school: List[HighSchoolModel]
    other_school: List[SchoolModel]
    university: List[UniversityModel]
    is_student: bool
    courses: List[CourseModel]
    other_info: str

