from fastapi import APIRouter
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
    return conn.execute(select(user_list).where(userModel.c.userId == id)).fetchall()

@user.post(api+"/")
async def write_data(user: UserEdit):
    conn.execute(userModel.insert().values(
        userName=user.userName,
        userEmail=user.userEmail,
        password=user.password,
        role=user.role
    ))
    return conn.execute(select(user_list)).fetchall()

@user.put(api+"/{id}")
async def update_data(id: int, user: UserEdit):
    conn.execute(userModel.update().values(
        userName=user.userName,
        userEmail=user.userEmail,
        password=user.password,
        role=user.role
    ).where(userModel.c.userId == id))
    return conn.execute(select(user_list).where(userModel.c.userId == id)).fetchall()

@user.delete(api+"/{id}")
async def delete_data(id: int):
    conn.execute(userModel.delete().where(userModel.c.userId == id))
    return conn.execute(select(user_list)).fetchall()