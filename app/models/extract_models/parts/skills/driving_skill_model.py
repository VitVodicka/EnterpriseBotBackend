from pydantic import BaseModel


class DrivingSkillModel(BaseModel):
    category: str  
    other_info: str = ""
