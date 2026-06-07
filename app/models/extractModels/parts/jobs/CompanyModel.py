from pydantic import BaseModel


class CompanyModel(BaseModel):
    companyName: str
    location: str