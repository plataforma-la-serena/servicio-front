const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return `${clp.format(value)} CLP`;
}

/** Convierte una fecha ISO (2026-12-15T00:00:00.000Z) a 15/12/2026. */
export function formatShortDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}
