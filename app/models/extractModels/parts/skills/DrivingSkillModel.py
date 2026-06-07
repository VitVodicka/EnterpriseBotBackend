from pydantic import BaseModel


class DrivingSkillModel(BaseModel):
    category: str  
    otherInfo: str = ""
