import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PreLoginFooter from '@/components/shared/PreLoginFooter';

const NotFound = () => {
  const {t} = useTranslation();
  return (
    <>
      <Head>
        <title>Not Found</title>
        <link rel='icon' href='/assets/images/logo.png' />
      </Head>
      <div className='min-h-full pt-16 flex flex-col bg-white'>
        <main className='flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-screen'>
          <div className='flex-shrink-0 flex justify-center'>
            <Link href='/' passHref>
              <span className='inline-flex'>
                <span className='sr-only'>Waste Docket Management System</span>
                <Image
                  className='h-12 w-auto'
                  src='/assets/images/logo.png'
                  height={50}
                  width={400}
                  alt='logo'
                />
              </span>
            </Link>
          </div>
          <div className='py-16'>
            <div className='text-center'>
              <p className='text-sm font-semibold text-mainBlue uppercase tracking-wide'>
                404 error
              </p>
              <h1 className='mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl'>
                {t('page:404_does_not_exist')}
              </h1>
              <div className='mt-6'>
                <Link href='/' passHref>
                  <span className='text-base font-medium text-mainBlue hover:text-blue-700 cursor-pointer'>
                    {t('page:404_go_home')}
                    <span aria-hidden='true'> &rarr;</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <PreLoginFooter />
      </div>
    </>
  );
};
export default NotFound;
