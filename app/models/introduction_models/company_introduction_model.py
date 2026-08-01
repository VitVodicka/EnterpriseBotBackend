from pydantic import BaseModel


class CompanyIntroductionModel(BaseModel):
    company_type: str
    industry: str
    company_size: int
