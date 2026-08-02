from app.helper.file_convertor_helper import FileConvertorHelper
from app.models.introduction_models.company_introduction_model import CompanyIntroductionModel
from app.models.introduction_models.position_introduciton_model import PositionIntroductionModel
from app.helper.file_service_helper import FileService
from app.services.gemini.gemini import GeminiService


class CompanyIntentExtractorService:

    def __init__(self, gemini_service: GeminiService ):
        self.gemini_service = gemini_service

    async def extract_company_intent(self, job_ad: str, company_introduction: CompanyIntroductionModel) -> str:
        # from this it will be a part position and company info in a prompt for next sections

        if len(job_ad) < 50:
            raise ValueError("Job ad is too short")

        candidate_info = await self.gemini_service.call_gemini_prompt(job_ad, [], PositionIntroductionModel)

        position_prompt = FileService().load_dynamic_prompt(
            'app/prompts/position_context.txt',
            position_name=FileConvertorHelper.clean_unknown(candidate_info.PositionName),
            seniority=FileConvertorHelper.clean_unknown(candidate_info.Seniority),
            job_description=candidate_info.JobDescription,
            skills_formatted=FileConvertorHelper.format_skill_list(candidate_info.Skills),
            nice_to_have_formatted=FileConvertorHelper.format_skill_list(candidate_info.NiceToHaveSkills),
        )

        company_prompt = FileService().load_dynamic_prompt(
            'app/prompts/company_info.txt',
            company_type=company_introduction.company_type,
            industry=company_introduction.industry,
            company_size=company_introduction.company_size,
        )

        return position_prompt + company_prompt
        