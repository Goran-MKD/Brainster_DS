from fastapi import FastAPI
from .routers import auth, ai

app = FastAPI()

app.include_router(auth.router, tags=["Authentication"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
