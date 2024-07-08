import PostLoginLayout from '@/components/Layout/PostLogin';
import Logging from '@/components/PostLogin/Logging';
import {getSession} from 'next-auth/react';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

const Logs = ({session}) => {
  // const {status} = useSession();
  const {t} = useTranslation();
  return (
    <PostLoginLayout>
      <Head>
        <title>{t('page:logs')}</title>
      </Head>
      <Logging session={session} />
    </PostLoginLayout>
  );
};

export default Logs;
Logs.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
