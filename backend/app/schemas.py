import math
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class Operation(str, Enum):
    ADD = "add"
    SUBTRACT = "subtract"
    MULTIPLY = "multiply"
    DIVIDE = "divide"
    POWER = "power"
    SQUARE_ROOT = "square_root"
    PERCENTAGE = "percentage"


class CalculationRequest(BaseModel):
    operation: Operation
    operands: list[float] = Field(min_length=1, max_length=2)

    @field_validator("operands")
    @classmethod
    def reject_non_finite_values(cls, operands: list[float]) -> list[float]:
        if any(not math.isfinite(number) for number in operands):
            raise ValueError("Operands must be finite numbers")
        return operands


class CalculationResponse(BaseModel):
    operation: Operation
    operands: list[float]
    result: float
    expression: str
