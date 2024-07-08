import Head from 'next/head';
import FleetTermsAndConditionsScreen from '@/screens/fleetTermsAndConditions';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';

const FLeetTermsAndConditions = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:Fleet Terms and Conditions')} />
      <Head>
        <title> {t('page:Fleet Terms and Conditions')}</title>
      </Head>
      <FleetTermsAndConditionsScreen />
    </PostLoginLayout>
  );
};

export default FLeetTermsAndConditions;
FLeetTermsAndConditions.auth = true;
