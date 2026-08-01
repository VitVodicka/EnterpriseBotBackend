from pydantic import BaseModel


class TechnicalSkillModel(BaseModel):
    name: str
    level: str = ""  # napr. zacatecnik, pokrocily, expert
    other_info: str = ""
