import { NextResponse } from "next/server";
import { ADN_CONFIG } from "@/lib/adnService";

/**
 * Handles CORS preflight requests for the PDF proxy
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range",
    },
  });
}

/**
 * Streams PDF assets safely to client viewers with full CORS,
 * inline disposition, range support, and content-length headers.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  // Validate that the URL exists
  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Determine allowed hosts dynamically
  let allowedHost = "";
  try {
    allowedHost = new URL(ADN_CONFIG.host).hostname;
  } catch {
    allowedHost = "harbour-wren-3226.umberadn.com";
  }

  const isUmberHost =
    parsed.hostname === allowedHost ||
    parsed.hostname.endsWith(".umberadn.com") ||
    parsed.hostname.endsWith(".umbercloud.io");

  if (!isUmberHost) {
    return NextResponse.json({ error: "Forbidden host" }, { status: 403 });
  }

  try {
    const upstream = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/pdf,*/*",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const arrayBuffer = await upstream.arrayBuffer();

    return new Response(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="user-manual.pdf"',
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Cache-Control": "public, max-age=300, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("PDF proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 502 });
  }
}

