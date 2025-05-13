from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import insights_router
import uvicorn
from config import config

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(insights_router, tags=["Insights Dashboard"])

def main():
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=config.PORT,
        reload=True,
    )
if __name__ == "__main__":
    main()