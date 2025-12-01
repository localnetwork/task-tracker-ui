import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

// Decode JWT
const decodeToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
};

// 🔹 Block login/register for logged-in users
const isLoggedInBlock = async (req) => {
  const token = req.cookies.get(process.env.NEXT_PUBLIC_TOKEN)?.value;
  const restrictedPaths = ["/login", "/register"];

  if (token && restrictedPaths.includes(req.nextUrl.pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return null;
};

// 🔹 Redirect unauthenticated users to /login
const redirectIfNotLoggedIn = async (req) => {
  const token = req.cookies.get(process.env.NEXT_PUBLIC_TOKEN)?.value;

  // If no token and trying to access a protected route
  const protectedPaths = ["/"]; // add other protected routes here
  if (!token && protectedPaths.includes(req.nextUrl.pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return null;
};

export async function middleware(req) {
  const loggedInBlockResponse = await isLoggedInBlock(req);
  if (loggedInBlockResponse) return loggedInBlockResponse;

  const redirectResponse = await redirectIfNotLoggedIn(req);
  if (redirectResponse) return redirectResponse;

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
