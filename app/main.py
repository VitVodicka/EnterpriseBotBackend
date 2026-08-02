from fastapi import FastAPI

from app.api.v1.routes import upload

app = FastAPI(title="CV Recommender")

app.include_router(upload.router)