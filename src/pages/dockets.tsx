import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import DocketPage from '@/screens/dockets-page';
import useTranslation from 'next-translate/useTranslation';

const Dashboard = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:dockets')} />
      <Head>
        <title> {t('page:dockets')}</title>
      </Head>
      <DocketPage />
    </PostLoginLayout>
  );
};

export default Dashboard;
Dashboard.auth = true;
