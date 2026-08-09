import { describe, expect, it } from "vitest";
import { parseRequiredNumber } from "./validation";

describe("parseRequiredNumber", () => {
  it("parses integer and decimal input", () => {
    expect(parseRequiredNumber("42", "Value")).toBe(42);
    expect(parseRequiredNumber("-3.5", "Value")).toBe(-3.5);
  });

  it("rejects empty input", () => {
    expect(() => parseRequiredNumber("  ", "First value")).toThrow(
      "First value is required.",
    );
  });

  it("rejects non-numeric input", () => {
    expect(() => parseRequiredNumber("hello", "Value")).toThrow(
      "Value must be a valid number.",
    );
  });
});
