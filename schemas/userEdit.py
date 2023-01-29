from pydantic import BaseModel, validator
from fastapi import HTTPException
from models.role import Role
import re

class UserEdit(BaseModel):
    userName: str
    userEmail: str
    password: str
    role: str

    @validator("userName")
    def userName_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user name is not null")
        value = value.strip()
        if len(value) >= 50:
            raise HTTPException(status_code=400, detail="user name have not more length than 50 letters")
        return value
    
    @validator("userEmail")
    def userEmail_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user email is not null")
        value = value.strip()
        
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user email have not more length than 100 letters")
 
        # Make a regular expression
        # for validating an Email
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if not re.fullmatch(regex, value):
            raise HTTPException(status_code=400, detail="user email have not email format")
        return value

    @validator("password")
    def password_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="password is not null")
        value = value.strip()
        
        if len(value) >= 16 or len(value) < 8:
            raise HTTPException(status_code=400, detail="password input between 8-16 characters")
        return value
    
    @validator("role")
    def role_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user name is not null")
        value = value.strip().lower()
        if not value.__eq__(Role.ADMIN.value) and not value.__eq__(Role.USER.value):
            raise HTTPException(status_code=400, detail="user name have not roles")
        return value