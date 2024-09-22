import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
export const runtime = "edge";

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.headers.get("Content-Type") !== "application/json") {
    return NextResponse.json({ error: "Must be JSON" }, { status: 400 });
  }

  const body = await req.json();
  const slug = body.slug;

  if (!slug) {
    return NextResponse.json({ error: "Slug not found" }, { status: 400 });
  }

  const ip = req.ip;
  if (ip) {
    // Hash the IP in order to not store it directly in your db.
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip),
    );
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // deduplicate the ip for each slug
    const isNew = await redis.set(["deduplicate", hash, slug].join(":"), true, {
      nx: true,
      ex: 24 * 60 * 60,
    });
    if (!isNew) {
      return NextResponse.json(null, { status: 202 });
    }
  }

  await redis.incr(["pageviews", "projects", slug].join(":"));
  return NextResponse.json(null, { status: 202 });
}
