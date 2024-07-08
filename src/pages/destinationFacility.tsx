import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';
import FacilityPage from '@/screens/destination-facility-page';

const DestinationFacility = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:destinationFacility')} />
      <Head>
        <title> {t('page:destinationFacility')}</title>
      </Head>
      <FacilityPage />
    </PostLoginLayout>
  );
};

export default DestinationFacility;
DestinationFacility.auth = true;
