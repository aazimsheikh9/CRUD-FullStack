export { default } from "next-auth/middleware";

export const config = {
  // matcher: ["/", "/edit-user/:path*", "/reset-password/:path*"],
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
};
