from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import insights_router
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(insights_router, prefix="/api", tags=["Insights Dashboard"])

def main():
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8005,
        reload=True,
    )
if __name__ == "__main__":
    main()