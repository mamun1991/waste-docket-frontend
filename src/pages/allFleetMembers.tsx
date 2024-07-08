import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';
import AllFleetMembersPage from '@/screens/fleets-members-page/allFleetMembersPage';

const FleetsMembers = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:Drivers')} />
      <Head>
        <title> {t('page:Drivers')}</title>
      </Head>
      <AllFleetMembersPage />
    </PostLoginLayout>
  );
};

export default FleetsMembers;
FleetsMembers.auth = true;
