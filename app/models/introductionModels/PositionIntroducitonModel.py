
from pydantic import BaseModel


class PositionIntroductionModel(BaseModel):
    PositionName: str
    JobDescription:str
    Skills: list[str]
    NiceToHaveSkills: list[str]
    Seniority: str
   