import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Footer from '@/components/theme/common/Footer';

const Navbar = dynamic(() => import('@/components/theme/layout/Navbar'));

const NotFound = () => {
  const {t} = useTranslation();
  return (
    <>
      <Navbar />
      <Head>
        <title>Terms of Service</title>
        <link rel='icon' href='/assets/images/logo.png' />
      </Head>
      <div className='mt-24 flex flex-col'>
        <div className='pt-0 pb-12 flex flex-col bg-white'>
          <h1 className='mt-2 px-12 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-4xl'>
            Terms of Service
            {t('page:empty_string')}
          </h1>
          <div className='px-12 py-4'>
            <div className='text-left'>
              <div className='text-sm font-normal text-gray-700 tracking-wide'>
                Thank you for choosing Wastedocket.ie (referred to as the ‘Platform‘). Before
                accessing or using the Platform, please carefully read the following Terms and
                Conditions (‘Terms‘). Your use of the Platform constitutes your agreement to be
                bound by these Terms.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                1. Use of the Platform
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                1.1 Purpose: Wastedocket.ie has a mission to fundamentally change how the waste
                management industry records, accounts and optimises through the use of an
                intelligent software platform and technology. WasteDocket.ie is a digital offer
                designed to make waste tracking easier and more efficient for waste producers,
                carriers, brokers, dealers, waste site operators, local authorities, and regulators
                throughout Ireland.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                In essence, Wastedocket.ie is a Waste Collection Management System that can be
                managed from your phone. Our platform is built to move companies towards a more
                efficient waste collection management system. It will help companies in their
                commitment to a sustainable future by removing inefficiencies such as paper. In its
                simplest form, it enables digital transformation and removes the requirement for a
                docket book. It reduces costs, digitises the back office requirements and summarises
                annual reporting requirements in cloud based systems removing barriers to entry
                associated with other solutions.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                1.2 Subscription Fee: By utilizing the Platform, you agree to pay the monthly
                subscription fee per month (fee determined by plan option chosen). The subscription
                fee grants you access to all features and functionalities of the Platform during the
                subscription period.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                1.3 Data Storage: You acknowledge and agree that all data entered into the Platform,
                including waste collection records and user information, will be securely stored and
                maintained for the duration of the Platforms availability, ensuring data integrity
                and confidentiality. WasteDocket.ie accept no liability for third party data
                management issues.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>2. Refunds</div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                2.1 Refund Policy: We do not provide refunds for the use of the Platform, except
                where required by applicable law. If you encounter any dissatisfaction with the
                Platform or experience technical issues, please reach out to our customer support
                team at support@wastedocket.ie for assistance and resolution.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                3. Promotion
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                3.1 Limited Time Offer: For a limited time, we are pleased to offer a complimentary
                1-month trial of the Platform to all users who register before December 31, 2024.
                During the trial period, you will have full access to the Platforms features and
                functionalities without the need for credit card information.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                3.2 Trial Expiration: If you choose not to subscribe to the paid service before the
                trial concludes, access to the Platforms features will be restricted, and all data
                entered during the trial period will be permanently deleted unless a paid
                subscription is initiated.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                4. Auto Renewal
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                4.1 Subscription Renewal: The monthly subscription fee (amount determined by plan
                option) will be automatically renewed at the end of each billing cycle, ensuring
                uninterrupted access to the Platforms features and services.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                4.2 Cancellation: You have the option to cancel the auto-renewal of your
                subscription at any time by contacting our customer support team at
                support@wastedocket.ie. Upon cancellation, your subscription will remain active
                until the end of the current billing cycle.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                5. Privacy Policy
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                5.1 Data Protection: We are committed to protecting your privacy and personal
                information. Please review our Privacy Policy available at
                https://wastedocket.ie/privacyPolicy for detailed information regarding the
                collection, usage, and disclosure of your personal data.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                6. Changes to Terms and Conditions
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                6.1 Notification: We reserve the right to modify these Terms at our discretion and
                at any time. In the event of material changes to these Terms, we will notify you via
                email or by posting a notice on the Platform.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                6.2 Acceptance: Your continued use of the Platform after the effective date of the
                revised Terms constitutes your acceptance of the updated terms and conditions.
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                7. Contact Us
              </div>
              <div className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                Should you have any inquiries, feedback, or concerns regarding these Terms or the
                use of the Platform, please do not hesitate to reach out to our customer support
                team at support@wastedocket.ie. Thank you for choosing Wastedocket.ie
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default NotFound;
