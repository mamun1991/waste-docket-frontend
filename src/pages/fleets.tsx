import Head from 'next/head';
import FleetsPage from '@/screens/fleets-page';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';

const Fleets = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:fleets')} />
      <Head>
        <title> {t('page:fleets')}</title>
      </Head>
      <FleetsPage />
    </PostLoginLayout>
  );
};

export default Fleets;
Fleets.auth = true;
