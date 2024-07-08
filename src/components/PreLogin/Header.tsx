import {useContext, useEffect, useState} from 'react';
import {Disclosure} from '@headlessui/react';
import {MenuIcon, XIcon} from '@heroicons/react/outline';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import classNames from 'classnames';
import {signOut, useSession} from 'next-auth/react';
import Link from 'next/link';
import queries from 'constants/GraphQL/User/queries';
import {UserContext} from 'store/UserContext/User.context';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Button from '../shared/Button';

const Header = () => {
  const {t} = useTranslation();
  const {data: session, status} = useSession();
  const router = useRouter();
  const [scrollActive, setScrollActive] = useState(false);
  const [userData, setUserData] = useState<any>([]);

  useEffect(() => {
    if (session) {
      const getUserData = async () => {
        const {data} = await graphqlRequestHandler(
          queries.getUserById,
          {token: session?.accessToken},
          session?.accessToken
        );
        setUserData(data);
      };
      getUserData();
    }
  }, [session]);

  const userAvatar = userData?.data?.getUserById?.userData?.accountDetails?.avatar;

  const {
    actions: {setAvatar},
  } = useContext(UserContext);

  useEffect(() => {
    setAvatar(userAvatar);
  }, [userAvatar]);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);

  const PAGES = {
    home: {name: t('page:Home'), pathname: '/'},
    privacy: {name: t('page:Privacy'), pathname: '/privacyPolicy/'},
    tos: {name: t('page:terms_of_service'), pathname: '/tos/'},
    contact: {name: t('common:Contact_Us'), pathname: '/contact-us/'},
  };

  const desktopLink = ({pathname, name}: (typeof PAGES)['home'], index: number) => (
    <Link href={pathname} key={index}>
      <a
        key={index}
        className={classNames(
          router.asPath === pathname
            ? 'border-mainBlue text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
        )}
      >
        {name}
      </a>
    </Link>
  );

  const mobileLink = ({pathname, name}: (typeof PAGES)['home'], index: number) => (
    <Link href={pathname} key={index}>
      <a
        key={index}
        className={classNames(
          router.asPath === pathname
            ? 'bg-indigo-50 border-mainBlue text-mainBlue block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
        )}
      >
        {name}
      </a>
    </Link>
  );

  return (
    <Disclosure
      as='nav'
      id='nav'
      className={`fixed top-0 w-full z-30 bg-mainWhite transition-all ${
        scrollActive ? ' shadow-md pt-2' : ' pt-0'
      }`}
    >
      {({open}) => (
        <>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8  w-full'>
            <div className='flex h-16 w-full'>
              <div className='flex flex-1 flex-row'>
                <div
                  className={classNames([
                    'flex-shrink-0 flex items-center',
                    router.asPath !== '/' && 'md:hidden',
                  ])}
                >
                  {router.asPath === '/' ? (
                    <Link href='/' passHref>
                      <Image
                        src={'/assets/images/logo.png'}
                        width={60}
                        height={60}
                        alt='logo'
                        className='hover:cursor-pointer'
                      />
                    </Link>
                  ) : (
                    <Image
                      onClick={() => router.back()}
                      src={'/assets/back-arrow.svg'}
                      width={30}
                      height={30}
                      alt='back'
                      className='hover:cursor-pointer md:hidden'
                    />
                  )}
                </div>
                <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                  {Object.values(PAGES).map(desktopLink)}
                </div>
                <div className='hidden sm:flex ml-auto gap-4 justify-center items-center w-1/4'>
                  {status === 'loading' || router.asPath !== '/' ? (
                    <div></div>
                  ) : session && status === 'authenticated' ? (
                    <Button
                      onClick={() => router.push(`/${router.locale}/user/dashboard`)}
                      variant='Black'
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => router.push(`/${router.locale}/auth/signin`)} out>
                        {t('common:Sign_In')}
                      </Button>
                      <Button onClick={() => router.push(`/${router.locale}/auth/signup`)}>
                        {t('common:Sign_Up')}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className='-mr-2 flex items-center sm:hidden'>
                <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mainBlue'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className='sm:hidden'>
            <div className='pt-2 pb-3 space-y-1'>{Object.values(PAGES).map(mobileLink)}</div>

            {session ? (
              <div className='pt-4 pb-3 border-t border-gray-200'>
                <div className='mt-3 space-y-1'>
                  <Disclosure.Button
                    as='a'
                    href='/user/myinfo'
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  >
                    {t('common:view_profile')}
                  </Disclosure.Button>
                  <a
                    onClick={() => signOut({callbackUrl: '/'})}
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer'
                  >
                    {t('profile:sign_out')}
                  </a>
                </div>
              </div>
            ) : (
              <></>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
export default Header;
