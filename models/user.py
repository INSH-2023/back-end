from sqlalchemy import Table,Column
from sqlalchemy.sql.sqltypes import Integer, String, TIMESTAMP
from sqlalchemy.sql import func
from config.db import meta, engine

users = Table(
    'users', meta,
    Column('userId',Integer,primary_key=True),
    Column('userName',String(50), nullable=False),
    Column('userEmail',String(500), nullable=False),
    Column('password',String(16), nullable=False),
    Column('role',String(5), nullable=False),
    Column('createdAt',TIMESTAMP(timezone=True),nullable=False, server_default=func.now()),
    Column('updatedAt',TIMESTAMP(timezone=True),default=None, onupdate=func.now())
)

meta.create_all(engine)