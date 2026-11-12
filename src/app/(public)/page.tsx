import { Catalog } from "@/components/Catalog";
import { ExploreLinks } from "@/components/ExploreLinks";
import { Hero } from "@/components/Hero";
import { SeasonBand } from "@/components/SeasonBand";
import { getApartments } from "@/lib/catalog";

function pickRandom<T>(items: T[], count: number): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }

  return copy.slice(0, count);
}

export default async function HomePage() {
  const { apartments, isSample } = await getApartments();
  const featured = pickRandom(apartments, 3);

  return (
    <>
      <Hero apartmentCount={apartments.length} />
      <SeasonBand />
      <Catalog
        apartments={featured}
        isSample={isSample}
        title="Departamentos destacados"
        meta={`${featured.length} de ${apartments.length}`}
        moreHref="/departamentos"
        moreLabel="Ver todos los departamentos"
      />
      <ExploreLinks />
    </>
  );
}
