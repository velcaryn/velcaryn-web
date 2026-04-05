import { NextResponse } from 'next/server';

// Option A: Edge-Local Rate Limiter
// Note: This map persists only as long as this specific Edge function isolate remains "warm".
// It is sufficient to block generic automated bursts but not universally distributed state.
const rateLimitMap = new Map();

// Define allowed origins for strict CORS policies
const allowedOrigins = [
    'https://www.velcaryn.com',
    'https://velcaryn.com',
    'https://velcaryn.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
];

export async function middleware(req) {
    const origin = req.headers.get('origin');
    
    // ----------------------------------------------------------------------
    // 1. Strict CORS Domain Validation
    // ----------------------------------------------------------------------
    const isApiRoute = req.nextUrl.pathname.startsWith('/api/');
    
    // If the request isn't targeting our internal API, ignore middleware processing
    if (!isApiRoute) return NextResponse.next();

    // Aggressive Origin Filter: Block any external domain attempting to programmatically hit the API.
    // If 'origin' exists (which browsers enforce), and it's NOT our site, reject it entirely.
    if (origin && !allowedOrigins.includes(origin)) {
        return NextResponse.json(
            { success: false, error: 'CORS policy blocked by security perimeter.' },
            { status: 403 }
        );
    }

    const res = NextResponse.next();

    // Inject strict CORS headers to the response
    if (origin) {
        res.headers.set('Access-Control-Allow-Origin', origin);
        res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // Handle Pre-flight ping requests
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { headers: res.headers, status: 200 });
    }

    // ----------------------------------------------------------------------
    // 2. Global API Rate Limiting (Targeting specifically sensitive submission routes)
    // ----------------------------------------------------------------------
    const isSensitiveRoute = req.nextUrl.pathname.startsWith('/api/quote');
    
    if (isSensitiveRoute && req.method === 'POST') {
        const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
        
        // Max 5 hits per hour limit profile
        const limitStore = rateLimitMap.get(ip) || { count: 0, resetTime: Date.now() + 3600000 };
        
        if (Date.now() > limitStore.resetTime) {
            limitStore.count = 0;
            limitStore.resetTime = Date.now() + 3600000;
        }

        if (limitStore.count >= 5) {
            return NextResponse.json(
                { success: false, error: "Too many requests to this secure endpoint. Try again later." },
                { status: 429, headers: res.headers }
            );
        }

        // Increment the hit count
        limitStore.count += 1;
        rateLimitMap.set(ip, limitStore);
    }

    return res;
}

// Ensure the middleware strictly evaluates only the API perimeter.
export const config = {
    matcher: ['/api/:path*'],
};
