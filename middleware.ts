import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

function getCanonicalRedirect(request: NextRequest) {
  if (process.env.NODE_ENV !== "production" || !process.env.NEXTAUTH_URL) {
    return null;
  }

  const canonicalUrl = new URL(process.env.NEXTAUTH_URL);

  if (request.nextUrl.host === canonicalUrl.host) {
    return null;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.protocol = canonicalUrl.protocol;
  redirectUrl.host = canonicalUrl.host;

  return NextResponse.redirect(redirectUrl, 307);
}

export async function middleware(request: NextRequest) {
  const canonicalRedirect = getCanonicalRedirect(request);

  if (canonicalRedirect) {
    return canonicalRedirect;
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set(
        "callbackUrl",
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
