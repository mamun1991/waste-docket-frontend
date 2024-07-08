import dynamic from 'next/dynamic';
import Image from 'next/image'; // Assuming you're using Next.js
import Hero from '@/components/PreLogin/Hero';
import Features from '@/components/theme/common/Features';
import Footer from '@/components/theme/common/Footer';
import PricingCards from '@/components/theme/common/PricingCards';
import HeadSeo from '@/components/shared/HeadSeo/Seo';

import whiteWave from '../../../public/assets/images/shapes/white-wave.svg';

const Navbar = dynamic(() => import('@/components/theme/layout/Navbar'));
const ScrollToTop = dynamic(() => import('@/components/theme/ScrollToTop'));

const SignInPage = () => {
  return (
    <>
      <HeadSeo
        canonicalUrl={'https://wastedocket.ie/auth/signup'}
        description=''
        ogTwitterImage={'https://wastedocket.ie/assets/og-image.jpg'}
        ogType={'website'}
        title={`WasteDocket`}
      />
      <Navbar />
      <div className='text-gray-800 h-screen'>
        <Hero />
      </div>

      <div className='text-gray-800 pt-24'>
        <Features />

        <section className='bg-gradient-to-r from-gray-100/70 to-gray-100 relative py-16 sm:py-24'>
          <div className='absolute top-0 inset-x-0 hidden sm:block'>
            <Image
              width={1905}
              height={150}
              src={whiteWave}
              alt='svg'
              className='w-full -scale-x-100'
            />
          </div>
          <div className='py-5'>
            <PricingCards />
          </div>
          <div className='absolute bottom-0 inset-x-0 hidden sm:block'>
            <Image
              width={1905}
              height={150}
              src={whiteWave}
              alt='svg'
              className='w-full scale-x-100 -scale-y-100'
            />
          </div>
        </section>

        <div className='py-12 w-full flex flex-col sm:flex-row'>
          <div className='hidden sm:flex sm:w-1/2 sm:flex-col items-center justify-center'>
            <img
              src='/assets/images/download_landing.png'
              alt='IOS App Store'
              className='object-contain'
              width='600'
            />
          </div>
          <div className='flex w-full sm:w-1/2 flex-col items-center justify-center'>
            <div className='px-12 pb-4 text-center'>
              <span className='text-2xl sm:text-3xl font-bold'>
                Use your android or ios device!
              </span>
            </div>
            <a
              href='https://apps.apple.com/in/app/wastedocket-ie/id6447186069'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='w-[200px] flex items-center justify-center'>
                <img
                  src='/assets/images/download_ios.png'
                  alt='IOS App Store'
                  className='w-full object-contain'
                />
              </div>
            </a>
            <a
              href='https://play.google.com/store/apps/details?id=ai.secomind.wastedocket&hl=en&gl=US'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='w-[230px] flex items-center justify-center'>
                <img
                  src='/assets/images/download_google.png'
                  alt='IOS App Store'
                  className='w-full object-contain'
                />
              </div>
            </a>
          </div>
        </div>

        <Footer />
      </div>
      <ScrollToTop />
    </>
  );
};

export default SignInPage;
