from app.helper.fileConvertorHelper import FileConvertorHelper
from app.models.introductionModels.CompanyIntroductionModel import CompanyIntroductionModel
from app.models.introductionModels.PositionIntroducitonModel import PositionIntroductionModel
from app.services import fileService
from app.services.gemini.gemini import GeminiService


class CompanyIntentExtractorService:

    def __init__(self, gemini_service: GeminiService | None = None) -> None:
        self.geminiService = gemini_service or GeminiService()

    

    async def extractCompanyIntent(self, jobAd: str, companyIntroduction: CompanyIntroductionModel)->str:
        # from this it will be a part position and company info in a prompt for next sections

        if len(jobAd) < 50:
            raise ValueError("Job ad is too short")

        candidateInfo = await self.geminiService.callGeminiPrompt(jobAd, [], PositionIntroductionModel)

        position_prompt = fileService.FileService().loadDynamicPrompt(
            'app/prompts/position_context.txt',
            PositionName=FileConvertorHelper.clean_unknown(candidateInfo.PositionName),
            Seniority=FileConvertorHelper.clean_unknown(candidateInfo.Seniority),
            JobDescription=candidateInfo.JobDescription,
            skills_formatted=FileConvertorHelper.format_skill_list(candidateInfo.Skills),
            nice_to_have_formatted=FileConvertorHelper.format_skill_list(candidateInfo.NiceToHaveSkills),
        )

        companyPrompt = fileService.FileService().loadDynamicPrompt(
            'app/prompts/company_info.txt',
            CompanyType=companyIntroduction.CompanyType,
            Industry=companyIntroduction.Industry,
            CompanySize=companyIntroduction.CompanySize,
        )

        return position_prompt+companyPrompt
        