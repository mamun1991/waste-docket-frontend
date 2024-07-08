import Head from 'next/head';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import UserProfilePage from '@/screens/user-profile-page';
import useTranslation from 'next-translate/useTranslation';

const UserProfile = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:Account')} />
      <Head>
        <title> {t('page:Account')}</title>
      </Head>
      <UserProfilePage />
    </PostLoginLayout>
  );
};

export default UserProfile;
UserProfile.auth = true;
