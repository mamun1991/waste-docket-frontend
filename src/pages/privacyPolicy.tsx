import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Footer from '@/components/theme/common/Footer';

const Navbar = dynamic(() => import('@/components/theme/layout/Navbar'));

const PrivacyPolicy = () => {
  const {t} = useTranslation();
  return (
    <>
      <Navbar />
      <Head>
        <title>Privacy Policy</title>
        <link rel='icon' href='/assets/images/logo.png' />
      </Head>
      <div className='mt-24 flex flex-col'>
        <div className='pt-0 pb-12 flex flex-col bg-white'>
          <h1 className='mt-2 px-12 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl'>
            Privacy Policy
            {t('page:empty_string')}
          </h1>
          <div className='px-12'>
            <div className='text-sm font-normal text-gray-700 tracking-wide pt-2'>
              This privacy policy outlines the practices regarding the collection, usage, and
              protection of personal information on the WasteDocket.ie digital platform. It applies
              exclusively to information gathered through the platform and aims to inform users
              about:
            </div>
            <div className='text-xl font-bold text-gray-700 tracking-wide pt-2'>
              Information Collection, Use, and Sharing
            </div>
            <div className='text-sm font-normal text-gray-700 tracking-wide pt-2'>
              <ul className='list-disc pl-5'>
                <li>
                  We, the operators of WasteDocket.ie, are the sole proprietors of the information
                  obtained through this site. We only collect data that you willingly provide to us
                  via email, contact forms, or direct communication.
                </li>
                <li>
                  We will not sell or lease your information to any third party. Your data will be
                  used solely to respond to your inquiries or fulfill your requests.
                </li>
                <li>
                  Unless you request otherwise, we may contact you via email in the future to inform
                  you about promotions, new offerings, or modifications to this privacy policy.
                </li>
              </ul>
            </div>
            <div className='text-xl font-bold text-gray-700 tracking-wide pt-2'>
              Your Access to and Control Over Information
            </div>
            <div className='text-sm font-normal text-gray-700 tracking-wide pt-2'>
              <ul className='list-disc pl-5'>
                <li>
                  You have the right to opt-out of any future communications from us at any time.
                </li>
                <li>
                  You can inquire about the data we have stored about you, request corrections to
                  any inaccuracies, or ask us to delete your information entirely.
                </li>
                <li>
                  If you have any concerns about the handling of your data, you can express them to
                  us via the contact information provided on our website.
                </li>
              </ul>
            </div>
            <div className='text-xl font-bold text-gray-700 tracking-wide pt-2'>Security</div>
            <div className='text-sm font-normal text-gray-700 tracking-wide pt-2'>
              <ul className='list-disc pl-5'>
                <li>
                  We employ stringent measures to safeguard your information. When you submit
                  sensitive details through our website, they are protected both online and offline.
                </li>
                <li>
                  Any sensitive information, such as credit card data, is encrypted and securely
                  transmitted to us. You can verify this through the presence of a lock icon and
                  https in the address bar.
                </li>
                <li>
                  Access to personally identifiable information is restricted to employees who
                  require it to perform specific duties (e.g., billing or customer service). These
                  employees operate within a secure environment.
                </li>
              </ul>
            </div>
            <div className='text-xl font-bold text-gray-700 tracking-wide pt-2'>Updates</div>
            <div className='text-sm font-normal text-gray-700 tracking-wide pt-2'>
              <ul className='list-disc pl-5'>
                <li>
                  Our Privacy Policy may undergo periodic revisions, and any changes will be
                  promptly posted on this page.
                </li>
              </ul>
            </div>
            <div className='text-xl font-bold text-gray-700 tracking-wide pt-2'>
              Contact Information
            </div>
            <div className='text-sm font-normal text-gray-700 tracking-wide pt-2'>
              <ul className='list-disc pl-5'>
                <li>
                  If you believe that we are not adhering to this privacy policy, please contact us
                  immediately via email at privacy@wastedocket.ie.
                </li>
                <li>
                  We are committed to maintaining the privacy and security of your personal
                  information. Thank you for entrusting WasteDocket.ie with your data.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default PrivacyPolicy;
