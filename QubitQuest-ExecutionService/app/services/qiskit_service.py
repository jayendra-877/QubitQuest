from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator


def run_circuit(qubits, gates, shots=1000):
    # Create circuit
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

        else:
            raise ValueError(f"Unsupported gate: {gate.type}")

    # Measure all qubits
    qc.measure(range(qubits), range(qubits))

    # Run on Aer simulator
    simulator = AerSimulator()
    job = simulator.run(qc, shots=shots)

    # Get results
    result = job.result()
    counts = result.get_counts()

    # Calculate probabilities
    probabilities = {
        state: count / shots
        for state, count in counts.items()
    }

    return {
        "counts": counts,
        "probabilities": probabilities
    }