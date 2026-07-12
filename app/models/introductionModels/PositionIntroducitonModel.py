
from pydantic import BaseModel


class PositionIntroductionModel(BaseModel):
    PostionName: str
    JobDescription:str
    Skills: list[str]
    NiceToHaveSkills: list[str]
    Seniority: str
   