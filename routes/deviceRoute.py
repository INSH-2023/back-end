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
@device.get(api+"/")
async def read_data():
    print("T")
    return conn.execute(select(device_list1).where(fixModel.c.deviceId == deviceModel.c.deviceId)).fetchall()

# list devices on userId
@device.get(api+"/user/{userId}")
async def read_detail(userId: int):
    return conn.execute(select(device_list2).where(fixModel.c.deviceId == deviceModel.c.deviceId)
    .where(fixModel.c.userId == userId)).fetchall()