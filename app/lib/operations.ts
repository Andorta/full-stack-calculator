export type Operation =
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "power"
  | "square_root"
  | "percentage";

export const UNARY_OPERATIONS: Operation[] = ["square_root", "percentage"];
export const BINARY_OPERATIONS: Operation[] = [
  "add",
  "subtract",
  "multiply",
  "divide",
  "power",
];

export const OPERATION_LABELS: Record<Operation, { name: string; symbol: string }> = {
  add: { name: "Addition", symbol: "+" },
  subtract: { name: "Subtraction", symbol: "−" },
  multiply: { name: "Multiplication", symbol: "×" },
  divide: { name: "Division", symbol: "÷" },
  power: { name: "Exponentiation", symbol: "xʸ" },
  square_root: { name: "Square root", symbol: "√" },
  percentage: { name: "Percentage", symbol: "%" },
};
