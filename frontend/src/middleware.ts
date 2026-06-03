import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest,
) {
  const token =
    request.cookies.get(
      "accessToken",
    )?.value;

  const role =
    request.cookies.get(
      "role",
    )?.value;

  const pathname =
    request.nextUrl.pathname;

  if (
    pathname.startsWith(
      "/admin",
    ) &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url,
      ),
    );
  }

  if (
    pathname.startsWith(
      "/teacher",
    ) &&
    role !== "TEACHER"
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url,
      ),
    );
  }

  if (
    !token &&
    (pathname.startsWith(
      "/admin",
    ) ||
      pathname.startsWith(
        "/teacher",
      ))
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
  ],
};