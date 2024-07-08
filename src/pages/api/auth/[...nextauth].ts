import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import signinMutations from 'constants/GraphQL/SignIn/mutations';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import jwt from 'jsonwebtoken';

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: `${process.env.JWT_SECRET}`,
  jwt: {
    secret: `${process.env.JWT_SECRET}`,
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/404', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in with OTP',

      credentials: {
        fullName: {label: 'fullName', type: 'text', placeholder: 'John Smith'},
        email: {label: 'Email', type: 'text', placeholder: 'jsmith@example.com'},
        accountSubType: {label: 'accountSubType', type: 'text', placeholder: 'BUSINESS_ADMIN'},
        otpToken: {label: 'OTP Token', type: 'text', placeholder: '********'},
      },
      async authorize(credentials) {
        try {
          const {data} = await graphqlRequestHandler(
            signinMutations.validateOtp,
            {
              fullName: credentials?.fullName,
              email: credentials?.email,
              accountSubType: credentials?.accountSubType,
              otpToken: credentials?.otpToken,
            },
            process.env.BACKEND_API_KEY
          );
          const {email, token, response, user} = data.data.validateOtp;

          if (response.status === 200) {
            return {email, accessToken: token, response, user};
          }
          return null;
        } catch (err) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({token, user}) {
      if (token?.accessToken) {
        const userAccessToken: UserAccessToken = token as unknown as UserAccessToken;
        const backendAccessToken: string = userAccessToken.accessToken;

        const decodedToken = jwt.verify(
          backendAccessToken,
          process.env.JWT_ACCESS_TOKEN_SECRET!
        ) as unknown as AccessToken;

        const ONE_DAY_SECONDS = 60 * 60 * 24;

        if (decodedToken.exp - Date.now() / 1000 < ONE_DAY_SECONDS) {
          token.accessToken = jwt.sign(
            {UserId: decodedToken.UserId},
            process.env.BACKEND_JWT_SECRET!,
            {
              algorithm: 'HS256',
              expiresIn: '7d',
            }
          );
        }
      }

      if (user) {
        token = {
          accessToken: user.accessToken,
          email: user.email,
          user: user.user,
        };
      }
      return token;
    },

    async session({session, token}: {session: any; token: any}) {
      session.accessToken = token.accessToken;
      session.userDetails = token?.user;
      return session;
    },
  },
});

interface PersonalDetails {
  name: string;
  email: string;
}

interface User {
  _id: string;
  accountType: string;
  isSignUpComplete: boolean;
  personalDetails: PersonalDetails;
}

interface UserAccessToken {
  accessToken: string;
  email: string;
  name: string;
  user: User;
  iat: number;
  exp: number;
  jti: string;
}

interface AccessToken {
  UserId: string;
  iat: number;
  exp: number;
}
