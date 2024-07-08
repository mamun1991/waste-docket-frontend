import {getSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';
import SignupAsDriverOrBusinessConfirmationPage from '@/screens/signupAsDriverOrBusinessConfirmationPage';

const SignupAsDriverOrBusinessConfirmation = ({invitations}) => (
  <SignupAsDriverOrBusinessConfirmationPage invitations={invitations} />
);

export default SignupAsDriverOrBusinessConfirmation;

export async function getServerSideProps(context) {
  try {
    const session: any = await getSession(context);
    const {query} = context;
    console.log('Signup As Driver or Business Confirmation Page', query);
    console.log('(signupAsBusinessOrDriverPageServerSideProps) Session:', session);
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
    console.log(
      '(signupAsBusinessOrDriverPageServerSideProps) Data:',
      GetPendingInvitationsByEmail
    );
    const invitations = GetPendingInvitationsByEmail?.data?.getPendingInvitations?.invitations;
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
