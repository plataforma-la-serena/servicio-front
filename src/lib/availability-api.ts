import { seasonWindow, type AvailabilityRange } from "@/lib/availability";

export async function fetchAvailabilityRanges(
  id: string,
): Promise<AvailabilityRange[] | null> {
  const base = process.env.API_CENTRAL_URL?.replace(/\/$/, "");
  if (!base) {
    return null;
  }

  const { from, to } = seasonWindow();
  const query = new URLSearchParams({ from, to }).toString();

  try {
    const response = await fetch(
      `${base}/apartments/${encodeURIComponent(id)}/availability?${query}`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { ranges?: AvailabilityRange[] };
    return payload.ranges ?? [];
  } catch {
    return null;
  }
}
