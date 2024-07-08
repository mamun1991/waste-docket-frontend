import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import PreLoginFooter from '@/components/shared/PreLoginFooter';

const GDPRPolicy = () => {
  const {t} = useTranslation();
  return (
    <>
      <Head>
        <title>GDPR Policy</title>
        <link rel='icon' href='/assets/images/logo.png' />
      </Head>
      <div className='pt-0 flex flex-col'>
        <div className='min-h-full pt-0 pb-12 flex flex-col bg-white h-screen overflow-y-auto'>
          <h1 className='mt-2 px-12 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl'>
            GDPR Policy
            {t('page:empty_string')}
          </h1>
          <div className='px-12 py-4'>
            <div className='text-left'>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Introduction
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                We take your privacy seriously and we are committed to complying with the General
                Data Protection Regulation (GDPR) and the Data Protection Acts 1988-2018. This
                Privacy Policy explains how we collect, use, and protect your personal data when you
                use our website and services. By using our website and services, you consent to our
                use of your personal data in accordance with this Privacy Policy.
              </p>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Data We Collect
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                We collect personal data when you use our website and services. This includes
                information that you provide to us directly, such as your name, email address, and
                any other information that you provide to us when you register for an account. We
                also collect information about your use of our website and services, including your
                IP address, browser type, and the pages you visit
              </p>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Cookies
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                We use cookies to provide you with a better user experience. Cookies are small text
                files that are placed on your device when you visit our website. We use cookies to
                track your preferences and to personalize your experience. You can disable cookies
                in your browser settings, but this may affect the functionality of our website.
              </p>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Use of Your Data
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                We use your personal data to provide you with our services and to improve our
                website. We may also use your data to communicate with you about our products and
                services. We will never sell your personal data to third parties.
              </p>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Data Retention
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                We will retain your personal data for as long as necessary to provide you with our
                services and to comply with our legal obligations. If you delete your account, we
                will delete your personal data within a reasonable timeframe.
              </p>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Your Rights
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                ou have the right to access, rectify, or delete your personal data. You also have
                the right to object to the processing of your personal data and to lodge a complaint
                with the Data Protection Commission. To exercise these rights, please contact us at
                privacy@wastedocket.ie
              </p>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Data We Collect
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                We collect personal data when you use our website and services. This includes
                information that you provide to us directly, such as your name, email address, and
                any other information that you provide to us when you register for an account. We
                also collect information about your use of our website and services, including your
                IP address, browser type, and the pages you visit
              </p>
              <h1 className='mt-2 text-2xl font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Security
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                We take the security of your personal data seriously and we have implemented
                technical and organizational measures to protect your personal data from
                unauthorized access, use, or disclosure.
              </p>
            </div>
          </div>
        </div>
        <PreLoginFooter />
      </div>
    </>
  );
};
export default GDPRPolicy;
