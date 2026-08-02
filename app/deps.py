from fastapi import Depends

from app.services.gemini.company_intent_extractor_service import CompanyIntentExtractorService
from app.services.gemini.evaluate_service import EvaluateService
from app.services.gemini.extract_service import ExtractService
from app.services.gemini.gemini import GeminiService
from app.services.gemini.recommendation_service import RecommendationService


def get_gemini_service() -> GeminiService:
    return GeminiService()


def get_intent_extractor_service(gemini: GeminiService = Depends(get_gemini_service)) -> CompanyIntentExtractorService:
    return CompanyIntentExtractorService(gemini)


def get_extract_service(gemini: GeminiService = Depends(get_gemini_service)) -> ExtractService:
    return ExtractService(gemini)


def get_evaluate_service(gemini: GeminiService = Depends(get_gemini_service)) -> EvaluateService:
    return EvaluateService(gemini)


def get_recommendation_service(gemini: GeminiService = Depends(get_gemini_service)) -> RecommendationService:
    return RecommendationService(gemini)