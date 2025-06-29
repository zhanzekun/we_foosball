import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.NODE_ENV === 'production' ? process.env.GITHUB_ID || '' : process.env.GITHUB_ID_DEV || '',
      clientSecret: process.env.NODE_ENV === 'production' ? process.env.GITHUB_SECRET || '' : process.env.GITHUB_SECRET_DEV || '',
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
})
 
// export default handler;

export { handler as GET, handler as POST } 


// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     // ...add more providers here
//   ],
// }

// export default NextAuth(authOptions)