import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';
import {getSession} from 'next-auth/react';
import AllFleetsPage from '@/screens/all-fleets-admin-page';
import {ACCOUNT_TYPES} from '@/constants/enums';

const AllFleets = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:fleets')} />
      <Head>
        <title> {t('page:fleets')}</title>
      </Head>
      <AllFleetsPage />
    </PostLoginLayout>
  );
};

export default AllFleets;

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
