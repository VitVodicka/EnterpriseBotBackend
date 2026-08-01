from pydantic import BaseModel, ConfigDict, Field


class CompanyIntroductionModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    company_type: str = Field(..., alias="CompanyType")
    industry: str = Field(..., alias="Industry")
    company_size: int = Field(..., alias="CompanySize")
