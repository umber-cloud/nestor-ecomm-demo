import { NextResponse } from "next/server";

const ALLOWED_HOST = "adn.umbercloud.io";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  // Validate that the URL exists and points to our allowed host
  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return NextResponse.json({ error: "Forbidden host" }, { status: 403 });
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        // Forward a browser-like accept header
        Accept: "application/pdf,*/*",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status}` },
        { status: upstream.status }
      );
    }

    // Stream the binary response directly to the client
    const blob = await upstream.blob();
    const arrayBuffer = await blob.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        // Cache for 5 minutes on the browser, 60 seconds shared cache
        "Cache-Control": "public, max-age=300, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("PDF proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 502 });
  }
}
