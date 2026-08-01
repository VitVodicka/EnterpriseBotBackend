from typing import List
from .jobs.job_model import JobModel
from pydantic import BaseModel
from datetime import date

class JobInfoModel(BaseModel):
    job_experience: List[JobModel]
    space_between_jobs: date
