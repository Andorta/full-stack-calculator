from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.schemas import CalculationRequest, CalculationResponse
from app.services.calculator import CalculationError, calculate

app = FastAPI(
    title="Full-Stack Calculator API",
    description="A small, versioned arithmetic API.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(CalculationError)
async def calculation_error_handler(
    _request: Request, error: CalculationError
) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": str(error)})


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post(
    "/api/v1/calculations",
    response_model=CalculationResponse,
    tags=["calculator"],
)
def create_calculation(payload: CalculationRequest) -> CalculationResponse:
    result, expression = calculate(payload.operation, payload.operands)
    return CalculationResponse(
        operation=payload.operation,
        operands=payload.operands,
        result=result,
        expression=expression,
    )
