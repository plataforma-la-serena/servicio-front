export const dynamic = "force-dynamic";

/**
 * Endpoint liviano para el healthcheck del contenedor.
 * No renderiza la home ni consulta la base de datos.
 */
export function GET(): Response {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
