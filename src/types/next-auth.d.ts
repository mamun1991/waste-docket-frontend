// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      email: string;
    };
    expires: string;
    accessToken: string;
    userDetails: {
      _id: string;
      accountType: 'ADMIN' | 'USER';
      accountSubType: 'BUSINESS_ADMIN' | 'DRIVER';
      isSignUpComplete: boolean;
      personalDetails: {
        name: string;
        email: string;
      };
      invitations: {
        _id: string;
        inviteeEmail: string;
        status: 'ACCEPTED' | 'REJECTED' | 'FLEET_DELETED';
        fleetId: null;
        createdAt: string;
      }[];
    };
  }
}
