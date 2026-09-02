from datetime import date

from pydantic import BaseModel



class JobModel(BaseModel):
    company_name: str
    company_location: str = ""
    position: str
    startDate: date
    endDate: date | None = None
    other_info: str = ""
    technologies_used: list[str] = []
    team_size: int | None = None
    working_hours: str = ""
