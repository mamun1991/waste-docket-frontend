import {getSession} from 'next-auth/react';
import SignUpDetailsPage from '@/screens/sign-up-details-page';
import graphqlRequestHandler from '@/utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';
import {useRouter} from 'next/router';
import {AccountSubTypes} from '@/constants/enums';

const SignUpDetails = () => {
  console.log('(signupDetails) inside this Page');
  const router = useRouter();
  console.log('SIGNUP  DETAILS PAGE', router?.query);

  return <SignUpDetailsPage />;
};

export default SignUpDetails;

export async function getServerSideProps(context) {
  function hasPendingStatus(invitations) {
    console.log('(signupDetailsPageServerSideProps) hasPendingStatus:', invitations);
    for (let i = 0; i < invitations.length; i++) {
      if (invitations[i].status === 'PENDING') {
        return true;
      }
    }
    return false;
  }
  try {
    const session: any = await getSession(context);
    const {query} = context;
    const userType = query.userType;
    console.log(query, 'query');

    if (!query || Object?.keys(query)?.length === 0) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    }
    console.log('(signupDetailsPageServerSideProps) Session:', session);
    const {data: GetUserById} = await graphqlRequestHandler(
      queries.getUserById,
      {token: session?.accessToken},
      session?.accessToken
    );
    console.log(
      '(signupDetailsPageServerSideProps) mutation running on signup details page GetUserById:',
      GetUserById
    );
    const user = GetUserById?.data?.getUserById?.userData;
    console.log('(signupDetailsPageServerSideProps) user:', user);
    const checkDriverUserType = user?.accountSubType === AccountSubTypes.DRIVER;
    if (checkDriverUserType) {
      if (user.invitations && user.invitations.length > 0) {
        if (hasPendingStatus(user.invitations)) {
          return {
            redirect: {
              destination: `/pendingInvites?type=${query?.type}&userType=${userType}`,
              permanent: false,
            },
          };
        }
      } else {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        };
      }
    }
  } catch (e) {
    console.log('error', e);
  }
  return {};
}
