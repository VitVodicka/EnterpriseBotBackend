from pydantic import BaseModel

from .PositionIntroducitonModel import PositionIntroductionModel


class CompanyIntroductionmodel(BaseModel):
    CompanyType: str
    Indsutry: str
    CompanySIze: int
    Position: PositionIntroductionModel