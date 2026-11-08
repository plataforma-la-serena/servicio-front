import type { Apartment } from "@/types/apartment";

/**
 * Datos de ejemplo para desarrollo local cuando api-central no está disponible.
 * La interfaz los identifica como muestra para no presentarlos como inventario real.
 */
export const sampleApartments: Apartment[] = [
  {
    id: "departamento-01",
    title: "Departamento 01",
    description:
      "Dos dormitorios, cocina equipada y balcón. Ideal para familias o grupos de hasta cuatro personas.",
    pricePerNight: 45000,
    capacity: 4,
    features: ["2 dormitorios", "Cocina equipada", "Balcón", "Wi-Fi"],
    isActive: true,
  },
  {
    id: "departamento-02",
    title: "Departamento 02",
    description:
      "Tres dormitorios, living comedor y cocina equipada. Capacidad para seis personas.",
    pricePerNight: 52000,
    capacity: 6,
    features: ["3 dormitorios", "Living comedor", "Cocina equipada", "Wi-Fi"],
    isActive: true,
  },
  {
    id: "departamento-03",
    title: "Departamento 03",
    description:
      "Un dormitorio, cocina integrada y baño completo. Para una o dos personas.",
    pricePerNight: 38000,
    capacity: 2,
    features: ["1 dormitorio", "Cocina integrada", "Baño completo", "Wi-Fi"],
    isActive: true,
  },
];
