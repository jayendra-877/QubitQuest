import time
from collections import Counter

import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator


SUPPORTED_GATES = {
    "H",
    "X",
    "Y",
    "Z",
    "S",
    "T",
    "RX",
    "RY",
    "RZ",
    "CNOT",
    "CZ",
    "SWAP",
}

SINGLE_QUBIT_GATES = {
    "H",
    "X",
    "Y",
    "Z",
    "S",
    "T",
}

PARAMETERIZED_GATES = {
    "RX",
    "RY",
    "RZ",
}

TWO_QUBIT_GATES = {
    "CNOT",
    "CZ",
    "SWAP",
}


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

        if gate_type in TWO_QUBIT_GATES:
            if gate.control is None:
                raise ValueError(
                    f"{gate_type} gate requires a second qubit in 'control'."
                )

            if gate.control >= qubits:
                raise ValueError(
                    f"Control qubit {gate.control} does not exist. "
                    f"Circuit has {qubits} qubits (0-{qubits - 1})."
                )

            if gate.control == gate.target:
                raise ValueError(
                    f"{gate_type} gate cannot use the same qubit twice."
                )

        if gate_type in PARAMETERIZED_GATES:
            if len(gate.params) != 1:
                raise ValueError(
                    f"{gate_type} gate requires exactly one parameter "
                    f"in 'params'."
                )

        if gate_type in SINGLE_QUBIT_GATES or gate_type in TWO_QUBIT_GATES:
            if gate.params:
                raise ValueError(
                    f"{gate_type} gate does not accept parameters."
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

        elif gate_type == "S":
            qc.s(gate.target)

        elif gate_type == "T":
            qc.t(gate.target)

        elif gate_type == "RX":
            qc.rx(gate.params[0], gate.target)

        elif gate_type == "RY":
            qc.ry(gate.params[0], gate.target)

        elif gate_type == "RZ":
            qc.rz(gate.params[0], gate.target)

        elif gate_type == "CNOT":
            qc.cx(gate.control, gate.target)

        elif gate_type == "CZ":
            qc.cz(gate.control, gate.target)

        elif gate_type == "SWAP":
            qc.swap(gate.control, gate.target)

    return qc


def get_circuit_metadata(qubits, gates):
    validate_gates(qubits, gates)

    qc = build_circuit(qubits, gates)

    gate_counts = Counter(
        gate.type.upper()
        for gate in gates
    )

    return {
        "qubits": qubits,
        "gate_count": len(gates),
        "depth": qc.depth(),
        "gate_counts": dict(gate_counts),
    }


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
        "execution_time_ms": execution_time_ms,
        "metadata": get_circuit_metadata(qubits, gates),
    }


def get_statevector(qubits, gates):
    validate_gates(qubits, gates)

    qc = build_circuit(qubits, gates)

    qc.save_statevector()

    simulator = AerSimulator(method="statevector")

    result = simulator.run(qc).result()

    statevector = result.get_statevector()

    statevector_array = np.asarray(statevector)

    return [
        {
            "real": float(amplitude.real),
            "imaginary": float(amplitude.imag),
        }
        for amplitude in statevector_array
    ]


def get_bloch_coordinates(qubits, gates):
    statevector = get_statevector(qubits, gates)

    amplitudes = np.array([
        complex(item["real"], item["imaginary"])
        for item in statevector
    ])

    if qubits == 1:
        alpha = amplitudes[0]
        beta = amplitudes[1]

        x = 2 * (alpha.conjugate() * beta).real
        y = 2 * (alpha.conjugate() * beta).imag
        z = abs(alpha) ** 2 - abs(beta) ** 2

        return {
            "qubit_0": {
                "x": round(float(x), 10),
                "y": round(float(y), 10),
                "z": round(float(z), 10),
            }
        }

    tensor = amplitudes.reshape([2] * qubits)

    bloch_vectors = {}

    for qubit in range(qubits):
        other_qubits = [
            index
            for index in range(qubits)
            if index != qubit
        ]

        rho = np.zeros((2, 2), dtype=complex)

        for i in range(2):
            for j in range(2):
                for values in np.ndindex(
                    *(2 for _ in other_qubits)
                ):
                    ket_index = [0] * qubits
                    bra_index = [0] * qubits

                    ket_index[qubit] = i
                    bra_index[qubit] = j

                    for axis, value in zip(other_qubits, values):
                        ket_index[axis] = value
                        bra_index[axis] = value

                    rho[i, j] += (
                        tensor[tuple(ket_index)]
                        * np.conjugate(tensor[tuple(bra_index)])
                    )

        x = 2 * rho[0, 1].real
        y = 2 * rho[0, 1].imag
        z = (rho[0, 0] - rho[1, 1]).real

        bloch_vectors[f"qubit_{qubit}"] = {
            "x": round(float(x), 10),
            "y": round(float(y), 10),
            "z": round(float(z), 10),
        }

    return bloch_vectors