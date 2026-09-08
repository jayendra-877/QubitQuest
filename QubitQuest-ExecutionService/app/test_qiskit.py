from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

# Create a 2-qubit circuit
qc = QuantumCircuit(2, 2)

# Apply Hadamard gate
qc.h(0)

# Apply CNOT gate
qc.cx(0, 1)

# Measure both qubits
qc.measure([0, 1], [0, 1])

print(qc)

# Create Aer simulator
simulator = AerSimulator()

# Run circuit 1000 times
job = simulator.run(qc, shots=1000)

# Get results
result = job.result()
counts = result.get_counts()

print("Results:")
print(counts)