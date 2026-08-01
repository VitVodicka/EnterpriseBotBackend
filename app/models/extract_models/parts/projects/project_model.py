from typing import List
from pydantic import BaseModel


class ProjectModel(BaseModel):
    name:str
    description:str
    technologies_used:List[str]
    other_info: str
