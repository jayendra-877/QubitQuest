from fastapi import FastAPI
from app.api.execution_routes import router

app = FastAPI(title="QubitQuest Quantum Execution Service")

app.include_router(router)