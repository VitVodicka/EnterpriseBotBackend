from typing import List
from pydantic import BaseModel


class ProjectModel(BaseModel):
    name:str
    description:str
    technologiesUsed:List[str]
    otherInfo: str
