from fastapi import APIRouter, status, HTTPException
from config.db import conn
from models.index import requestModel
from schemas.index import RequestEdit
from sqlalchemy import select
request = APIRouter()

api = "/api/requests"

@request.get(api+"/")
async def read_data(search: str =''):
    return conn.execute(select().where(requestModel.c.full_name.contains(search))).fetchall()

@request.get(api+"/{id}")
async def read_detail(id: int):
    if not conn.execute(select().where(requestModel.c.requestId == id)).fetchone():
        raise HTTPException(status_code=404, detail="request id:" + str(id) + "does not exist")
    return conn.execute(select().where(requestModel.c.requestId == id)).fetchone()

@request.post(api+"/", status_code=status.HTTP_201_CREATED)
async def write_data(request: RequestEdit):

    conn.execute(requestModel.insert().values(
        full_name=request.full_name,
        email=request.email,
        service_type=request.service_type,
        group_work=request.group_work,
        subject=request.subject,
        status=request.status,
        req_date=request.req_date,
        assign=request.assign
    ))
    return conn.execute(select()).fetchall()

@request.put(api+"/{id}")
async def update_data(id: int, request: RequestEdit):
    # not found checking
    if not conn.execute(select().where(requestModel.c.requestId == id)).fetchone():
        raise HTTPException(status_code=404, detail="request id:" + str(id) + "does not exist")

    conn.execute(requestModel.update().values(
        full_name=request.full_name,
        email=request.email,
        service_type=request.service_type,
        group_work=request.group_work,
        subject=request.subject,
        status=request.status,
        req_date=request.req_date,
        assign=request.assign
    ).where(requestModel.c.requestId == id))
    
    return conn.execute(select().where(requestModel.c.requestId == id)).fetchone()

@request.delete(api+"/{id}")
async def delete_data(id: int):
    conn.execute(requestModel.delete().where(requestModel.c.requestId == id))
    return conn.execute(select()).fetchall()