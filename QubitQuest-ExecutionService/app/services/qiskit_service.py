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


MAX_QUBITS = 20
MAX_GATES = 200
MAX_SHOTS = 100000

MAX_STATEVECTOR_QUBITS = 12
MAX_BLOCH_QUBITS = 12


def validate_gates(qubits, gates):
    if qubits > MAX_QUBITS:
        raise ValueError(
            f"Circuit cannot contain more than "
            f"{MAX_QUBITS} qubits."
        )

    if len(gates) > MAX_GATES:
        raise ValueError(
            f"Circuit cannot contain more than "
            f"{MAX_GATES} gates."
        )

    for gate in gates:
        gate_type = gate.type.upper()

        if gate_type not in SUPPORTED_GATES:
            raise ValueError(
                f"Unsupported gate: {gate.type}. "
                f"Supported gates: "
                f"{', '.join(sorted(SUPPORTED_GATES))}"
            )

        if gate.target >= qubits:
            raise ValueError(
                f"Target qubit {gate.target} does not exist. "
                f"Circuit has {qubits} qubits "
                f"(0-{qubits - 1})."
            )

        if gate_type in TWO_QUBIT_GATES:
            if gate.control is None:
                raise ValueError(
                    f"{gate_type} gate requires a second "
                    f"qubit in 'control'."
                )

            if gate.control >= qubits:
                raise ValueError(
                    f"Control qubit {gate.control} does not exist. "
                    f"Circuit has {qubits} qubits "
                    f"(0-{qubits - 1})."
                )

            if gate.control == gate.target:
                raise ValueError(
                    f"{gate_type} gate cannot use the "
                    f"same qubit twice."
                )

        if gate_type in PARAMETERIZED_GATES:
            if len(gate.params) != 1:
                raise ValueError(
                    f"{gate_type} gate requires exactly one "
                    f"parameter in 'params'."
                )

        if (
            gate_type in SINGLE_QUBIT_GATES
            or gate_type in TWO_QUBIT_GATES
        ):
            if gate.params:
                raise ValueError(
                    f"{gate_type} gate does not accept parameters."
                )


def validate_shots(shots):
    if shots > MAX_SHOTS:
        raise ValueError(
            f"Shots cannot exceed {MAX_SHOTS}."
        )


def validate_statevector_size(qubits):
    if qubits > MAX_STATEVECTOR_QUBITS:
        raise ValueError(
            f"Statevector analysis is limited to "
            f"{MAX_STATEVECTOR_QUBITS} qubits because "
            f"statevector size grows exponentially."
        )


def validate_bloch_size(qubits):
    if qubits > MAX_BLOCH_QUBITS:
        raise ValueError(
            f"Bloch sphere analysis is limited to "
            f"{MAX_BLOCH_QUBITS} qubits."
        )


def build_circuit(qubits, gates):
    validate_gates(qubits, gates)

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
            qc.rx(
                gate.params[0],
                gate.target,
            )

        elif gate_type == "RY":
            qc.ry(
                gate.params[0],
                gate.target,
            )

        elif gate_type == "RZ":
            qc.rz(
                gate.params[0],
                gate.target,
            )

        elif gate_type == "CNOT":
            qc.cx(
                gate.control,
                gate.target,
            )

        elif gate_type == "CZ":
            qc.cz(
                gate.control,
                gate.target,
            )

        elif gate_type == "SWAP":
            qc.swap(
                gate.control,
                gate.target,
            )

    return qc


def get_circuit_metadata(qubits, gates):
    validate_gates(qubits, gates)

    qc = build_circuit(
        qubits,
        gates,
    )

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
    validate_gates(
        qubits,
        gates,
    )

    validate_shots(shots)

    qc = build_circuit(
        qubits,
        gates,
    )

    qc.measure(
        range(qubits),
        range(qubits),
    )

    simulator = AerSimulator()

    start_time = time.perf_counter()

    job = simulator.run(
        qc,
        shots=shots,
    )

    result = job.result()

    execution_time_ms = round(
        (
            time.perf_counter()
            - start_time
        ) * 1000,
        2,
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
        "metadata": get_circuit_metadata(
            qubits,
            gates,
        ),
    }


def get_statevector(qubits, gates):
    validate_gates(
        qubits,
        gates,
    )

    validate_statevector_size(qubits)

    qc = build_circuit(
        qubits,
        gates,
    )

    qc.save_statevector()

    simulator = AerSimulator(
        method="statevector"
    )

    result = simulator.run(qc).result()

    statevector = result.get_statevector()

    statevector_array = np.asarray(
        statevector
    )

    return [
        {
            "real": float(
                amplitude.real
            ),
            "imaginary": float(
                amplitude.imag
            ),
        }
        for amplitude in statevector_array
    ]


def get_single_qubit_density_matrix(
    amplitudes,
    qubits,
    target_qubit,
):
    """
    Calculate the reduced density matrix
    for one qubit.

    Qiskit uses little-endian statevector
    ordering:

        |q_(n-1) ... q_1 q_0>

    Therefore the final tensor axis
    corresponds to qubit 0.
    """

    tensor = amplitudes.reshape(
        [2] * qubits
    )

    target_axis = (
        qubits - 1 - target_qubit
    )

    other_axes = [
        axis
        for axis in range(qubits)
        if axis != target_axis
    ]

    density_matrix = np.zeros(
        (2, 2),
        dtype=complex,
    )

    for row in range(2):
        for column in range(2):

            for other_values in np.ndindex(
                *(2 for _ in other_axes)
            ):
                row_index = [0] * qubits
                column_index = [0] * qubits

                row_index[target_axis] = row
                column_index[target_axis] = column

                for axis, value in zip(
                    other_axes,
                    other_values,
                ):
                    row_index[axis] = value
                    column_index[axis] = value

                density_matrix[row, column] += (
                    tensor[tuple(row_index)]
                    * np.conjugate(
                        tensor[tuple(column_index)]
                    )
                )

    return density_matrix


def get_bloch_coordinates(qubits, gates):
    validate_gates(
        qubits,
        gates,
    )

    validate_bloch_size(qubits)

    statevector = get_statevector(
        qubits,
        gates,
    )

    amplitudes = np.array(
        [
            complex(
                item["real"],
                item["imaginary"],
            )
            for item in statevector
        ],
        dtype=complex,
    )

    bloch_vectors = {}

    for qubit in range(qubits):
        density_matrix = (
            get_single_qubit_density_matrix(
                amplitudes=amplitudes,
                qubits=qubits,
                target_qubit=qubit,
            )
        )

        x = (
            2
            * density_matrix[0, 1].real
        )

        y = (
            -2
            * density_matrix[0, 1].imag
        )

        z = (
            density_matrix[0, 0].real
            - density_matrix[1, 1].real
        )

        bloch_vectors[
            f"qubit_{qubit}"
        ] = {
            "x": round(
                float(x),
                10,
            ),
            "y": round(
                float(y),
                10,
            ),
            "z": round(
                float(z),
                10,
            ),
        }

    return bloch_vectors