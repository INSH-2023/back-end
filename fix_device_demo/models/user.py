from sqlalchemy import Table,Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, TIMESTAMP, DECIMAL
from sqlalchemy.sql import func
from config.db import meta, engine

userModel = Table(
    'users', meta,
    Column('userId',Integer,primary_key=True),
    Column('userName',String(50), nullable=False),
    Column('userEmail',String(100), nullable=False),
    Column('password',String(16), nullable=False),
    Column('role',String(5), nullable=False),
    Column('createdAt',TIMESTAMP(timezone=True),nullable=False, server_default=func.now()),
    Column('updatedAt',TIMESTAMP(timezone=True),default=None, onupdate=func.now())
)

deviceModel = Table(
    'devices', meta,
    Column('deviceId',Integer,primary_key=True),
    Column('name',String(50), nullable=False),
    Column('description',String(500), nullable=False),
    Column('duration',Integer, nullable=False),
)

fixModel = Table(
    'fixes', meta,
    Column('fixId',Integer,nullable=False),
    Column('deviceId',ForeignKey("devices.id"), primary_key=True),
    Column('userId',ForeignKey("users.id"), primary_key=True),
    Column('cost', DECIMAL(10,2),nullable=False)
)

meta.create_all(engine)