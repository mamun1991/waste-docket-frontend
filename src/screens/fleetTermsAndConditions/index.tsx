import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import queries from 'constants/GraphQL/Fleet/queries';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import Loader from 'components/shared/Loader/Loader';

const MDPreviewer = dynamic(() => import('@uiw/react-markdown-preview'), {ssr: false});
const FleetTermsAndConditionsScreen = () => {
  const {data: session} = useSession();
  const {query} = useRouter();

  const {data, loading} = useQuery(queries.GetTermsAndConditionsByFleetId, {
    variables: {
      fleetId: query.index,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });
  const termsConditionsData = data?.getTermsAndConditionsByFleetId;
  if (loading) {
    return <Loader />;
  }
  return (
    <div className='pb-4'>
      <div className='flex gap-x-6'>
        <span>
          <span className='text-primary  mt-5 font-bold text-xl'>Fleet Name: </span>
          <span className='text-primary text-xl'>{termsConditionsData?.fleet?.name}</span>
        </span>
        <span>
          <span className='text-primary mt-5 font-bold text-xl'>Docket Number: </span>
          <span className='text-primary text-xl'>{query?.docketNumber}</span>
        </span>
      </div>
      <p className='text-primary  mt-6 font-bold text-xl'>Terms & Conditions: </p>
      {termsConditionsData?.fleet?.termsAndConditions && (
        <div data-color-mode='light'>
          <MDPreviewer source={termsConditionsData?.fleet?.termsAndConditions} />
        </div>
      )}
    </div>
  );
};

export default FleetTermsAndConditionsScreen;
