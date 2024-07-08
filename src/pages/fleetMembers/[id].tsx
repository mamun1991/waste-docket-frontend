import Head from 'next/head';
import FleetMembersPage from '@/screens/fleets-members-page';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';

const Fleets = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:fleetMembers')} />
      <Head>
        <title> {t('page:fleetMembers')}</title>
      </Head>
      <FleetMembersPage />
    </PostLoginLayout>
  );
};

export default Fleets;
Fleets.auth = true;
