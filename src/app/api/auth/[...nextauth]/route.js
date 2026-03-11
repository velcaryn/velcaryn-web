import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            // Strictly restrict to admin account
            if (user.email === "admin@velcaryn.com") {
                return true;
            } else {
                return "/dashboard/unauthorized";
            }
        },
    },
    pages: {
        error: "/dashboard/unauthorized",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
