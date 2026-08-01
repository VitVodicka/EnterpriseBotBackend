from pydantic import BaseModel


class SoftSkillModel(BaseModel):
    name: str
    other_info: str = ""
