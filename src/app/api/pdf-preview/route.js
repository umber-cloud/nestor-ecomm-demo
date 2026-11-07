import { NextResponse } from "next/server";
import { ADN_CONFIG } from "@/lib/adnService";

/**
 * Handles CORS preflight requests
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

/**
 * Encodes PDF document as Base64 JSON payload.
 *
 * Serving the document payload inside an application/json response prevents
 * external download interceptors (such as Internet Download Manager - IDM)
 * from hijacking the preview request, allowing the client-side canvas
 * renderer to display the document smoothly in the preview pane.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let allowedHost = "";
  try {
    allowedHost = new URL(ADN_CONFIG.host).hostname;
  } catch {
    allowedHost = "harbour-wren-3226.umberadn.com";
  }

  const isAllowed =
    parsed.hostname === allowedHost ||
    parsed.hostname.endsWith(".umberadn.com") ||
    parsed.hostname.endsWith(".umbercloud.io");

  if (!isAllowed) {
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
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json(
      {
        success: true,
        base64,
        size: arrayBuffer.byteLength,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("[PDF Preview API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 502 });
  }
}

