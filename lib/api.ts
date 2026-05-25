import { NextResponse } from "next/server";

const RESPONSE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
};

export function apiJson<T>(body: T, init?: { status?: number }) {
  return NextResponse.json(body, { status: init?.status ?? 200, headers: RESPONSE_HEADERS });
}

export function preflight() {
  return new NextResponse(null, { status: 204, headers: RESPONSE_HEADERS });
}

export function parseVerifiedParam(searchParams: URLSearchParams): boolean {
  const v = searchParams.get("verified");
  return v === "1" || v === "true";
}
