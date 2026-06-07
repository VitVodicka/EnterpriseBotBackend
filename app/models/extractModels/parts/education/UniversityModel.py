from .HighSchoolModel import HighSchoolModel


class UniversityModel(HighSchoolModel):
    specialization: str
    thesis: str
    degree: str
    grades: str