from pydantic import BaseModel, validator
from fastapi import HTTPException
from datetime import date
import re

class RequestEdit(BaseModel):
    full_name: str
    email: str
    group_work: str
    service_type: str
    subject: str
    status: str
    req_date: date
    assign: str

    @validator("full_name")
    def full_name_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user who request name is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user who request name have not more length than 100 letters")
        return value
    
    @validator("email")
    def email_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user who request email is not null")
        value = value.strip()
        
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user who request email have not more length than 100 letters")
 
        # Make a regular expression
        # for validating an Email
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if not re.fullmatch(regex, value):
            raise HTTPException(status_code=400, detail="who request have not email format")
        return value

    @validator("group_work")
    def group_work_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user who request group work is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user who request group work have not more length than 100 letters")
        return value
    
    @validator("service_type")
    def service_type_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user who request service type is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user who request service type have not more length than 100 letters")
        return value

    @validator("subject")
    def subject_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user who request subject is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user who request subject have not more length than 100 letters")
        return value

    @validator("status")
    def status_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user who request status is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user who request status have not more length than 100 letters")
        return value
    
    @validator("req_date")
    def req_date_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user who request date is not null")
        value = value.strip()
        if type(value) != date:
            raise HTTPException(status_code=400, detail="user who request date have not date format")
        return value

    @validator("assign")
    def assign_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="user who request assign is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="user who request assign have not more length than 100 letters")
        return value


