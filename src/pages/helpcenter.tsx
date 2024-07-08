import Head from 'next/head';
import PreLoginFooter from '@/components/shared/PreLoginFooter';
import Help from '@/components/shared/Help';

const NotFound = () => {
  console.log('');
  return (
    <>
      <Head>
        <title>Help Center</title>
        <link rel='icon' href='/assets/images/logo.png' />
      </Head>
      <div className='pt-0 flex flex-col'>
        <Help />
        <PreLoginFooter />
      </div>
    </>
  );
};
export default NotFound;
