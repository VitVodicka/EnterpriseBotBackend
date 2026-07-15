class FileService():
    def __init__(self) -> None:
        pass

    def readFile(self, file_path: str) -> str:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()