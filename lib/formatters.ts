const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export function formatDate(epochMs: number): string {
  return new Intl.DateTimeFormat("es-ES", DATE_OPTIONS).format(new Date(epochMs));
}

export function formatCurrencyRange({
  min,
  max,
  currency = "EUR",
  period = "year",
}: {
  min?: number | null;
  max?: number | null;
  currency?: string | null;
  period?: string | null;
}): string | null {
  if (min == null && max == null) {
    return null;
  }

  const formatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency ?? "EUR",
    maximumFractionDigits: 0,
  });

  if (min != null && max != null) {
    return `${formatter.format(min)} - ${formatter.format(max)} / ${period ?? "year"}`;
  }

  const value = min ?? max;
  if (value == null) {
    return null;
  }

  return `${formatter.format(value)} / ${period ?? "year"}`;
}
