import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';

const Fleets = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:fleetDockets')} />
      <Head>
        <title> {t('page:fleetDockets')}</title>
      </Head>
      <h1>Please provide fleetId as /fleetDockets/[id]</h1>
    </PostLoginLayout>
  );
};

export default Fleets;
Fleets.auth = true;
