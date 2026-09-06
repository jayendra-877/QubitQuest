import logging
import time
import uuid

from fastapi import APIRouter, HTTPException

from app.models.circuit_models import (
    CircuitRequest,
    CircuitResponse,
)

from app.services.qiskit_service import (
    get_bloch_coordinates,
    get_circuit_metadata,
    get_statevector,
    run_circuit,
)


router = APIRouter()

logger = logging.getLogger(
    "execution_service"
)


def create_error(
    request_id,
    error_code,
    message,
):
    return {
        "success": False,
        "status": "failed",
        "request_id": request_id,
        "error_code": error_code,
        "error": message,
    }


@router.post(
    "/execute",
    response_model=CircuitResponse,
)
def execute_circuit(
    request: CircuitRequest,
):
    request_id = str(uuid.uuid4())

    start_time = time.perf_counter()

    logger.info(
        "Execution started | "
        "request_id=%s | "
        "qubits=%s | "
        "gates=%s | "
        "shots=%s | "
        "mode=%s",
        request_id,
        request.qubits,
        len(request.gates),
        request.shots,
        request.mode,
    )

    try:
        metadata = get_circuit_metadata(
            qubits=request.qubits,
            gates=request.gates,
        )

        counts = None
        probabilities = None
        statevector = None
        bloch_sphere = None

        if request.mode in {
            "measure",
            "all",
        }:
            result = run_circuit(
                qubits=request.qubits,
                gates=request.gates,
                shots=request.shots,
            )

            counts = result["counts"]
            probabilities = result[
                "probabilities"
            ]

        if request.mode in {
            "statevector",
            "all",
        }:
            statevector = get_statevector(
                qubits=request.qubits,
                gates=request.gates,
            )

        if request.mode in {
            "bloch",
            "all",
        }:
            bloch_sphere = (
                get_bloch_coordinates(
                    qubits=request.qubits,
                    gates=request.gates,
                )
            )

        execution_time_ms = round(
            (
                time.perf_counter()
                - start_time
            ) * 1000,
            2,
        )

        logger.info(
            "Execution completed | "
            "request_id=%s | "
            "time_ms=%s",
            request_id,
            execution_time_ms,
        )

        return {
            "success": True,
            "status": "completed",
            "backend": "qiskit_aer",
            "framework": "qiskit",
            "mode": request.mode,
            "shots": request.shots,
            "counts": counts,
            "probabilities": probabilities,
            "statevector": statevector,
            "bloch_sphere": bloch_sphere,
            "metadata": metadata,
            "execution_time_ms": execution_time_ms,
            "request_id": request_id,
            "error_code": None,
            "error": None,
        }

    except ValueError as e:
        execution_time_ms = round(
            (
                time.perf_counter()
                - start_time
            ) * 1000,
            2,
        )

        logger.warning(
            "Validation failed | "
            "request_id=%s | "
            "time_ms=%s | "
            "error=%s",
            request_id,
            execution_time_ms,
            str(e),
        )

        raise HTTPException(
            status_code=400,
            detail=create_error(
                request_id,
                "INVALID_CIRCUIT",
                str(e),
            ),
        )

    except Exception:
        execution_time_ms = round(
            (
                time.perf_counter()
                - start_time
            ) * 1000,
            2,
        )

        logger.exception(
            "Execution failed | "
            "request_id=%s | "
            "time_ms=%s",
            request_id,
            execution_time_ms,
        )

        raise HTTPException(
            status_code=500,
            detail=create_error(
                request_id,
                "EXECUTION_ERROR",
                "Quantum circuit execution failed.",
            ),
        )


@router.post("/statevector")
def get_circuit_statevector(
    request: CircuitRequest,
):
    request_id = str(uuid.uuid4())

    try:
        statevector = get_statevector(
            qubits=request.qubits,
            gates=request.gates,
        )

        return {
            "success": True,
            "status": "completed",
            "backend": "qiskit_aer",
            "framework": "qiskit",
            "qubits": request.qubits,
            "statevector": statevector,
            "request_id": request_id,
            "error_code": None,
            "error": None,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=create_error(
                request_id,
                "INVALID_CIRCUIT",
                str(e),
            ),
        )

    except Exception:
        logger.exception(
            "Statevector failed | "
            "request_id=%s",
            request_id,
        )

        raise HTTPException(
            status_code=500,
            detail=create_error(
                request_id,
                "STATEVECTOR_ERROR",
                "Statevector calculation failed.",
            ),
        )


@router.post("/bloch-sphere")
def get_circuit_bloch_sphere(
    request: CircuitRequest,
):
    request_id = str(uuid.uuid4())

    try:
        coordinates = (
            get_bloch_coordinates(
                qubits=request.qubits,
                gates=request.gates,
            )
        )

        return {
            "success": True,
            "status": "completed",
            "backend": "qiskit_aer",
            "framework": "qiskit",
            "qubits": request.qubits,
            "coordinates": coordinates,
            "request_id": request_id,
            "error_code": None,
            "error": None,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=create_error(
                request_id,
                "INVALID_CIRCUIT",
                str(e),
            ),
        )

    except Exception:
        logger.exception(
            "Bloch sphere failed | "
            "request_id=%s",
            request_id,
        )

        raise HTTPException(
            status_code=500,
            detail=create_error(
                request_id,
                "BLOCH_ERROR",
                "Bloch sphere calculation failed.",
            ),
        )