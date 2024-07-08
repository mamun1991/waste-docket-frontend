import Head from 'next/head';
import AllFleetSuggestionsPage from '@/screens/all-fleet-suggestions-page';
import Header from '@/components/header';
import PostLoginLayout from '@/components/Layout/PostLogin';
import useTranslation from 'next-translate/useTranslation';

const Suggestions = () => {
  const {t} = useTranslation();

  return (
    <PostLoginLayout>
      <Header heading={t('page:fleetSuggestions')} />
      <Head>
        <title> {t('page:fleetSuggestions')}</title>
      </Head>
      <AllFleetSuggestionsPage />
    </PostLoginLayout>
  );
};

export default Suggestions;
Suggestions.auth = true;
