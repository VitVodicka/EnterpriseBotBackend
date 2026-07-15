from pydantic import BaseModel

from .PositionIntroducitonModel import PositionIntroductionModel


class CompanyIntroductionModel(BaseModel):
    CompanyType: str
    Industry: str
    CompanySize: int
    Position: PositionIntroductionModel