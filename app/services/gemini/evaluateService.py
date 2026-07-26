
from app.helper.fileConvertorHelper import FileConvertorHelper
from app.helper.fileConvertorHelper import FileConvertorHelper
from app.models.evaluateModels.EvaluatedModel import EvaluatedModel
from app.models.extractModels.ExtractedModel import ExtractedModel
from app.services import fileService
from app.services.gemini.gemini import GeminiService


class EvaluateService:
    def __init__(self):
        self.geminiService = GeminiService()   

    async def evaluateCVs(self, extractedCVs: tuple[ExtractedModel, ExtractedModel], jobInfo: str) -> tuple[EvaluatedModel, EvaluatedModel]:
        evaluate_prompt_cv1 = jobInfo + fileService.FileService().loadDynamicPrompt(
            'app/prompts/evaluate.txt',
            cv=extractedCVs[0].model_dump_json(),
        )
        

        evaluate_prompt_cv2 = jobInfo + fileService.FileService().loadDynamicPrompt(
            'app/prompts/evaluate.txt',
            cv=extractedCVs[1].model_dump_json(),  
        )

        evaluatedCV1 = await self.geminiService.callGeminiPrompt(evaluate_prompt_cv1, [], EvaluatedModel)
        evaluatedCV2 = await self.geminiService.callGeminiPrompt(evaluate_prompt_cv2, [], EvaluatedModel)
        
        print("evaluatedCV1: ", evaluatedCV1)
        print("evaluatedCV2: ", evaluatedCV2)

        return (evaluatedCV1, evaluatedCV2)
        
        
       