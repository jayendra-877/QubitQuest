# QubitQuest — Quantum Execution Service

The Quantum Execution Service is the computation engine of QubitQuest. It receives quantum circuits as JSON, validates them, builds the circuit using Qiskit, executes it using Qiskit Aer, and returns structured quantum results.

## Features

- FastAPI-based REST API
- Quantum circuit execution with Qiskit Aer
- Measurement counts and probabilities
- Statevector calculation
- Bloch sphere coordinates
- Single and multi-qubit analysis
- Support for common quantum gates
- Circuit validation and resource limits
- Structured error handling
- Request IDs and execution time tracking
- Health-check endpoint
- Automated test suite
- Docker configuration

## Tech Stack

- Python 3.14
- FastAPI
- Qiskit
- Qiskit Aer
- NumPy
- Pytest
- Docker

## Project Structure

```text
QubitQuest-ExecutionService/
│
├── app/
│   ├── main.py
│   ├── api/
│   │   └── execution_routes.py
│   ├── models/
│   │   └── circuit_models.py
│   └── services/
│       └── qiskit_service.py
│
├── tests/
│   ├── conftest.py
│   └── test_execution.py
│
├── Dockerfile
├── .dockerignore
├── .gitignore
├── requirements.txt
└── ExecutionService.README.md
Supported Gates
Single-Qubit Gates
H
X
Y
Z
S
T
Rotation Gates
RX
RY
RZ

Each rotation gate accepts exactly one parameter.

Example:

{
  "type": "RX",
  "target": 0,
  "params": [1.5708]
}
Two-Qubit Gates
CNOT
CZ
SWAP

Example:

{
  "type": "CNOT",
  "control": 0,
  "target": 1
}
API Endpoints
GET /

Returns basic service information.

GET /health

Checks whether the execution service is running.

POST /execute

Main quantum circuit execution endpoint.

POST /statevector

Returns the complete quantum statevector.

POST /bloch-sphere

Returns Bloch sphere coordinates for each qubit.

Execute Circuit
Request
{
  "qubits": 2,
  "gates": [
    {
      "type": "H",
      "target": 0
    },
    {
      "type": "CNOT",
      "control": 0,
      "target": 1
    }
  ],
  "shots": 1000,
  "mode": "all"
}

This circuit creates a Bell state.

Execution Modes
Measure
{
  "mode": "measure"
}

Returns measurement counts and probabilities.

Statevector
{
  "mode": "statevector"
}

Returns the quantum statevector.

Bloch
{
  "mode": "bloch"
}

Returns Bloch sphere coordinates.

All
{
  "mode": "all"
}

Returns measurements, probabilities, statevector, Bloch coordinates, and metadata.

Example Response
{
  "success": true,
  "status": "completed",
  "backend": "qiskit_aer",
  "framework": "qiskit",
  "mode": "all",
  "shots": 1000,
  "counts": {
    "00": 501,
    "11": 499
  },
  "probabilities": {
    "00": 0.501,
    "11": 0.499
  },
  "statevector": [
    {
      "real": 0.7071067812,
      "imaginary": 0.0
    },
    {
      "real": 0.0,
      "imaginary": 0.0
    },
    {
      "real": 0.0,
      "imaginary": 0.0
    },
    {
      "real": 0.7071067812,
      "imaginary": 0.0
    }
  ],
  "bloch_sphere": {
    "qubit_0": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "qubit_1": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    }
  },
  "metadata": {
    "qubits": 2,
    "gate_count": 2,
    "depth": 2,
    "gate_counts": {
      "H": 1,
      "CNOT": 1
    }
  },
  "execution_time_ms": 15.2,
  "request_id": "example-request-id"
}
Validation and Resource Limits

The service validates every circuit before execution.

Resource	Limit
Maximum qubits	20
Maximum gates	200
Maximum shots	100,000
Statevector analysis	12 qubits
Bloch analysis	12 qubits

Validation includes:

Unsupported gates
Invalid qubit indices
Invalid control/target combinations
Missing control qubits
Same control and target qubit
Invalid gate parameters
Invalid shot counts
Excessive circuit size
Error Handling

The service returns structured errors for invalid requests and execution failures.

Example:

{
  "success": false,
  "status": "failed",
  "request_id": "example-request-id",
  "error_code": "INVALID_CIRCUIT",
  "error": "Unsupported gate: INVALID"
}

Common error codes include:

REQUEST_VALIDATION_ERROR
INVALID_CIRCUIT
EXECUTION_ERROR
STATEVECTOR_ERROR
BLOCH_ERROR
Bloch Sphere Analysis

The service calculates the Bloch vector:

X
Y
Z

for every qubit.

For multi-qubit circuits, reduced density matrices are calculated to obtain the individual qubit states.

Qiskit's little-endian qubit ordering is handled correctly during the calculation.

Local Setup

Create and activate a virtual environment:

python -m venv .venv
.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Start the service:

uvicorn app.main:app --reload

Service:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs
Testing

Run the complete test suite:

pytest

Current test coverage includes:

Quantum gate execution
Measurement results
Bell states
Statevectors
Bloch sphere calculations
Multi-qubit Bloch analysis
Rotation gates
Circuit validation
Resource limits
API endpoints
Execution modes
Error handling
Health checks

Current status:

31 tests passed
Docker

A Dockerfile and .dockerignore are included for containerized deployment.

Build:

docker build -t qubitquest-execution-service .

Run:

docker run --rm -p 8000:8000 qubitquest-execution-service
Architecture
Frontend / Backend
        │
        │ JSON
        ▼
┌──────────────────────┐
│   FastAPI API        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Circuit Validation   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Qiskit Circuit       │
│ Construction         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Qiskit Aer Simulator │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Quantum Results      │
│ Counts               │
│ Probabilities        │
│ Statevector          │
│ Bloch Coordinates    │
│ Metadata             │
└──────────────────────┘
Design Principle

The Execution Service is responsible only for actual quantum computation and analysis.

AI components may generate or explain circuits, but the Execution Service remains the source of truth for executing those circuits.

The service is independent of the main Backend and Frontend and communicates through a clean REST API.

Current Status
FastAPI                    ✅
Qiskit                     ✅
Qiskit Aer                 ✅
Circuit Execution          ✅
Measurements               ✅
Probabilities              ✅
Statevector                ✅
Bloch Sphere               ✅
Multi-Qubit Analysis       ✅
Circuit Validation         ✅
Error Handling             ✅
Resource Limits            ✅
Logging                    ✅
Health Check               ✅
Automated Tests             ✅
Docker Configuration       ✅
Documentation              ✅

Backend Integration        ⏳
Frontend Integration       ⏳
Responsibility

The Quantum Execution Service provides the quantum computation and analysis layer of QubitQuest.

Its core pipeline is:

JSON Circuit
     ↓
Validation
     ↓
Qiskit Circuit
     ↓
Qiskit Aer Simulation
     ↓
Structured JSON Results

Then literally just:

```powershell
notepad ExecutionService.README.md

Paste → Ctrl+S → close Notepad.

Then:

git add QubitQuest-ExecutionService/ExecutionService.README.md
git commit -m "Add execution service documentation"
git push origin execution-service
