import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="shell">
        <p className="eyebrow">404</p>
        <h1 id="not-found-title" className="not-found-title">
          Página no encontrada.
        </h1>
        <Link href="/" className="text-link">
          Volver al catálogo
        </Link>
      </div>
    </section>
  );
}
