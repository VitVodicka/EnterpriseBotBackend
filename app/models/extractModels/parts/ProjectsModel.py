from pydantic import BaseModel

from .projects.ProjectModel import ProjectModel

class ProjectsModel(BaseModel):
    projects: list[ProjectModel]
