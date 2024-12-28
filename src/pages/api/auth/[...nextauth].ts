import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        username: {
          label: "Usuario",
          type: "text",
          placeholder: "correo@ejemplo.com",
        },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          const reqData = {
            ...credentials,
            scope: "openid profile offline_access",
            grant_type: "password",
            audience: process.env.AUTH0_AUDIENCE,
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            connection: "Username-Password-Authentication",
          } as any;
          const params = new URLSearchParams(reqData);
          const authorize = await axios.post(
            `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
            params
          );
          if (authorize.status === 200 && authorize.data.access_token) {
            const user: any = jwtDecode(authorize.data.id_token);
            return { ...user, tokens: authorize.data };
          }
        } catch (error) {
          console.error("ERROR AUTHORIZE: ", error);
        }
        return null;
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  session: {
    strategy: "jwt",
  },
  pages: { signIn: "/", error: "/" },
  secret: process.env.AUTH0_SECRET,
  callbacks: {
    jwt: async ({ token, user, account }: any) => {
      if (account && user) {
        return {
          accessToken: user.tokens.access_token,
          refreshToken: user.tokens.refresh_token,
          expiresAt: user.exp * 1000,
          user: {
            name: user.name,
            nickname: user.nickname,
            sub: user.sub,
          },
        };
      }

      if (Date.now() < token.expiresAt) {
        return token;
      }
      return null;
    },
    session: async ({ session, token }: any) => {
      session.user = token.user;
      session.token = token.accessToken;
      return session;
    },
  },
  debug: true,
};

export default NextAuth(authOptions);
