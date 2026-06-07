from typing import List
from pydantic import BaseModel

from .skills.LanguageModel import LanguageModel
from .skills.SoftSkillModel import SoftSkillModel
from .skills.CourseSkillModel import CourseSkillModel
from .skills.CertificateModel import CertificateModel
from .skills.StandardModel import StandardModel
from .skills.DrivingSkillModel import DrivingSkillModel
from .skills.TechnicalSkillModel import TechnicalSkillModel
from .ReferenceModel import ReferenceModel


class SkillsModel(BaseModel):
    skills: List[TechnicalSkillModel]
    languages: List[LanguageModel]
    softSkills: List[SoftSkillModel]
    courses: List[CourseSkillModel]
    certificates: List[CertificateModel]
    standards: List[StandardModel]
    drivingSkills: List[DrivingSkillModel]
    references: List[ReferenceModel]
    otherInfo: str = ""
