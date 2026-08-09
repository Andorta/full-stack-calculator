"use client";

import { FormEvent, useId, useState } from "react";
import { calculate, CalculatorApiError } from "../lib/calculator-api";
import {
  Operation,
  OPERATION_LABELS,
  UNARY_OPERATIONS,
} from "../lib/operations";
import { parseRequiredNumber } from "../lib/validation";

type Status = "idle" | "loading" | "success" | "error";

const ALL_OPERATIONS: Operation[] = [
  "add",
  "subtract",
  "multiply",
  "divide",
  "power",
  "square_root",
  "percentage",
];

export function Calculator() {
  const firstInputId = useId();
  const secondInputId = useId();
  const [operation, setOperation] = useState<Operation>("add");
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Ready when you are");

  const isUnary = UNARY_OPERATIONS.includes(operation);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("Calculating…");

    try {
      const operands = [parseRequiredNumber(firstValue, "First value")];
      if (!isUnary) {
        operands.push(parseRequiredNumber(secondValue, "Second value"));
      }

      const response = await calculate({ operation, operands });
      setResult(response.result);
      setStatus("success");
      setMessage(response.expression);
    } catch (error) {
      setResult(null);
      setStatus("error");
      setMessage(
        error instanceof CalculatorApiError || error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  function selectOperation(nextOperation: Operation) {
    setOperation(nextOperation);
    setResult(null);
    setStatus("idle");
    setMessage("Ready when you are");
  }

  function resetCalculator() {
    setFirstValue("");
    setSecondValue("");
    setResult(null);
    setStatus("idle");
    setMessage("Ready when you are");
  }

  return (
    <section className="calculator-card" aria-label="Calculator">
      <div className="operation-grid" aria-label="Choose an operation">
        {ALL_OPERATIONS.map((item) => (
          <button
            className={item === operation ? "operation active" : "operation"}
            key={item}
            onClick={() => selectOperation(item)}
            type="button"
            aria-pressed={item === operation}
            title={OPERATION_LABELS[item].name}
          >
            <span aria-hidden="true">{OPERATION_LABELS[item].symbol}</span>
            <span className="sr-only">{OPERATION_LABELS[item].name}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={isUnary ? "inputs unary" : "inputs"}>
          <label htmlFor={firstInputId}>
            {isUnary ? "Value" : "First value"}
            <input
              id={firstInputId}
              inputMode="decimal"
              placeholder="0"
              value={firstValue}
              onChange={(event) => setFirstValue(event.target.value)}
              autoFocus
            />
          </label>

          {!isUnary && (
            <>
              <span className="selected-symbol" aria-hidden="true">
                {OPERATION_LABELS[operation].symbol}
              </span>
              <label htmlFor={secondInputId}>
                Second value
                <input
                  id={secondInputId}
                  inputMode="decimal"
                  placeholder="0"
                  value={secondValue}
                  onChange={(event) => setSecondValue(event.target.value)}
                />
              </label>
            </>
          )}
        </div>

        <div
          className={`result-panel ${status}`}
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <span>{status === "error" ? "Check your input" : "Result"}</span>
          <strong>{result === null ? "—" : result.toLocaleString()}</strong>
          <small>{message}</small>
        </div>

        <div className="actions">
          <button className="clear-button" type="button" onClick={resetCalculator}>
            Clear
          </button>
          <button className="calculate-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Calculating…" : "Calculate"}
          </button>
        </div>
      </form>
    </section>
  );
}
