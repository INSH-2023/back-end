from fastapi import APIRouter, status, HTTPException
from config.db import conn
from models.index import userModel
from schemas.index import UserEdit
from sqlalchemy import select
user = APIRouter()

user_list = [userModel.c.userId, userModel.c.userName, userModel.c.userEmail, 
userModel.c.role, userModel.c.createdAt, userModel.c.updatedAt]

api = "/api/users"

@user.get(api+"/")
async def read_data():
    return conn.execute(select(user_list)).fetchall()

@user.get(api+"/{id}")
async def read_detail(id: int):
    return conn.execute(select(user_list).where(userModel.c.userId == id)).fetchone()

@user.post(api+"/", status_code=status.HTTP_201_CREATED)
async def write_data(user: UserEdit):
    # error checking
    validate_unique(user,-1)

    conn.execute(userModel.insert().values(
        userName=user.userName,
        userEmail=user.userEmail,
        password=user.password,
        role=user.role
    ))
    return conn.execute(select(user_list)).fetchall()

@user.put(api+"/{id}")
async def update_data(id: int, user: UserEdit):
    # error checking
    validate_unique(user,id)

    conn.execute(userModel.update().values(
        userName=user.userName,
        userEmail=user.userEmail,
        password=user.password,
        role=user.role
    ).where(userModel.c.userId == id))
    
    return conn.execute(select(user_list).where(userModel.c.userId == id)).fetchone()

@user.delete(api+"/{id}")
async def delete_data(id: int):
    conn.execute(userModel.delete().where(userModel.c.userId == id))
    return conn.execute(select(user_list)).fetchall()

def validate_unique(user: UserEdit,id: int):
    user_unique_check = conn.execute(select(user_list)).fetchall()

    for user_item in user_unique_check:
        # validate unique character by list
        if id != user_item["userId"]:
            if user_item["userName"] == user.userName or user_item["userEmail"] == user.userEmail :
                raise HTTPException(status_code=400, detail="this user has been same by user name: "
                +user_item["userName"]+" or user email: "+user_item["userEmail"]+" is not unique")


