from pathlib import Path
from string import Template


class FileService:
    def __init__(self) -> None:
        pass

    def read_file(self, file_path: str) -> str:
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"Soubor nenalezen: {file_path}")

        if not path.is_file():
            raise IsADirectoryError(f"Cesta neukazuje na soubor: {file_path}")

        try:
            with path.open("r", encoding="utf-8") as file:
                content = file.read()
        except UnicodeDecodeError as exc:
            raise ValueError(f"Soubor není v UTF-8: {file_path}") from exc
        except OSError as exc:
            raise OSError(f"Nepodařilo se přečíst soubor: {file_path}") from exc

        if not content.strip():
            raise ValueError(f"Soubor je prázdný: {file_path}")

        return content

    def load_dynamic_prompt(self, file_path: str, **kwargs) -> str:
        content = self.read_file(file_path)
        prompt_template = Template(content)
        return prompt_template.safe_substitute(**kwargs)