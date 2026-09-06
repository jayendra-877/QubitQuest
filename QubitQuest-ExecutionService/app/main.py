import logging

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.execution_routes import router


logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s | "
        "%(levelname)s | "
        "%(name)s | "
        "%(message)s"
    ),
)


app = FastAPI(
    title="QubitQuest Quantum Execution Service",
    description=(
        "Production-ready quantum circuit "
        "execution service powered by "
        "Qiskit and Qiskit Aer."
    ),
    version="1.0.0",
)


@app.exception_handler(
    RequestValidationError
)
async def validation_exception_handler(
    request,
    exc,
):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "status": "failed",
            "error_code": "REQUEST_VALIDATION_ERROR",
            "error": "Invalid request data.",
            "details": exc.errors(),
        },
    )


app.include_router(router)


@app.get("/")
def root():
    return {
        "service": (
            "QubitQuest Quantum "
            "Execution Service"
        ),
        "status": "running",
        "framework": "qiskit",
        "backend": "qiskit_aer",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": (
            "quantum-execution-service"
        ),
    }