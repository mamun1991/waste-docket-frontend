import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Footer from '@/components/theme/common/Footer';
import HeadSeo from '@/components/shared/HeadSeo/Seo';

const Navbar = dynamic(() => import('@/components/theme/layout/Navbar'));

const NotFound = () => {
  const {t} = useTranslation();
  return (
    <>
      <HeadSeo
        canonicalUrl={'https://wastedocket.ie/about/'}
        description=''
        ogTwitterImage={'https://wastedocket.ie/assets/og-image.jpg'}
        ogType={'website'}
        title={`About | WasteDocket`}
      />
      <Navbar />
      <Head>
        <title>About</title>
        <link rel='icon' href='/assets/images/logo.png' />
      </Head>
      <div className='mt-24 flex flex-col'>
        <div className='pt-0 pb-12 flex flex-col bg-white'>
          <h1 className='mt-2 px-12 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-4xl'>
            About
            {t('page:empty_string')}
          </h1>
          <div className='px-12 py-4'>
            <div className='text-left'>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                In essence, Wastedocket.ie is a Waste Collection Management System that can be
                managed from your phone. Our app is built to move companies towards a more efficient
                waste collection management system. It will help companies in their commitment to a
                sustainable future by removing inefficiencies such as paper. In its simplest form,
                it enables digital transformation and removes the requirement for a docket book. It
                reduces costs, digitises the back office requirements and summarises annual
                reporting requirements in cloud based systems removing barriers to entry associated
                with other solutions.
              </p>
              <h1 className='mt-2 text-sm font-bold text-gray-900 tracking-tight sm:text-2xl'>
                Background Information
              </h1>
              <p className='text-sm font-normal text-gray-700 tracking-wide'>
                Wastedocket.ie is a Waste Collection Management System that is cloud based. It is
                easy to use for the waste collector and their drivers. It is a digital platform
                designed to replace traditional paper dockets in the waste management industry. It
                enables drivers to create, manage, and submit dockets electronically, while
                providing fleet owners with tools for real-time tracking, analytics, and centralized
                docket management.
              </p>
              <p className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                It is offered as a platform/ app (Apple/Google) and integrates to PC backend.
              </p>
              <p className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                By eliminating the need for paper dockets, Wastedocket reduces waste and
                deforestation, contributing to a more sustainable environment. Additionally, its
                route optimization feature helps in lowering fuel consumption and carbon emissions.
              </p>
              <p className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                Businesses can easily enroll in Wastedocket through our online platform. The process
                involves signing up your business, choosing your subscription plan, and setting up
                your account. Once enrolled, you can start adding your fleet and drivers
                immediately. Businesses get a full report on all the activities and registered users
                in the group.
              </p>
              <p className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                Wastedocket allows you to add and manage multiple drivers under your business
                account. You can view dockets, track their progress, and manage their activities all
                from one centralized dashboard.
              </p>
              <p className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                Wastedocket provides real-time tracking and performance analytics for each driver,
                allowing you to monitor routes, completion times, and efficiency. This transparency
                fosters accountability and helps in identifying areas for performance improvement.
              </p>
              <p className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                We offer comprehensive training resources, including video tutorials, user guides,
                and live support to ensure that drivers are comfortable and proficient in using
                Wastedocket. Our aim is to make the transition to digital as smooth as possible for
                everyone involved.
              </p>
              <p className='pt-2 text-sm font-normal text-gray-700 tracking-wide'>
                Data security is a top priority at Wastedocket. We use advanced encryption and
                security protocols to protect all information on our platform. Your business and
                driver data are secure with us, ensuring privacy and compliance with data protection
                regulations.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default NotFound;
