import NextAuth, {type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/utils/db"
import authConfig from "./auth.config"

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
      /** The user's postal address. */
        id?: string
        role: string
    }
    interface Session {
      user: {
        /** The user's postal address. */
        id: string
        role: string
        /**
         * By default, TypeScript merges new interface properties and overwrites existing ones.
         * In this case, the default session user properties will be overwritten,
         * with the new ones defined above. To keep the default session user properties,
         * you need to add them back into the newly declared interface.
         */
      } & DefaultSession["user"]
    }
  }
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    callbacks: {
        jwt({ token, user }) {
            // Cast the user to ExtendUser if it exists
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
      return token;
  },
        async session({ session, token }) {
            // Ensure session user includes the role;
            
            if (session.user) {
                const user = await prisma.user.findUnique({
                  where: { email: session.user.email ?? undefined },
                  select: { role: true },
                });
                if (user) {
                  session.user.id = token.id as string;
                  session.user.role = user?.role as string;
                }
              }
            return session;
        },
        authorized: async ({ auth }) => {
          // Logged in users are authenticated, otherwise redirect to login page
          return !!auth
        },
      },
      debug: false,
      session: {
        strategy: "jwt"
      },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    ...authConfig
  })