export const ROLE_LABEL: Record<string, string> = {
  USER: "Cliente",
  ASSISTANT: "Bot",
  OPERATOR: "Operador",
  SYSTEM: "Sistema",
};

const TIME_ZONE = "America/Santiago";

export function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

export function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone: TIME_ZONE,
  });
}

export function dayLabel(iso: string): string {
  const key = dayKey(iso);
  const today = dayKey(new Date().toISOString());
  const yesterday = dayKey(new Date(Date.now() - 86_400_000).toISOString());

  if (key === today) {
    return "Hoy";
  }
  if (key === yesterday) {
    return "Ayer";
  }

  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}
