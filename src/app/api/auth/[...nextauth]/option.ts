import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/dbConnect";
import User from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    // ✅ GitHub Authentication
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),

    // ✅ Credentials Authentication (Email/Password)
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const { email, password } = credentials;
        await connectToDatabase();

        try {
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("Invalid email or username");
          }

          const passwordChecking = await bcrypt.compare(password, user.password);
          if (passwordChecking) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/error",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);