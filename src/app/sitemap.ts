import type { MetadataRoute } from "next";
import { getApartments } from "@/lib/catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { apartments } = await getApartments();
  const now = new Date();

  const apartmentEntries: MetadataRoute.Sitemap = apartments.map(
    (apartment) => ({
      url: `${siteUrl}/departamentos/${apartment.id}`,
      lastModified: now,
    }),
  );

  return [
    {
      url: siteUrl,
      lastModified: now,
    },
    {
      url: `${siteUrl}/creditos`,
      lastModified: now,
    },
    ...apartmentEntries,
  ];
}
