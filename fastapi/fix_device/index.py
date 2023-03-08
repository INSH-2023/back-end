from fastapi import FastAPI
from routes.index import user, request, item
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(str(exc), status_code=400)

app.include_router(user)
app.include_router(request)
app.include_router(item)