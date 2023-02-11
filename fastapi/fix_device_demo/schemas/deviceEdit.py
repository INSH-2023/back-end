from pydantic import BaseModel

class deviceEdit(BaseModel):
    name: str
    description: str
    duration: int