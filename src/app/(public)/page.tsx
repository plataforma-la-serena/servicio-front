import { Catalog } from "@/components/Catalog";
import { Hero } from "@/components/Hero";
import { HowToBook } from "@/components/HowToBook";
import { LaSerena } from "@/components/LaSerena";
import { SeasonBand } from "@/components/SeasonBand";
import { getApartments } from "@/lib/catalog";

export default async function HomePage() {
  const { apartments, isSample } = await getApartments();

  return (
    <>
      <Hero apartmentCount={apartments.length} />
      <SeasonBand />
      <Catalog apartments={apartments} isSample={isSample} />
      <LaSerena />
      <HowToBook />
    </>
  );
}
