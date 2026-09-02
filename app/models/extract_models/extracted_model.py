
from typing import List

from pyasn1.type.univ import Null
from pydantic import BaseModel

from .parts.jobs.job_model import JobModel
from .parts.education_model import EducationModel
from .parts.skills_model import SkillsModel
from .parts.projects.project_model import ProjectModel
from .parts.skills.reference_model import ReferenceModel


class ExtractedModel(BaseModel):
    candidate_name: str
    candidate_location: str | None = None
    job_experience: List[JobModel] = []
    education: EducationModel
    skills: SkillsModel
    projects: ProjectModel
    hobbies: list[str] = []
    references: List[ReferenceModel]