from pydantic import BaseModel

# Import the SchoolModel class from the sibling module
from .SchoolModel import SchoolModel

class HighSchoolModel(SchoolModel):
    specialization: str