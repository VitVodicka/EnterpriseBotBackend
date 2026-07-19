from pydantic import BaseModel


class CompanyIntroductionModel(BaseModel):
    CompanyType: str
    Industry: str
    CompanySize: int
