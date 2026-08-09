import math
from collections.abc import Callable

from app.schemas import Operation


class CalculationError(ValueError):
    """Raised when a mathematically invalid calculation is requested."""


def _require_arity(operands: list[float], expected: int) -> None:
    if len(operands) != expected:
        noun = "operand" if expected == 1 else "operands"
        raise CalculationError(f"This operation requires exactly {expected} {noun}.")


def _add(operands: list[float]) -> tuple[float, str]:
    _require_arity(operands, 2)
    left, right = operands
    return left + right, f"{left:g} + {right:g}"


def _subtract(operands: list[float]) -> tuple[float, str]:
    _require_arity(operands, 2)
    left, right = operands
    return left - right, f"{left:g} − {right:g}"


def _multiply(operands: list[float]) -> tuple[float, str]:
    _require_arity(operands, 2)
    left, right = operands
    return left * right, f"{left:g} × {right:g}"


def _divide(operands: list[float]) -> tuple[float, str]:
    _require_arity(operands, 2)
    left, right = operands
    if right == 0:
        raise CalculationError("Division by zero is not allowed.")
    return left / right, f"{left:g} ÷ {right:g}"


def _power(operands: list[float]) -> tuple[float, str]:
    _require_arity(operands, 2)
    left, right = operands
    try:
        result = math.pow(left, right)
    except (OverflowError, ValueError) as error:
        raise CalculationError("The exponent produces a non-real or oversized result.") from error
    return result, f"{left:g}^{right:g}"


def _square_root(operands: list[float]) -> tuple[float, str]:
    _require_arity(operands, 1)
    (value,) = operands
    if value < 0:
        raise CalculationError("Square root is only available for non-negative numbers.")
    return math.sqrt(value), f"√{value:g}"


def _percentage(operands: list[float]) -> tuple[float, str]:
    _require_arity(operands, 1)
    (value,) = operands
    return value / 100, f"{value:g}%"


OPERATIONS: dict[Operation, Callable[[list[float]], tuple[float, str]]] = {
    Operation.ADD: _add,
    Operation.SUBTRACT: _subtract,
    Operation.MULTIPLY: _multiply,
    Operation.DIVIDE: _divide,
    Operation.POWER: _power,
    Operation.SQUARE_ROOT: _square_root,
    Operation.PERCENTAGE: _percentage,
}


def calculate(operation: Operation, operands: list[float]) -> tuple[float, str]:
    """Execute a validated calculation and return its result and display text."""
    result, expression = OPERATIONS[operation](operands)
    if not math.isfinite(result):
        raise CalculationError("The result is too large to represent.")
    return result, expression
