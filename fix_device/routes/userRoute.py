from fastapi import APIRouter, status, HTTPException
from config.db import conn
from models.index import userModel
from schemas.index import UserEdit
from sqlalchemy import select
user = APIRouter()

user_list = [userModel.c.userId, userModel.c.emp_code, userModel.c.full_name, userModel.c.email,
userModel.c.role, userModel.c.group_work, userModel.c.office, userModel.c.status, userModel.c.position,
userModel.c.createdAt, userModel.c.updatedAt]

api = "/api/users"

@user.get(api+"/")
async def read_data(search: str =''):
    return conn.execute(select(user_list).where(userModel.c.full_name.contains(search))).fetchall()

@user.get(api+"/{id}")
async def read_detail(id: int):
    if not conn.execute(select(user_list).where(userModel.c.userId == id)).fetchone():
        raise HTTPException(status_code=404, detail=f"user id: {id} does not exist")
    return conn.execute(select(user_list).where(userModel.c.userId == id)).fetchone()

@user.post(api+"/", status_code=status.HTTP_201_CREATED)
async def write_data(user: UserEdit):
    # error checking
    validate_unique(user,-1)

    conn.execute(userModel.insert().values(
        emp_code=user.emp_code,
        full_name=user.full_name,
        email=user.email,
        password=user.password,
        role=user.role,
        group_work=user.group_work,
        office=user.office,
        status=user.status,
        position=user.position
    ))
    return conn.execute(select(user_list)).fetchall()

@user.put(api+"/{id}")
async def update_data(id: int, user: UserEdit):
    # not found checking
    if not conn.execute(select(user_list).where(userModel.c.userId == id)).fetchone():
        raise HTTPException(status_code=404, detail="user id:" + str(id) + "does not exist")

    # error checking
    validate_unique(user,id)

    conn.execute(userModel.update().values(
        emp_code=user.emp_code,
        full_name=user.full_name,
        email=user.email,
        password=user.password,
        role=user.role,
        group_work=user.group_work,
        office=user.office,
        status=user.status,
        position=user.position
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
            if user_item["emp_code"] == user.emp_code or user_item["full_name"] == user.full_name or user_item["email"] == user.email :
                raise HTTPException(status_code=400, detail="this user has been same by employee code: "+str(user_item["emp_code"]) +", user name: "
                +user_item["full_name"]+" and user email: "+user_item["email"])


