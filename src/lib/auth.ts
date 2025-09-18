import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text' },
        loginMethod: { label: 'Login Method', type: 'text' },
      },
      async authorize(credentials) {
        console.log('NextAuth.js: authorize called with:', credentials);

        if (!credentials?.email) {
          console.log('NextAuth.js: No email provided');
          return null;
        }

        try {
          let response;

          if (credentials.loginMethod === 'otp') {
            // Handle OTP login
            const apiUrl =
              process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
            response = await axios.post(`${apiUrl}/auth/login-otp`, {
              email: credentials.email,
              code: credentials.otp,
            });
          } else {
            // Handle password login
            console.log('NextAuth: Attempting login with:', {
              email: credentials.email,
              loginMethod: credentials.loginMethod,
              apiUrl: process.env.NEXT_PUBLIC_API_URL,
            });

            // Check if API URL is available
            if (!process.env.NEXT_PUBLIC_API_URL) {
              console.error('NextAuth: NEXT_PUBLIC_API_URL is not defined!');
              return null;
            }

            const apiUrl =
              process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
            console.log('NextAuth: Using API URL:', apiUrl);
            response = await axios.post(`${apiUrl}/auth/login`, {
              email: credentials.email,
              password: credentials.password,
              loginMethod: credentials.loginMethod,
            });
          }

          console.log('NextAuth: Backend response:', response.data);

          if (response.data && response.data.user) {
            const user = response.data.user;
            const userObj = {
              id: user.id.toString(),
              email: user.email,
              name: user.username || user.email,
              role: user.role,
              accessToken: response.data.accessToken,
            };
            console.log('NextAuth: Returning user:', userObj);
            return userObj;
          }

          console.log('NextAuth: No user data in response');
          return null;
        } catch (error: any) {
          console.error(
            'NextAuth: Auth error:',
            error.response?.data || error.message
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Send user data to your NestJS backend
          const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.post(
            `${apiUrl}/auth/google`,
            {
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              image: user.image,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.data.user) {
            user.id = response.data.user.id.toString();
            user.role = response.data.user.role;
            user.accessToken = response.data.accessToken;
          }
        } catch (error) {
          console.error('Google signin error:', error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    role?: string;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    role?: string;
  }
}
