import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';
import HelpComponent from '@/components/shared/Help';

const FAQPage = () => {
  const {t} = useTranslation();
  return (
    <PostLoginLayout>
      <Header heading={t('Help')} />
      <Head>
        <title> {t('Help')}</title>
      </Head>
      <HelpComponent />
    </PostLoginLayout>
  );
};
export default FAQPage;
