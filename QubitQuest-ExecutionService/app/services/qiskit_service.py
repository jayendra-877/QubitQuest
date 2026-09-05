import time

from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator


SUPPORTED_GATES = {"H", "X", "Y", "Z", "CNOT"}


def validate_gates(qubits, gates):
    """
    Validate gates before creating/executing the Qiskit circuit.
    """

    for gate in gates:
        gate_type = gate.type.upper()

        # Check whether the gate is supported
        if gate_type not in SUPPORTED_GATES:
            raise ValueError(
                f"Unsupported gate: {gate.type}. "
                f"Supported gates: {', '.join(sorted(SUPPORTED_GATES))}"
            )

        # Validate target qubit
        if gate.target >= qubits:
            raise ValueError(
                f"Target qubit {gate.target} does not exist. "
                f"Circuit has {qubits} qubits (0-{qubits - 1})."
            )

        # CNOT-specific validation
        if gate_type == "CNOT":

            if gate.control is None:
                raise ValueError(
                    "CNOT gate requires a control qubit."
                )

            if gate.control >= qubits:
                raise ValueError(
                    f"Control qubit {gate.control} does not exist. "
                    f"Circuit has {qubits} qubits (0-{qubits - 1})."
                )

            if gate.control == gate.target:
                raise ValueError(
                    "CNOT control and target qubits cannot be the same."
                )


def run_circuit(qubits, gates, shots=1000):
    """
    Build and execute a quantum circuit using Qiskit Aer.

    Returns:
        counts
        probabilities
        execution_time_ms
    """

    # Validate circuit before execution
    validate_gates(qubits, gates)

    # Create quantum circuit
    # We create one classical bit for every qubit because
    # the current execution model measures all qubits.
    qc = QuantumCircuit(qubits, qubits)

    # Add gates
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

    # Measure all qubits
    qc.measure(range(qubits), range(qubits))

    # Create simulator
    simulator = AerSimulator()

    # Start execution timer
    start_time = time.perf_counter()

    # Execute circuit
    job = simulator.run(qc, shots=shots)

    # Get result
    result = job.result()

    # Stop execution timer
    execution_time_ms = round(
        (time.perf_counter() - start_time) * 1000,
        2
    )

    # Get measurement counts
    counts = result.get_counts()

    # Calculate probabilities
    probabilities = {
        state: count / shots
        for state, count in counts.items()
    }

    return {
        "counts": counts,
        "probabilities": probabilities,
        "execution_time_ms": execution_time_ms
    }