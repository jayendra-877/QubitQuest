from pydantic import BaseModel
from typing import List, Optional


class Gate(BaseModel):
    type: str
    target: int
    control: Optional[int] = None


class CircuitRequest(BaseModel):
    qubits: int
    gates: List[Gate]
    shots: int = 1000