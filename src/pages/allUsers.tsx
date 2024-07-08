import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';
import {getSession} from 'next-auth/react';
import AllUsersPage from '@/screens/all-users-admin-page';
import {ACCOUNT_TYPES} from '@/constants/enums';

const AllUsers = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout fullWidth={true}>
      <Header heading={t('page:users')} />
      <Head>
        <title> {t('page:users')}</title>
      </Head>
      <AllUsersPage />
    </PostLoginLayout>
  );
};

export default AllUsers;

export async function getServerSideProps(context) {
  try {
    const session: any = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    }

    if (session?.userDetails?.accountType !== ACCOUNT_TYPES.ADMIN) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }
  } catch (e) {
    console.log('e', e);
  }
  return {};
}
