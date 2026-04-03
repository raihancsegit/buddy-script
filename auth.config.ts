import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = 
        nextUrl.pathname.startsWith("/login") || 
        nextUrl.pathname.startsWith("/register");

      if (!isLoggedIn && !isAuthPage) {
        return false;
      }
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add empty providers to satisfy NextAuthConfig
} satisfies NextAuthConfig;
