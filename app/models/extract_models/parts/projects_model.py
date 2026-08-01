from pydantic import BaseModel

from .projects.project_model import ProjectModel

class ProjectsModel(BaseModel):
    projects: list[ProjectModel]
