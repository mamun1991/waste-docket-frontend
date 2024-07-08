import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import DashboardPage from '@/screens/dashboard-page';
import useTranslation from 'next-translate/useTranslation';

const Dashboard = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:dashboard')} />
      <Head>
        <title> {t('page:dashboard')}</title>
      </Head>
      <DashboardPage />
    </PostLoginLayout>
  );
};

export default Dashboard;
Dashboard.auth = true;
