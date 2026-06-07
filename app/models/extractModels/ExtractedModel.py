
from typing import List

from pydantic import BaseModel

from .parts.BasicsModel import BasicModel
from .parts.JobInfoModel import JobInfoModel
from .parts.BasicsModel import BaseModel
from .parts.EducationModel import EducationModel
from .parts.SkillsModel import SkillsModel
from .parts.ProjectsModel import ProjectsModel
from .parts.HobbiesModel import HobbiesModel
from .parts.ReferenceModel import ReferenceModel


class ExtractedModel(BaseModel):
    basicInfo: BasicModel
    jobInfo: JobInfoModel
    education: EducationModel
    skills: SkillsModel
    projects: ProjectsModel
    hobbies: HobbiesModel
    refereces: List[ReferenceModel]