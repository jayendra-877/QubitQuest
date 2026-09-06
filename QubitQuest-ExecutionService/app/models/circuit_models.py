from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class Gate(BaseModel):
    type: str = Field(min_length=1, max_length=20)
    target: int = Field(ge=0)
    control: Optional[int] = Field(default=None, ge=0)
    params: List[float] = Field(
        default_factory=list,
        max_length=1,
    )


class CircuitRequest(BaseModel):
    qubits: int = Field(gt=0, le=20)
    gates: List[Gate] = Field(max_length=200)
    shots: int = Field(default=1000, gt=0, le=100000)
    mode: Literal[
        "measure",
        "statevector",
        "bloch",
        "all",
    ] = "measure"


class CircuitMetadata(BaseModel):
    qubits: int
    gate_count: int
    depth: int
    gate_counts: Dict[str, int]


class CircuitResponse(BaseModel):
    success: bool
    status: str
    backend: str
    framework: str
    mode: str
    shots: int

    counts: Optional[Dict[str, int]] = None
    probabilities: Optional[Dict[str, float]] = None

    statevector: Optional[List[Dict[str, float]]] = None

    bloch_sphere: Optional[
        Dict[str, Dict[str, float]]
    ] = None

    metadata: CircuitMetadata

    execution_time_ms: float
    request_id: str

    error_code: Optional[str] = None
    error: Optional[str] = None