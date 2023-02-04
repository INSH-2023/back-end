from pydantic import BaseModel, validator
from fastapi import HTTPException
from models.role import Role
import re

class UserEdit(BaseModel):
    emp_code: int
    full_name: str
    email: str
    password: str
    role: str
    group_work: str
    office: str
    status: str
    position: str

    @validator("emp_code")
    def emp_code_validator(cls, value):
        if not value:
            raise HTTPException(status_code=400, detail="employee code is not null")
        if value <= 0:
            raise HTTPException(status_code=400, detail="employee code must have more than 0")
        return value

    @validator("full_name")
    def name_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user name is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user name have not more length than 100 letters")
        return value
    
    @validator("email")
    def email_validator(cls, value):
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
            raise HTTPException(status_code=400, detail="role is not null")
        value = value.strip().lower()
        if not value.__eq__(Role.ADMIN.value) and not value.__eq__(Role.USER.value):
            raise HTTPException(status_code=400, detail="this role is not admin or user")
        return value
    
    @validator("group_work")
    def group_work_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="group work is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="group work have not more length than 100 letters")
        return value
    
    @validator("office")
    def office_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="office is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="office have not more length than 100 letters")
        return value
    
    @validator("status")
    def status_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="status is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="status have not more length than 100 letters")
        return value
    
    @validator("position")
    def position_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="position is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="position have not more length than 100 letters")
        return value