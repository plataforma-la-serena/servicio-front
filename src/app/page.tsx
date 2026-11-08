import { Catalog } from "@/components/Catalog";
import { Hero } from "@/components/Hero";
import { HowToBook } from "@/components/HowToBook";
import { getApartments } from "@/lib/catalog";

export default async function HomePage() {
  const { apartments, isSample } = await getApartments();

  return (
    <>
      <Hero apartmentCount={apartments.length} />
      <Catalog apartments={apartments} isSample={isSample} />
      <HowToBook />
    </>
  );
}
