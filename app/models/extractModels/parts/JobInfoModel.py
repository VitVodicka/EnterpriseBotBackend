from typing import List
from .jobs.JobModel import JobModel
from pydantic import BaseModel
from datetime import date

class JobInfoModel(BaseModel):
    jobExperience: List[JobModel]
    spaceBetweenJobs: date
