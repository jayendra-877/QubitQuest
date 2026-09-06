import pytest

from app.models.circuit_models import Gate
from app.services.qiskit_service import (
    get_bloch_coordinates,
    get_statevector,
    run_circuit,
)


def gate(gate_type, target, control=None, params=None):
    return Gate(
        type=gate_type,
        target=target,
        control=control,
        params=params or [],
    )


def test_h_gate_measurement():
    result = run_circuit(
        qubits=1,
        gates=[gate("H", 0)],
        shots=1000,
    )

    assert "counts" in result
    assert "probabilities" in result

    assert abs(
        result["probabilities"].get("0", 0) - 0.5
    ) < 0.15

    assert abs(
        result["probabilities"].get("1", 0) - 0.5
    ) < 0.15


def test_x_gate():
    result = run_circuit(
        qubits=1,
        gates=[gate("X", 0)],
        shots=100,
    )

    assert result["counts"] == {"1": 100}


def test_cnot_bell_state():
    result = run_circuit(
        qubits=2,
        gates=[
            gate("H", 0),
            gate("CNOT", 1, control=0),
        ],
        shots=1000,
    )

    assert "00" in result["counts"]
    assert "11" in result["counts"]

    assert "01" not in result["counts"]
    assert "10" not in result["counts"]


def test_statevector_hadamard():
    statevector = get_statevector(
        qubits=1,
        gates=[gate("H", 0)],
    )

    assert len(statevector) == 2

    assert statevector[0]["real"] == pytest.approx(
        0.70710678,
        abs=1e-6,
    )

    assert statevector[1]["real"] == pytest.approx(
        0.70710678,
        abs=1e-6,
    )

    assert statevector[0]["imaginary"] == pytest.approx(0)
    assert statevector[1]["imaginary"] == pytest.approx(0)


def test_statevector_x():
    statevector = get_statevector(
        qubits=1,
        gates=[gate("X", 0)],
    )

    assert statevector[0]["real"] == pytest.approx(0)
    assert statevector[1]["real"] == pytest.approx(1)


def test_bloch_sphere_hadamard():
    coordinates = get_bloch_coordinates(
        qubits=1,
        gates=[gate("H", 0)],
    )

    assert coordinates["qubit_0"]["x"] == pytest.approx(1)
    assert coordinates["qubit_0"]["y"] == pytest.approx(0)
    assert coordinates["qubit_0"]["z"] == pytest.approx(0)


def test_bloch_sphere_zero_state():
    coordinates = get_bloch_coordinates(
        qubits=1,
        gates=[],
    )

    assert coordinates["qubit_0"]["x"] == pytest.approx(0)
    assert coordinates["qubit_0"]["y"] == pytest.approx(0)
    assert coordinates["qubit_0"]["z"] == pytest.approx(1)


def test_bloch_sphere_one_state():
    coordinates = get_bloch_coordinates(
        qubits=1,
        gates=[gate("X", 0)],
    )

    assert coordinates["qubit_0"]["x"] == pytest.approx(0)
    assert coordinates["qubit_0"]["y"] == pytest.approx(0)
    assert coordinates["qubit_0"]["z"] == pytest.approx(-1)


def test_bell_state_bloch_vectors():
    coordinates = get_bloch_coordinates(
        qubits=2,
        gates=[
            gate("H", 0),
            gate("CNOT", 1, control=0),
        ],
    )

    assert coordinates["qubit_0"]["x"] == pytest.approx(0)
    assert coordinates["qubit_0"]["y"] == pytest.approx(0)
    assert coordinates["qubit_0"]["z"] == pytest.approx(0)

    assert coordinates["qubit_1"]["x"] == pytest.approx(0)
    assert coordinates["qubit_1"]["y"] == pytest.approx(0)
    assert coordinates["qubit_1"]["z"] == pytest.approx(0)


def test_two_qubit_product_state_bloch_vectors():
    coordinates = get_bloch_coordinates(
        qubits=2,
        gates=[
            gate("X", 0),
        ],
    )

    assert coordinates["qubit_0"]["z"] == pytest.approx(-1)
    assert coordinates["qubit_1"]["z"] == pytest.approx(1)


def test_rx_bloch_vector():
    coordinates = get_bloch_coordinates(
        qubits=1,
        gates=[
            gate("RX", 0, params=[1.57079632679]),
        ],
    )

    assert coordinates["qubit_0"]["x"] == pytest.approx(0)
    assert coordinates["qubit_0"]["y"] == pytest.approx(-1)
    assert coordinates["qubit_0"]["z"] == pytest.approx(0)


def test_rx_requires_parameter():
    with pytest.raises(ValueError):
        run_circuit(
            qubits=1,
            gates=[gate("RX", 0)],
            shots=100,
        )


def test_unsupported_gate():
    with pytest.raises(ValueError):
        run_circuit(
            qubits=1,
            gates=[gate("INVALID", 0)],
            shots=100,
        )


def test_invalid_target_qubit():
    with pytest.raises(ValueError):
        run_circuit(
            qubits=1,
            gates=[gate("X", 1)],
            shots=100,
        )


def test_cnot_requires_control():
    with pytest.raises(ValueError):
        run_circuit(
            qubits=2,
            gates=[gate("CNOT", 1)],
            shots=100,
        )


def test_cnot_same_qubit():
    with pytest.raises(ValueError):
        run_circuit(
            qubits=2,
            gates=[gate("CNOT", 1, control=1)],
            shots=100,
        )


def test_measure_mode():
    from app.models.circuit_models import CircuitRequest

    request = CircuitRequest(
        qubits=1,
        gates=[gate("X", 0)],
        mode="measure",
    )

    assert request.mode == "measure"


def test_statevector_mode():
    from app.models.circuit_models import CircuitRequest

    request = CircuitRequest(
        qubits=1,
        gates=[gate("H", 0)],
        mode="statevector",
    )

    assert request.mode == "statevector"


def test_bloch_mode():
    from app.models.circuit_models import CircuitRequest

    request = CircuitRequest(
        qubits=1,
        gates=[gate("H", 0)],
        mode="bloch",
    )

    assert request.mode == "bloch"


def test_all_mode():
    from app.models.circuit_models import CircuitRequest

    request = CircuitRequest(
        qubits=1,
        gates=[gate("H", 0)],
        mode="all",
    )

    assert request.mode == "all"