from .high_school_model import HighSchoolModel


class UniversityModel(HighSchoolModel):
    specialization: str
    thesis: str
    degree: str
    grades: str