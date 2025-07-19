import helmet from "helmet";

const allowedOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";
const rateLimitMap = new Map();
const RATE_LIMIT = 100; // requests per 15 min
const WINDOW = 15 * 60 * 1000;

export async function middleware(req) {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  if (entry.count > RATE_LIMIT) {
    return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
  }
  // Helmet headers
  const res = await helmet()(req);
  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
} 