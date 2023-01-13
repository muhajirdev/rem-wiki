import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId:
        "1040252491603-gq7kqi6adj30lin45hm8ec58707dgsqj.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
