from datetime import date

from pydantic import BaseModel

from .CompanyModel import CompanyModel


class JobModel(BaseModel):
    company: CompanyModel
    location: str
    position: str
    startDate: date
    endDate: date
    otherInfo: str
    technologiesUsed: list[str]
    teamSize: int
    workingHours: str

