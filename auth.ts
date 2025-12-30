import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
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
