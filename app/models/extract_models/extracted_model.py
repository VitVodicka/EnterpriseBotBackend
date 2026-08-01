
from typing import List

from pydantic import BaseModel

from .parts.basics_model import BasicModel
from .parts.job_info_model import JobInfoModel
from .parts.education_model import EducationModel
from .parts.skills_model import SkillsModel
from .parts.projects_model import ProjectsModel
from .parts.hobbies_model import HobbiesModel
from .parts.reference_model import ReferenceModel


class ExtractedModel(BaseModel):
    basic_info: BasicModel
    job_info: JobInfoModel
    education: EducationModel
    skills: SkillsModel
    projects: ProjectsModel
    hobbies: HobbiesModel
    references: List[ReferenceModel]