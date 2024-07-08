import Head from 'next/head';
import FleetCustomersPage from '@/screens/fleet-customers-page';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';

const Fleets = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:fleetCustomers')} />
      <Head>
        <title> {t('page:fleetCustomers')}</title>
      </Head>
      <FleetCustomersPage />
    </PostLoginLayout>
  );
};

export default Fleets;
Fleets.auth = true;
