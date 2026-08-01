from pydantic import BaseModel


class CourseSkillModel(BaseModel):
    name: str
    provider: str = ""
    year: int | None = None
    other_info: str = ""
