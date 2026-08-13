

// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Routes only a logged-OUT user should see. Authenticated users get bounced to "/".
const GUEST_ONLY_ROUTES = [
    "/login",
    "/register/user",
    "/register/user/activate",
    "/register/company",
];

// Routes that require a valid session. Logged-out users get bounced to "/login".
const PROTECTED_ROUTES = [
    "/proposal",
    "/dashboard",
];

async function verifyToken(token) {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;
    const payload = await verifyToken(token);
    const isAuthenticated = Boolean(payload);

    const isGuestRoute = GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route));
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

    if (isGuestRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/register/user",
        "/register/user/activate",
        "/register/company",
        "/dashboard/:path*",
        "/proposal/:path*",
    ],
};