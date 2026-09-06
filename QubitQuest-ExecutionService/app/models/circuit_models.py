from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class Gate(BaseModel):
    type: str
    target: int = Field(ge=0)
    control: Optional[int] = Field(default=None, ge=0)
    params: List[float] = Field(default_factory=list)


class CircuitRequest(BaseModel):
    qubits: int = Field(gt=0, le=20)
    gates: List[Gate]
    shots: int = Field(default=1000, gt=0, le=100000)


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
    shots: int

    counts: Dict[str, int]
    probabilities: Dict[str, float]

    statevector: Optional[List[Dict[str, float]]] = None
    bloch_sphere: Optional[Dict[str, float]] = None

    metadata: CircuitMetadata

    execution_time_ms: float
    error: Optional[str] = None