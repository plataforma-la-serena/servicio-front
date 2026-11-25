import { sampleApartments } from "@/data/sample-apartments";
import type { Apartment } from "@/types/apartment";

const API_URL = process.env.API_CENTRAL_URL;

interface ApiApartment {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  features?: string[];
  images?: string[];
  coverIndex?: number;
  isActive: boolean;
}

export interface CatalogResult {
  apartments: Apartment[];
  isSample: boolean;
}

function toApartment(item: ApiApartment): Apartment {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    pricePerNight: item.pricePerNight,
    capacity: item.capacity,
    features: item.features ?? [],
    images: item.images ?? [],
    coverIndex: item.coverIndex ?? 0,
    isActive: item.isActive,
  };
}

async function fetchApartments(base: string): Promise<ApiApartment[]> {
  const response = await fetch(`${base}/apartments?active=true`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`api-central respondió ${response.status}`);
  }

  const payload = (await response.json()) as unknown;

  if (!Array.isArray(payload)) {
    throw new Error("Respuesta inválida de api-central");
  }

  return payload as ApiApartment[];
}

const isProduction = process.env.NODE_ENV === "production";

export async function getApartments(): Promise<CatalogResult> {
  if (!API_URL) {
    return isProduction
      ? { apartments: [], isSample: false }
      : { apartments: sampleApartments, isSample: true };
  }

  try {
    const base = API_URL.replace(/\/$/, "");
    const items = await fetchApartments(base);
    return {
      apartments: items.map(toApartment),
      isSample: false,
    };
  } catch {
    // En producción no mostramos datos de ejemplo: el catálogo real manda.
    return isProduction
      ? { apartments: [], isSample: false }
      : { apartments: sampleApartments, isSample: true };
  }
}

export async function getApartmentById(
  id: string,
): Promise<{ apartment: Apartment; isSample: boolean } | null> {
  const { apartments, isSample } = await getApartments();
  const apartment = apartments.find((item) => item.id === id);
  return apartment ? { apartment, isSample } : null;
}
