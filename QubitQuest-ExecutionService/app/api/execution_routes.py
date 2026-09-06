from fastapi import APIRouter, HTTPException

from app.models.circuit_models import CircuitRequest, CircuitResponse
from app.services.qiskit_service import run_circuit

router = APIRouter()


@router.post("/execute", response_model=CircuitResponse)
def execute_circuit(request: CircuitRequest):
    try:
        result = run_circuit(
            qubits=request.qubits,
            gates=request.gates,
            shots=request.shots
        )

        return {
            "success": True,
            "backend": "qiskit_aer",
            "framework": "qiskit",
            "shots": request.shots,
            "counts": result["counts"],
            "probabilities": result["probabilities"],
            "execution_time_ms": result["execution_time_ms"]
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Quantum circuit execution failed: {str(e)}"
        )