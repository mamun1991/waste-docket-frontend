import {getSession} from 'next-auth/react';
import Home from '@/screens/start-page';
import queries from 'constants/GraphQL/User/queries';
import graphqlRequestHandler from '@/utils/graphqlRequestHandler';

const Index = () => <Home />;

export default Index;

export async function getServerSideProps(context) {
  const session: any = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signup',
        permanent: false,
      },
    };
  }
  const {data: GetUserById} = await graphqlRequestHandler(
    queries.getUserById,
    {token: session.accessToken},
    session.accessToken
  );

  const user = GetUserById?.data?.getUserById?.userData;

  if (!user?.isSignUpComplete) {
    return {
      redirect: {
        destination: '/signupDetails',
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: '/dashboard/',
      permanent: false,
    },
  };
}
