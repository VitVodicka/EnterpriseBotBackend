from pydantic import BaseModel


class SoftSkillModel(BaseModel):
    name: str
    otherInfo: str = ""
