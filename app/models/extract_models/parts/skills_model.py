from typing import List
from pydantic import BaseModel


from .skills.language_model import LanguageModel
from .skills.soft_skill_model import SoftSkillModel
from .skills.course_skill_model import CourseSkillModel
from .skills.certificate_model import CertificateModel
from .skills.standard_model import StandardModel
from .skills.driving_skill_model import DrivingSkillModel
from .skills.technical_skill_model import TechnicalSkillModel
from .skills.reference_model import ReferenceModel

class SkillsModel(BaseModel):
    skills: List[TechnicalSkillModel]
    languages: List[LanguageModel]
    softSkills: List[SoftSkillModel]
    courses: List[CourseSkillModel]
    certificates: List[CertificateModel]
    standards: List[StandardModel]
    driving_skills: List[DrivingSkillModel]
    references: List[ReferenceModel]
    otherInfo: str = ""
