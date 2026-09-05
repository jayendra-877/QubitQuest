from fastapi import APIRouter, HTTPException
from app.models.circuit_models import CircuitRequest
from app.services.qiskit_service import run_circuit

router = APIRouter()


@router.post("/execute")
def execute_circuit(request: CircuitRequest):
    try:
        result = run_circuit(
            request.qubits,
            request.gates,
            request.shots
        )

        return {
            "counts": result["counts"],
            "probabilities": result["probabilities"],
            "shots": request.shots
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))