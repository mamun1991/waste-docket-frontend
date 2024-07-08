import Image from 'next/image';
import Link from 'next/link';
import {footerLinks} from './data';

import logoDark from '../../../../public/assets/images/logo-dark.png';

const Footer = () => (
  <footer className='bg-gray-100'>
    <div className='container'>
      <div className='flex flex-col sm:flex-row items-start justify-between gap-6 py-12'>
        <div className='w-full sm:w-1/3'>
          <Link href='/'>
            <Image width={126} height={32} alt='logoDark' src={logoDark} className='h-8' />
          </Link>
          <p className='text-gray-500/80 mt-5 lg:w-4/5'>
            Maximize Efficiency with Digital Dockets Tailored for Modern Fleets
          </p>
        </div>
        <div className='w-full sm:w-2/3'>
          <div className='flex flex-col sm:flex-row gap-6 flex-wrap justify-end'>
            {Object.keys(footerLinks).map(title => {
              return (
                <div className='flex flex-col gap-3' key={title}>
                  <h5 className='mb-3 uppercase'>{title}</h5>
                  {footerLinks[title].links.map((link, idx) => {
                    return (
                      <div className='text-gray-500/80' key={idx}>
                        {/* Use the url for the href attribute */}
                        <Link href={link.url}>{link.text}</Link>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className='border-t py-6'>
        <div className='flex flex-col sm:flex-row justify-between text-center sm:text-start gap-6'>
          <div>
            <p className='text-gray-500/80 text-sm'>
              {new Date().getFullYear()}© Wastedocket.ie. All rights reserved.
            </p>
          </div>
          <div className='flex justify-center sm:justify-end gap-7'>
            <div>
              <Link href='https://www.linkedin.com/company/wastedocket-ie/'>
                <svg
                  className='w-5 h-5 text-gray-500 hover:text-primary transition-all'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
                  <rect x='2' y='9' width='4' height='12'></rect>
                  <circle cx='4' cy='4' r='2'></circle>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
