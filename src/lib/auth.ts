import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { buildDefaultCategoriesForUser } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

const googleCredentialsConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Email dan Password",
    credentials: {
      email: {
        label: "Email",
        type: "email",
      },
      password: {
        label: "Password",
        type: "password",
      },
    },
    async authorize(credentials) {
      const parsedCredentials = loginSchema.safeParse(credentials);

      if (!parsedCredentials.success) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: {
          email: parsedCredentials.data.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          passwordHash: true,
        },
      });

      if (!user?.passwordHash) {
        return null;
      }

      const isPasswordValid = await compare(
        parsedCredentials.data.password,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  }),
];

if (googleCredentialsConfigured) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers,
  events: {
    async createUser({ user }) {
      await prisma.category.createMany({
        data: buildDefaultCategoriesForUser(user.id),
      });
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};

export function getCurrentSession() {
  return getServerSession(authOptions);
}

export const isGoogleProviderEnabled = googleCredentialsConfigured;
