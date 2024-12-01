import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Define the User interface based on the structure from your API
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  emailVerified: Date | null; // Add this field to satisfy AdapterUser requirements
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          // Call your external API with email and password
          const res = await fetch(
            "https://cofeetracebackend-2.onrender.com/api/v0/user/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
                role: credentials?.role,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data?.data?.user_data && data?.data?.access_token) {
            console.log("Data found:", data);

            const user: User = {
              id: data.data.user_data.id,
              name: data.data.user_data.name,
              email: data.data.user_data.email,
              role: data.data.user_data.role,
              accessToken: data.data.access_token,
              emailVerified: null, // Provide a default value
            };

            console.log("User found:", user);
            return user; // Return the user object
          } else {
            throw new Error(data?.data?.message || "Login failed.");
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          throw new Error("Error authenticating user.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/authentication/login", // Custom login page
  },
  session: {
    strategy: "jwt", // Use JWT for session handling
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as User; // Store the user in the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User; // Attach the user object to the session
      session.accessToken = (token.user as User)?.accessToken; // Optionally pass the access token
      return session;
    },
  },
});
