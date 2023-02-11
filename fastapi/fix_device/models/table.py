from sqlalchemy import Table,Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, TIMESTAMP, DATE
from sqlalchemy.sql import func
from config.db import meta, engine

userModel = Table(
    'user', meta,
    Column('userId',Integer,primary_key=True),
    Column('emp_code',Integer, nullable=False),
    Column('full_name',String(100), nullable=False),
    Column('email',String(100), nullable=False),
    Column('password',String(100), nullable=False),
    Column('role',String(5), nullable=False),
    Column('group_work',String(100), nullable=False),
    Column('office',String(100), nullable=False),
    Column('status',String(100), nullable=False),
    Column('position',String(100), nullable=False),
    Column('createdAt',TIMESTAMP(timezone=True),nullable=False, server_default=func.now()),
    Column('updatedAt',TIMESTAMP(timezone=True),default=None, onupdate=func.now())
)

requestModel = Table(
    'request', meta,
    Column('requestId',Integer,primary_key=True),
    Column('full_name',String(100), nullable=False),
    Column('email',String(100), nullable=False),
    Column('group_work',String(100), nullable=False),
    Column('service_type',String(100), nullable=False),
    Column('subject',String(100), nullable=False),
    Column('status',String(100), nullable=False),
    Column('req_date',DATE, nullable=False),
    Column('assign',String(100), nullable=False),
)

itemModel = Table(
    'item', meta,
    Column('itemId',Integer,nullable=False),
    Column('name',String(100), nullable=False),
    Column('number',String(100), nullable=False),
    Column('SL',String(15), nullable=False),
    Column('SW',String(13), nullable=False),
    Column('sent_date',DATE, nullable=False),
    Column('type',String(100), nullable=False),
    Column('note', String(100),nullable=False)
)

meta.create_all(engine)