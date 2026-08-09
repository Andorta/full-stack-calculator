import pytest

from app.schemas import Operation
from app.services.calculator import CalculationError, calculate


@pytest.mark.parametrize(
    ("operation", "operands", "expected"),
    [
        (Operation.ADD, [2, 3], 5),
        (Operation.SUBTRACT, [9, 4], 5),
        (Operation.MULTIPLY, [-3, 4], -12),
        (Operation.DIVIDE, [8, 4], 2),
        (Operation.POWER, [2, 3], 8),
        (Operation.SQUARE_ROOT, [81], 9),
        (Operation.PERCENTAGE, [25], 0.25),
    ],
)
def test_calculate_supported_operations(operation, operands, expected):
    result, _expression = calculate(operation, operands)
    assert result == expected


def test_division_by_zero_is_rejected():
    with pytest.raises(CalculationError, match="Division by zero"):
        calculate(Operation.DIVIDE, [10, 0])


def test_square_root_of_negative_number_is_rejected():
    with pytest.raises(CalculationError, match="non-negative"):
        calculate(Operation.SQUARE_ROOT, [-1])


def test_wrong_operand_count_is_rejected():
    with pytest.raises(CalculationError, match="exactly 2"):
        calculate(Operation.ADD, [1])
