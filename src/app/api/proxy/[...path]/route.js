import { NextResponse } from "next/server";
import { ADN_CONFIG } from "@/lib/adnService";

export async function GET(request, context) {
  const { params } = context;
  const { path } = await params; // <-- Await params here!
  const targetUrl = `${ADN_CONFIG.host}/api/vc/${path.join("/")}`;

  const response = await fetch(targetUrl, {
    // Optionally forward headers if needed
    // headers: request.headers,
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
