from pycparser.ast_transforms import List
from pydantic import BaseModel

from .education.SchoolModel import SchoolModel
from .education.HighSchoolModel import HighSchoolModel
from .education.UniversityModel import UniversityModel
from .education.CourseModel import CourseModel


class EducationModel(BaseModel):
    primarySchool: List[SchoolModel]
    highSchool: List[HighSchoolModel]
    otherSchool: List[SchoolModel]
    university: List[UniversityModel]
    isStudent: bool
    courses: List[CourseModel]
    otherInfo: str

