const API = (process.env.API_CENTRAL_URL ?? "http://localhost:3001").replace(
  /\/$/,
  "",
);

const ID_PATTERN = /^[a-z0-9-]{8,64}$/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  if (!ID_PATTERN.test(id)) {
    return new Response("No encontrado", { status: 404 });
  }

  try {
    const response = await fetch(`${API}/media/${id}`, { cache: "no-store" });

    if (!response.ok) {
      return new Response("No encontrado", { status: 404 });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Imagen no disponible", { status: 503 });
  }
}
