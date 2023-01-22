from pydantic import BaseModel

class User(BaseModel):
    userName: str
    userEmail: str
    password: str
    role: str
    