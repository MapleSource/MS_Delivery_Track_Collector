import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    sub: string;
    nickname?: string;
  }

  interface Session {
    user?: User;
  }
}
