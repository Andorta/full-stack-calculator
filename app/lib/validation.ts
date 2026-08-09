export function parseRequiredNumber(value: string, label: string): number {
  if (value.trim() === "") {
    throw new Error(`${label} is required.`);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return parsed;
}
