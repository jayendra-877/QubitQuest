from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class Gate(BaseModel):
    type: str
    target: int = Field(ge=0)
    control: Optional[int] = Field(default=None, ge=0)


class CircuitRequest(BaseModel):
    qubits: int = Field(gt=0, le=20)
    gates: List[Gate]
    shots: int = Field(default=1000, gt=0, le=100000)


class CircuitResponse(BaseModel):
    success: bool
    backend: str
    framework: str
    shots: int
    counts: Dict[str, int]
    probabilities: Dict[str, float]
    statevector: Optional[List[complex]] = None
    execution_time_ms: float