import {getSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import PendingInvitesPage from '@/screens/pending-invites-page';
import queries from 'constants/GraphQL/User/queries';
import {AccountSubTypes} from '@/constants/enums';

const PendingInvites = ({invitations}) => <PendingInvitesPage invitations={invitations} />;

export default PendingInvites;

export async function getServerSideProps(context) {
  try {
    const session: any = await getSession(context);
    const {query} = context;
    const userType = query.userType;
    console.log('Pending INVITES PAGE', query);
    console.log('(pendingInvitesPageServerSideProps) Session:', session);
    if (!session) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    }

    const {data: GetPendingInvitationsByEmail} = await graphqlRequestHandler(
      queries.GetPendingInvitationsByEmail,
      {},
      session.accessToken
    );
    console.log('(pendingInvitesPageServerSideProps) Data:', GetPendingInvitationsByEmail);
    const invitations = GetPendingInvitationsByEmail?.data?.getPendingInvitations?.invitations;
    if (invitations && invitations.length === 0) {
      const {data: GetUserById} = await graphqlRequestHandler(
        queries.getUserById,
        {token: session?.accessToken},
        session?.accessToken
      );
      console.log(
        '(pendingInvitesPageServerSideProps) mutation running on pending invites page GetUserById:',
        GetUserById
      );
      const user = GetUserById?.data?.getUserById?.userData;

      if (user?.isSignUpComplete) {
        console.log(
          '(pendingInvitesPageServerSideProps) redirecting to dashboard since user invitations are:',
          user.invitations.length
        );
        return {
          redirect: {
            destination: '/dashboard/',
            permanent: false,
          },
        };
      }
      return {
        redirect: {
          destination: `/signupDetails?type=${query?.type}&userType=${userType}`,
          permanent: false,
        },
      };
    } else if (
      invitations &&
      invitations.length > 0 &&
      userType === AccountSubTypes.BUSINESS_ADMIN
    ) {
      return {
        redirect: {
          destination: `/signupAsDriverOrBusinessConfirmation?type=${query?.type}&userType=${userType}`,
          permanent: false,
        },
      };
    }
    return {
      props: {
        invitations: invitations || [],
      },
    };
  } catch (e) {
    console.log('error', e);
  }
  return {
    props: {
      invitations: [],
    },
  };
}
