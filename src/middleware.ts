export { default } from "next-auth/middleware";

// match all routes that start with /dashboard
export const config = { matcher: "/dashboard/:path*" };
