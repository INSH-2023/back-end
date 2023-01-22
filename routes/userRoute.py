from fastapi import APIRouter
from config.db import conn
from models.index import users
from schemas.index import User
user = APIRouter()

@user.get("/")
async def read_data():
    
    return conn.execute(users.select()).fetchall()

@user.get("/{id}")
async def read_detail(id: int):
    return conn.execute(users.select().where(users.c.userId == id)).fetchall()

@user.post("/")
async def write_data(user: User):
    conn.execute(users.insert().values(
        userName=user.userName,
        userEmail=user.userEmail,
        password=user.password,
        role=user.role
    ))
    return conn.execute(users.select()).fetchall()

@user.put("/{id}")
async def update_data(id: int, user: User):
    conn.execute(users.update().values(
        userName=user.userName,
        userEmail=user.userEmail,
        password=user.password,
        role=user.role
    ).where(users.c.userId == id))
    return conn.execute(users.select().where(users.c.userId == id)).fetchall()

@user.delete("/{id}")
async def delete_data(id: int):
    conn.execute(users.delete().where(users.c.userId == id))
    return conn.execute(users.select()).fetchall()