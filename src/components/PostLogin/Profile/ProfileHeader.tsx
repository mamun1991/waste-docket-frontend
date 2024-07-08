import {ChevronRightIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

const ProfileHeader = () => {
  const {t} = useTranslation();

  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {t('page:Home')}
                    </a>
                  </Link>
                </div>
              </li>
              <li>
                <div className='flex items-center'>
                  <ChevronRightIcon
                    className='flex-shrink-0 h-5 w-5 text-gray-500'
                    aria-hidden='true'
                  />
                  <a
                    href='#'
                    className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'
                  >
                    {t('common:txt_Profile')}
                  </a>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
            Your {t('common:txt_Profile')}
          </h2>
        </div>
      </div>
      <div className='shadow-lg rounded-xl'>
        <div className='h-32 w-full object-cover lg:h-48 rounded-t-xl'>Some Text</div>
        <div className='max-w-5xl mt-4 mx-auto px-4 sm:px-6 lg:px-8 '></div>
      </div>
    </>
  );
};

export default ProfileHeader;
