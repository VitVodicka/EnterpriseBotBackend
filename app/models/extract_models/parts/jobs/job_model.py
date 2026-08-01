from datetime import date

from pydantic import BaseModel

from .company_model import CompanyModel


class JobModel(BaseModel):
    company: CompanyModel
    location: str
    position: str
    startDate: date
    endDate: date
    other_info: str
    technologies_used: list[str]
    team_size: int
    working_hours: str

