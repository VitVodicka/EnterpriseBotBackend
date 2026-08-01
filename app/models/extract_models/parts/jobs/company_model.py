from pydantic import BaseModel


class CompanyModel(BaseModel):
    company_name: str
    location: str