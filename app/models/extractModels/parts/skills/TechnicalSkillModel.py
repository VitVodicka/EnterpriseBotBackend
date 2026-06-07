from pydantic import BaseModel


class TechnicalSkillModel(BaseModel):
    name: str
    level: str = ""  # napr. zacatecnik, pokrocily, expert
    otherInfo: str = ""
