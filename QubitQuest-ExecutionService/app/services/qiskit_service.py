import time

from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator


SUPPORTED_GATES = {"H", "X", "Y", "Z", "CNOT"}


def validate_gates(qubits, gates):
    for gate in gates:
        gate_type = gate.type.upper()

        if gate_type not in SUPPORTED_GATES:
            raise ValueError(
                f"Unsupported gate: {gate.type}. "
                f"Supported gates: {', '.join(sorted(SUPPORTED_GATES))}"
            )

        if gate.target >= qubits:
            raise ValueError(
                f"Target qubit {gate.target} does not exist. "
                f"Circuit has {qubits} qubits (0-{qubits - 1})."
            )

        if gate_type == "CNOT":
            if gate.control is None:
                raise ValueError("CNOT gate requires a control qubit.")

            if gate.control >= qubits:
                raise ValueError(
                    f"Control qubit {gate.control} does not exist. "
                    f"Circuit has {qubits} qubits (0-{qubits - 1})."
                )

            if gate.control == gate.target:
                raise ValueError(
                    "CNOT control and target qubits cannot be the same."
                )


def build_circuit(qubits, gates):
    qc = QuantumCircuit(qubits, qubits)

    for gate in gates:
        gate_type = gate.type.upper()

        if gate_type == "H":
            qc.h(gate.target)

        elif gate_type == "X":
            qc.x(gate.target)

        elif gate_type == "Y":
            qc.y(gate.target)

        elif gate_type == "Z":
            qc.z(gate.target)

        elif gate_type == "CNOT":
            qc.cx(gate.control, gate.target)

    return qc


def run_circuit(qubits, gates, shots=1000):
    validate_gates(qubits, gates)

    qc = build_circuit(qubits, gates)
    qc.measure(range(qubits), range(qubits))

    simulator = AerSimulator()

    start_time = time.perf_counter()

    job = simulator.run(qc, shots=shots)
    result = job.result()

    execution_time_ms = round(
        (time.perf_counter() - start_time) * 1000,
        2
    )

    counts = result.get_counts()

    probabilities = {
        state: count / shots
        for state, count in counts.items()
    }

    return {
        "counts": counts,
        "probabilities": probabilities,
        "execution_time_ms": execution_time_ms
    }


def get_statevector(qubits, gates):
    validate_gates(qubits, gates)

    qc = build_circuit(qubits, gates)
    qc.save_statevector()

    simulator = AerSimulator(method="statevector")

    result = simulator.run(qc).result()

    statevector = result.get_statevector()

    return [
        {
            "real": float(amplitude.real),
            "imaginary": float(amplitude.imag)
        }
        for amplitude in statevector
    ]


def get_bloch_coordinates(qubits, gates):
    if qubits != 1:
        raise ValueError(
            "Bloch sphere visualization currently supports exactly 1 qubit."
        )

    statevector = get_statevector(qubits, gates)

    alpha = complex(
        statevector[0]["real"],
        statevector[0]["imaginary"]
    )

    beta = complex(
        statevector[1]["real"],
        statevector[1]["imaginary"]
    )

    x = 2 * (alpha.conjugate() * beta).real
    y = 2 * (alpha.conjugate() * beta).imag
    z = abs(alpha) ** 2 - abs(beta) ** 2

    return {
        "x": round(x, 10),
        "y": round(y, 10),
        "z": round(z, 10)
    }