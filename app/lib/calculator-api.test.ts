import { afterEach, describe, expect, it, vi } from "vitest";
import { calculate, CalculatorApiError } from "./calculator-api";

describe("calculate", () => {
  afterEach(() => vi.restoreAllMocks());

  it("posts a calculation and returns the result", async () => {
    const responseBody = {
      operation: "add" as const,
      operands: [2, 3],
      result: 5,
      expression: "2 + 3",
    };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(calculate({ operation: "add", operands: [2, 3] })).resolves.toEqual(
      responseBody,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/calculations",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("surfaces the API error message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ detail: "Division by zero is not allowed." }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      calculate({ operation: "divide", operands: [10, 0] }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<CalculatorApiError>>({
        message: "Division by zero is not allowed.",
        status: 422,
      }),
    );
  });

  it("returns a useful message when the backend cannot be reached", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("fetch failed"));

    await expect(calculate({ operation: "add", operands: [1, 2] })).rejects.toThrow(
      "The calculator service is unavailable",
    );
  });
});
