from fastapi import APIRouter, status, HTTPException
from config.db import conn
from models.index import itemModel
from schemas.index import ItemEdit
from sqlalchemy import select
item = APIRouter()

api = "/api/items"

@item.get(api+"/")
async def read_data(search: str =''):
    return conn.execute(select().where(itemModel.c.name.contains(search))).fetchall()

@item.get(api+"/{id}")
async def read_detail(id: int):
    if not conn.execute(select().where(itemModel.c.itemId == id)).fetchone():
        raise HTTPException(status_code=404, detail="item id:" + str(id) + "does not exist")
    return conn.execute(select().where(itemModel.c.itemId == id)).fetchone()

@item.post(api+"/", status_code=status.HTTP_201_CREATED)
async def write_data(item: ItemEdit):

    conn.execute(itemModel.insert().values(
        full_name=item.name,
        email=item.email,
        service_type=item.service_type,
        group_work=item.group_work,
        subject=item.subject,
        status=item.status,
        req_date=item.req_date,
        assign=item.assign
    ))
    return conn.execute(select()).fetchall()

@item.put(api+"/{id}")
async def update_data(id: int, item: ItemEdit):
    # not found checking
    if not conn.execute(select().where(itemModel.c.itemId == id)).fetchone():
        raise HTTPException(status_code=404, detail="item id:" + str(id) + "does not exist")

    conn.execute(itemModel.update().values(
        full_name=item.full_name,
        email=item.email,
        service_type=item.service_type,
        group_work=item.group_work,
        subject=item.subject,
        status=item.status,
        req_date=item.req_date,
        assign=item.assign
    ).where(itemModel.c.requestId == id))
    
    return conn.execute(select().where(itemModel.c.requestId == id)).fetchone()

@item.delete(api+"/{id}")
async def delete_data(id: int):
    conn.execute(itemModel.delete().where(itemModel.c.requestId == id))
    return conn.execute(select()).fetchall()