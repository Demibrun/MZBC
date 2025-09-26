export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin",                          // admin dashboard
    "/api/testimonies/:path*",         // admin APIs
    "/api/daily/:path*",               // your daily admin APIs
    // add more protected API prefixes here
  ],
};
