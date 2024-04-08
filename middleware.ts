import { type NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { error } from "console";

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, "20 s"),
});

// Define which routes you want to rate limit
export const config = {
  matcher: ["/", "/anime/[id]"],
};

export default async function middleware(request: NextRequest) {
  // You could alternatively limit based on user ID or similar
  const ip = request.ip ?? "127.0.0.1";
  const { success, pending, limit, reset, remaining } =
    await ratelimit.limit(ip);

   if(remaining === 0){
    return new Response(JSON.stringify({error: 'Limit request exceeded'}), {status: 429, headers: {'X-RateLimit-Limit': limit.toString(), 'X-RateLimit-Remaining':remaining.toString() , 'X-RateLimit-Reset': reset.toString()}})
   }
  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/blocked", request.url));
}

// const rateLimitMap = new Map();

// export default function rateLimitMiddleware(handler) {
//   return (req, res) => {
//     const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
//     const limit = 5; // Limiting requests to 5 per minute per IP
//     const windowMs = 20 * 1000; // 1 minute

//     if (!rateLimitMap.has(ip)) {
//       rateLimitMap.set(ip, {
//         count: 0,
//         lastReset: Date.now(),
//       });
//     }

//     const ipData = rateLimitMap.get(ip);

//     if (Date.now() - ipData.lastReset > windowMs) {
//       ipData.count = 0;
//       ipData.lastReset = Date.now();
//     }

//     if (ipData.count >= limit) {
//       return res.status(429).send("Too Many Requests");
//     }

    ipData.count += 1;

    return handler(req, res);
  };
}
