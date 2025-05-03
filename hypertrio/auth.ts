import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Extend the session types to include our custom fields
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    emailVerified?: Date | null;
    sessionId?: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      sessionId: string;
      emailVerified?: Date | null;
    }
  }
}

// Extend the JWT type to include our custom fields
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    sessionId: string;
  }
}

/**
 * NextAuth configuration with FastAPI backend integration
 * Flow:
 * 1. User submits credentials through NextAuth
 * 2. NextAuth sends credentials to FastAPI backend for verification
 * 3. FastAPI verifies credentials, creates a session, and returns user data
 * 4. NextAuth creates a JWT with the user data and session ID
 * 5. JWT is used for subsequent authenticated requests
 */
export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorizing with credentials:", credentials?.email);
          
          // Send credentials to FastAPI backend for verification
          const res = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            }),
          });

          // Handle error response
          if (!res.ok) {
            const errorText = await res.text();
            console.error(`Login failed (${res.status}):`, errorText);
            return null;
          }
          
          // Get user data and session ID from FastAPI
          const user = await res.json();
          console.log("Login successful, user data:", user);
          
          // Return user data to be encoded in the JWT
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            emailVerified: new Date(), 
            sessionId: user.sessionId
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Store user data and session ID in the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.sessionId = user.sessionId || "";
        token.emailVerified = user.emailVerified; // Add the required emailVerified property
      }
      return token;
    },

    // Make user data and session ID available in the session
    async session({ session, token }) {
      if (token) {
        if (!session.user) {
          session.user = {
            id: "",
            email: "",
            name: "",
            sessionId: "",
            emailVerified: null
          };
        }
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.sessionId = token.sessionId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 30, // 30 minutes
  },
  debug: true, // Enable debug mode in development
});
