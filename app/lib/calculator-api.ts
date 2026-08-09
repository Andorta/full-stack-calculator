import type { Operation } from "./operations";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface CalculationRequest {
  operation: Operation;
  operands: number[];
}

export interface CalculationResponse extends CalculationRequest {
  result: number;
  expression: string;
}

interface ErrorResponse {
  detail?: string;
}

export class CalculatorApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "CalculatorApiError";
  }
}

export async function calculate(
  request: CalculationRequest,
): Promise<CalculationResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/v1/calculations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new CalculatorApiError(
      "The calculator service is unavailable. Is the backend running?",
    );
  }

  const data = (await response.json()) as CalculationResponse | ErrorResponse;

  if (!response.ok) {
    throw new CalculatorApiError(
      "detail" in data && data.detail ? data.detail : "The calculation failed.",
      response.status,
    );
  }

  return data as CalculationResponse;
}
