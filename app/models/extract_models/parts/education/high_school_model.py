from pydantic import BaseModel

# Import the SchoolModel class from the sibling module
from app.models.extract_models.parts.education.school_model import SchoolModel

class HighSchoolModel(SchoolModel):
    specialization: str