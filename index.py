from fastapi import FastAPI
from routes.index import user, device
app = FastAPI()

app.include_router(user)
app.include_router(device)