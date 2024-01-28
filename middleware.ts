import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/monitoring"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
