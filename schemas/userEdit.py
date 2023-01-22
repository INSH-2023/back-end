from pydantic import BaseModel

class UserEdit(BaseModel):
    userName: str
    userEmail: str
    password: str
    role: str