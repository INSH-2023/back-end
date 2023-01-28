from fastapi import APIRouter
from config.db import conn
from models.index import deviceModel, fixModel
from sqlalchemy import select
device = APIRouter()

device_list1 = [fixModel.c.fixId, fixModel.c.deviceId, deviceModel.c.name, deviceModel.c.description, 
deviceModel.c.duration, fixModel.c.userId, fixModel.c.cost]

device_list2 = [fixModel.c.deviceId, deviceModel.c.name, deviceModel.c.description, 
deviceModel.c.duration]

api = "/api/devices"

# list devices that problem on users
@device.get(api)
async def read_data(search: str = '', page: int = 1, limit: int = 10):
    result = conn.execute(select(device_list1).where(fixModel.c.deviceId == deviceModel.c.deviceId)
    .where(deviceModel.c.name.contains(search))
    .order_by(deviceModel.c.duration.desc(),deviceModel.c.name)).fetchall()
    start = (page - 1)*limit
    end = start + limit
    return result[start:end]

# list devices on userId
@device.get(api+"/user/{userId}")
async def read_detail(userId: int):
    return conn.execute(select(device_list2).where(fixModel.c.deviceId == deviceModel.c.deviceId).where(fixModel.c.userId == userId)).fetchall()