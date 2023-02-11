from pydantic import BaseModel, validator
from fastapi import HTTPException
from datetime import date

class ItemEdit(BaseModel):
    name: str
    number: str
    SL: str
    SW: str
    sent_date: date
    type: str
    note: str

    @validator("name")
    def name_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="item name is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="item name have not more length than 100 letters")
        return value
    
    @validator("number")
    def number_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="item ref number is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="item ref number have not more length than 100 letters")
        return value

    @validator("SL")
    def SL_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="item SL is not null")
        value = value.strip()
        if len(value) == 15:
            raise HTTPException(status_code=400, detail="item SL have not more length than 100 letters")
        return value
    
    @validator("SW")
    def SW_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="item SW is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="item SW have not more length than 100 letters")
        return value
    
    @validator("sent_date")
    def sent_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="sent item date is not null")
        value = value.strip()
        if type(value) == date:
            raise HTTPException(status_code=400, detail="sent item date have not date format")
        return value
    
    @validator("type")
    def type_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="item type is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="item type have not more length than 100 letters")
        return value
    
    @validator("note")
    def note_validator(cls, value):
        if value == '' or not value:
            raise HTTPException(status_code=400, detail="item note is not null")
        value = value.strip()
        if len(value) >= 100:
            raise HTTPException(status_code=400, detail="item note have not more length than 100 letters")
        return value