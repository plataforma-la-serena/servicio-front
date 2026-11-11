export interface ImageCredit {
  src: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const IMAGE_CREDITS: ImageCredit[] = [
  {
    src: "/images/hero-playa.webp",
    title: "Playa de La Serena",
    author: "Christian Córdova",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:Playa_de_La_Serena.jpg",
  },
  {
    src: "/images/la-serena-avenida.webp",
    title: "Avenida del Mar, La Serena",
    author: "ZKP",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Av._del_Mar,_La_Serena-Chile.JPG",
  },
  {
    src: "/images/la-serena-faro.webp",
    title: "Atardecer en el Faro de La Serena",
    author: "Rjcastillo",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Atardecer_en_el_Faro_de_la_Serena._A740469.jpg",
  },
  {
    src: "/images/la-serena-centro.webp",
    title: "Centro histórico de La Serena",
    author: "AlBustos",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Centro_hist%C3%B3rico_de_La_Serena,_avenida_Francisco_de_Aguirre.JPG",
  },
  {
    src: "/images/la-serena-mall.webp",
    title: "Mall Plaza La Serena",
    author: "Amphoth3ra",
    license: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/",
    source:
      "https://commons.wikimedia.org/wiki/File:Mall_Plaza_La_Serena_Frente.JPG",
  },
  {
    src: "/images/interior-living.webp",
    title: "Living de referencia",
    author: "Shixart1985",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Modern_living_room_with_stylish_furniture_and_a_view_of_the_outdoors_in_a_cozy_apartment_setting.jpg",
  },
  {
    src: "/images/interior-bedroom.webp",
    title: "Dormitorio de referencia",
    author: "Shixart1985",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg",
  },
  {
    src: "/images/interior-kitchen.webp",
    title: "Cocina de referencia",
    author: "Shixart1985",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Modern_luxury_living_room_with_kitchen_interior.jpg",
  },
  {
    src: "/images/interior-terrace.webp",
    title: "Terraza de referencia",
    author: "Dietmar Rabich",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:K%C3%BChlungsborn,_Appartementanlage_Strandjuwel_--_2024_--_4653.jpg",
  },
];

export interface InteriorImage {
  src: string;
  alt: string;
}

export const INTERIOR_IMAGES: InteriorImage[] = [
  {
    src: "/images/interior-living.webp",
    alt: "Living con sofá, ventanales y luz natural",
  },
  {
    src: "/images/interior-bedroom.webp",
    alt: "Dormitorio con cama, almohadones y cortinas",
  },
  {
    src: "/images/interior-kitchen.webp",
    alt: "Cocina integrada al living",
  },
  {
    src: "/images/interior-terrace.webp",
    alt: "Terraza de un apartamento con ventanales",
  },
];

export function referenceInterior(index: number): InteriorImage {
  return INTERIOR_IMAGES[index % INTERIOR_IMAGES.length];
}

export interface Place {
  name: string;
  description: string;
  image: string;
  alt: string;
}

export const LA_SERENA_PLACES: Place[] = [
  {
    name: "Avenida del Mar",
    description: "El paseo costero de La Serena, frente al Pacífico.",
    image: "/images/la-serena-avenida.webp",
    alt: "Avenida del Mar en La Serena",
  },
  {
    name: "Faro Monumental",
    description: "El faro de hormigón que marca la costa de la ciudad.",
    image: "/images/la-serena-faro.webp",
    alt: "Faro Monumental de La Serena al atardecer",
  },
  {
    name: "Centro histórico",
    description: "Plazas, calles y edificios del casco antiguo.",
    image: "/images/la-serena-centro.webp",
    alt: "Centro histórico de La Serena",
  },
  {
    name: "Mall Plaza La Serena",
    description: "Tiendas, gastronomía y servicios en la ciudad.",
    image: "/images/la-serena-mall.webp",
    alt: "Frente del Mall Plaza La Serena",
  },
];
