import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
		Credentials({
			name: "テストアカウント",
			credentials: {
				email: { label: "メール", type: "email" },
				password: { label: "パスワード", type: "password" },
			},
			async authorize(credentials) {
				if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
					return null;
				}
				if (
					credentials?.email !== process.env.TEST_USER_EMAIL ||
					credentials?.password !== process.env.TEST_USER_PASSWORD
				) {
					return null;
				}
				const user = await prisma.user.upsert({
					where: { email: process.env.TEST_USER_EMAIL },
					update: {},
					create: { email: process.env.TEST_USER_EMAIL, name: "テストユーザー" },
				});
				return { id: user.id, email: user.email, name: user.name };
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async jwt({ token, user, account }) {
			console.log("[NextAuth] JWT callback:", {
				hasUser: !!user,
				hasAccount: !!account,
				tokenId: token.id,
				userEmail: user?.email,
			});

			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.picture = user.image;
			}
			return token;
		},
		async session({ session, token }) {
			console.log("[NextAuth] Session callback:", {
				tokenId: token.id,
				sessionUserEmail: session.user?.email,
			});

			if (session.user && token.id) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	// Vercel Preview環境やその他の動的URLに対応
	trustHost: true,
	debug: process.env.NODE_ENV === "development",
});
