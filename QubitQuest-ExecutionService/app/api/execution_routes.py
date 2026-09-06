from fastapi import APIRouter, HTTPException

from app.models.circuit_models import CircuitRequest, CircuitResponse
from app.services.qiskit_service import (
    run_circuit,
    get_statevector,
    get_bloch_coordinates,
)


router = APIRouter()


@router.post("/execute", response_model=CircuitResponse)
def execute_circuit(request: CircuitRequest):
    try:
        result = run_circuit(
            qubits=request.qubits,
            gates=request.gates,
            shots=request.shots,
        )

        return {
            "success": True,
            "status": "completed",
            "backend": "qiskit_aer",
            "framework": "qiskit",
            "shots": request.shots,
            "counts": result["counts"],
            "probabilities": result["probabilities"],
            "statevector": None,
            "bloch_sphere": None,
            "metadata": result["metadata"],
            "execution_time_ms": result["execution_time_ms"],
            "error": None,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quantum circuit execution failed: {str(e)}",
        )


@router.post("/statevector")
def get_circuit_statevector(request: CircuitRequest):
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
            "error": None,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Statevector calculation failed: {str(e)}",
        )


@router.post("/bloch-sphere")
def get_bloch_sphere(request: CircuitRequest):
    try:
        coordinates = get_bloch_coordinates(
            qubits=request.qubits,
            gates=request.gates,
        )

        return {
            "success": True,
            "status": "completed",
            "backend": "qiskit_aer",
            "framework": "qiskit",
            "qubits": request.qubits,
            "coordinates": coordinates,
            "error": None,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Bloch sphere calculation failed: {str(e)}",
        )