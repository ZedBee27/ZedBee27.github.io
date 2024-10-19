import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "@/utils/db";

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" }
      },
      authorize: async (credentials) => {
        console.log(credentials);
        console.log(credentials.password);
        console.log(credentials.email);

        // Find the user by email in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email as string,
          }
        });

        console.log(user);

        if (credentials.password !== user?.password) {
          return null;
        }

        // Create user session if password is valid
        if (!user) {
          return null;
        }
        // Return the user if password is valid
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
