from string import Template


class FileService:
    def __init__(self) -> None:
        pass

    def read_file(self, file_path: str) -> str:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
        
    def load_dynamic_prompt(self, file_path: str, **kwargs) -> str:
        with open(file_path, 'r', encoding='utf-8') as file:
            prompt_template = Template(file.read())
        return prompt_template.safe_substitute(**kwargs)