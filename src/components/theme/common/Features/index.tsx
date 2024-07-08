import dynamic from 'next/dynamic';
import Image from 'next/image';
import sass4 from '../../../../../public/assets/images/hero/saas4.jpg';
import sass5 from '../../../../../public/assets/images/hero/saas5.jpg';

const FeaturesAccordions = dynamic(() => import('./FeaturesAccordions'));

const Features = () => {
  return (
    <section className='overflow-hidden'>
      <div className='xl:py-24 py-16'>
        <div className='container'>
          <div className='text-center'>
            <span className='text-3xl font-bold py-1 px-3 rounded-full text-primary bg-primary/10'>
              Features
            </span>
            <h1 className='text-xl font-medium mt-3 mb-4'>Streamline. Sustain. Succeed.</h1>
          </div>

          <div className='xl:pt-16 xl:pb-28 py-16'>
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-6 items-center'>
              <div className='relative'>
                <div className='hidden sm:block'>
                  <div className="after:w-20 after:h-20 after:absolute after:-top-8 after:-start-8 2xl:after:end-0 after:bg-[url('/assets/images/pattern/dot5.svg')]"></div>
                  <div className="before:w-20 before:h-20 before:absolute before:-bottom-8 before:-end-8 before:bg-[url('/assets/images/pattern/dot2.svg')]"></div>
                </div>
                <Image src={sass4} alt='saas4' data-aos='fade-right' data-aos-duration='400' />
              </div>

              <FeaturesAccordions />
            </div>
          </div>

          <div>
            <div className='grid lg:grid-cols-2 grid-cols-1n gap-6 items-center'>
              <div
                className='order-2 lg:order-1 2xl:w-9/12'
                data-aos='fade-up'
                data-aos-duration='500'
              >
                <h1 className='text-2xl font-bold mt-6 mb-4'>
                  Revolutionizing Waste Management, One Docket at a Time
                </h1>
                <p className='text-gray-500'>
                  Wastedocket redefines waste management by transitioning from paper to digital
                  dockets. Our platform boosts efficiency, ensures compliance, and promotes
                  eco-friendly practices. With streamlined operations and reduced environmental
                  impact, Wastedocket is your partner in sustainable success.
                </p>
              </div>

              <div className='relative order-1 lg:order-2'>
                <div className='hidden sm:block'>
                  <div className="after:w-20 after:h-20 after:absolute after:-top-8 after:-end-8 2xl:after:-end-8 after:bg-[url('/assets/images/pattern/dot2.svg')]"></div>
                  <div className="before:w-20 before:h-20 before:absolute before:-bottom-8 before:-start-8 before:bg-[url('/assets/images/pattern/dot5.svg')]"></div>
                </div>

                <Image src={sass5} alt='saas5' data-aos='fade-left' data-aos-duration='400' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
