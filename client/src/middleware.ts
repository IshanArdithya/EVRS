import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const publicPaths = [
    "/",
    "/admin/login",
    "/moh/login",
    "/healthcare-provider/login",
    "/hospital/login",
    "/login",
  ];

  // redirect from base to login
  if (pathname === "/admin") {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/moh") {
    url.pathname = "/moh/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/healthcare-provider") {
    url.pathname = "/healthcare-provider/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/hospital") {
    url.pathname = "/hospital/login";
    return NextResponse.redirect(url);
  }

  // redirect loggedin users from login to dashboards
  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;
    if (token) {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/moh/login") {
    const token = request.cookies.get("moh_token")?.value;
    if (token) {
      url.pathname = "/moh/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/healthcare-provider/login") {
    const token = request.cookies.get("hcp_token")?.value;
    if (token) {
      url.pathname = "/healthcare-provider/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/hospital/login") {
    const token = request.cookies.get("hospital_token")?.value;
    if (token) {
      url.pathname = "/hospital/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/login") {
    const token = request.cookies.get("citizen_token")?.value;
    if (token) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // role based route protection
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/moh")) {
    const token = request.cookies.get("moh_token")?.value;
    if (!token) {
      url.pathname = "/moh/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/healthcare-provider")) {
    const token = request.cookies.get("hcp_token")?.value;
    if (!token) {
      url.pathname = "/healthcare-provider/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/hospital")) {
    const token = request.cookies.get("hospital_token")?.value;
    if (!token) {
      url.pathname = "/hospital/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("citizen_token")?.value;
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin/login",
    "/moh/:path*",
    "/moh/login",
    "/healthcare-provider/:path*",
    "/healthcare-provider/login",
    "/hospital/:path*",
    "/hospital/login",
    "/dashboard/:path*",
    "/login",
  ],
};
