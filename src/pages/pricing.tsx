import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';
import PricePage from '@/screens/pricing-page';
import Head from 'next/head';
import Header from '@/components/header';

const Pricing = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:pricing')} />
      <Head>
        <title>Pricing</title>
        <link rel='icon' href='/assets/images/logo.png' />
      </Head>
      <PricePage />
    </PostLoginLayout>
  );
};
export default Pricing;
