import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';
import WastePermitDocuments from '@/screens/waste-permit-documents';

const WastePermiDocumentPage = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:wastePermitDocuments')} />
      <Head>
        <title> {t('page:wastePermitDocuments')}</title>
      </Head>
      <WastePermitDocuments />
    </PostLoginLayout>
  );
};

export default WastePermiDocumentPage;
WastePermiDocumentPage.auth = true;
