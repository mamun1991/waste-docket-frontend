import {useRouter} from 'next/router';
import React from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';
import DocketImagePage from '@/screens/dockets-page/DocketImagePage';
// Docket Page
const DocketImageDataPage = () => {
  const {t} = useTranslation();
  const router = useRouter();
  return (
    <PostLoginLayout>
      <Header heading={t('page:docketData')} />
      <Head>
        <title> {t('page:docketData')}</title>
      </Head>
      <DocketImagePage docketID={router.query.docketId as string} />
    </PostLoginLayout>
  );
};

export default DocketImageDataPage;
