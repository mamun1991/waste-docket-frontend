import {useState, useEffect} from 'react';
import Loader from '@/components/shared/Loader/Loader';
import {useSession} from 'next-auth/react';
import axios from 'axios';
const EnvForAdmin = () => {
  const session = useSession();
  const [serverEnv, setServerEnv] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServerEnv = async () => {
      try {
        setLoading(true);
        const sessionAccessToken = session?.data?.accessToken;
        const response = await axios.get(`/api/env`, {
          params: {
            accessToken: sessionAccessToken,
          },
        });
        setServerEnv(response.data);
      } catch (error) {
        console.log('Error fetching server-side env variables', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServerEnv();
  }, []);

  // Client-side environment variables
  const clientEnvVariables = [
    {name: 'NEXT_PUBLIC_GRAPHQL_URL', value: process.env.NEXT_PUBLIC_GRAPHQL_URL},
    {name: 'NEXT_PUBLIC_STRIPE_MODE', value: process.env.NEXT_PUBLIC_STRIPE_MODE},
    {
      name: 'NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY',
      value: process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY,
    },
    {
      name: 'NEXT_PUBLIC_STRIPE_PRODUCTION_PUBLISHABLE_KEY',
      value: process.env.NEXT_PUBLIC_STRIPE_PRODUCTION_PUBLISHABLE_KEY,
    },
  ];

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className='w-full flex-col'>
        <h1 className='font-bold text-2xl text-primary'>Env Variables</h1>
        <div className='w-full flex flex-col pt-2 items-center justify-start gap-2 mb-3'>
          {clientEnvVariables.map((envVar, index) => (
            <div key={index} className='flex flex-row w-full items-center justify-start gap-4'>
              <div className='text-sm font-medium w-full sm:w-1/3'>{envVar.name}:</div>
              <div className='text-sm w-full sm:w-1/3 break-all'>{envVar.value}</div>
            </div>
          ))}
          {Object.entries(serverEnv).map(([key, value], index) => (
            <div key={index} className='flex flex-row w-full items-center justify-start gap-4'>
              <div className='text-sm font-medium w-full sm:w-1/3'>{key}:</div>
              <div className='text-sm w-full sm:w-1/3 break-all'>{String(value)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EnvForAdmin;
