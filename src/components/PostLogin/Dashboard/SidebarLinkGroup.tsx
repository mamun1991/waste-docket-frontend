import React, {useState, Fragment, useEffect} from 'react';
import {Transition} from '@headlessui/react';
import Link from 'next/link';
import classNames from 'classnames';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {ChevronDownIcon} from '@heroicons/react/outline';

type IProps = {
  route: any;
  isMobile: any;
  isCollapse: any;
  setCollapsed?: any;
};

const SidebarSubmenu = ({route, isMobile, isCollapse, setCollapsed}: IProps) => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const {t} = useTranslation();

  const {pathname} = useRouter();

  const handleDropdownMenuClick = () => {
    setIsDropdownMenuOpen(!isDropdownMenuOpen);
    setCollapsed && setCollapsed(false);
  };

  useEffect(() => {
    if (isCollapse && isDropdownMenuOpen) {
      setIsDropdownMenuOpen(false);
    }
  }, [isCollapse]);

  return (
    <>
      <span
        key={route.name}
        onClick={handleDropdownMenuClick}
        className={classNames(
          route.href === pathname
            ? 'bg-[#eef3fb] text-mainBlue'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          'flex items-center py-2 pr-3 pl-5 text-base rounded-lg cursor-pointer text-left'
        )}
      >
        <route.icon
          className={classNames(
            route.href === pathname
              ? 'bg-[#eef3fb] text-mainBlue'
              : 'text-gray-400 group-hover:text-gray-400',
            'mr-4 flex flex-shrink-0 items-start justify-center w-6 h-6'
          )}
          aria-hidden='true'
        />
        <span className='flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'>
          {isMobile ? t(`page:${route.name}`) : !isCollapse ? t(`page:${route.name}`) : ''}{' '}
        </span>
        <ChevronDownIcon
          className={`w-4 mr-2 h-4 text-gray-500 mt-1 ${
            isDropdownMenuOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </span>
      <Transition
        as={Fragment}
        show={isDropdownMenuOpen}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <ul
          className={classNames(
            'space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-lg py-3',
            isDropdownMenuOpen && 'bg-gray-50'
          )}
          aria-label='submenu'
        >
          {route?.children?.map(item => (
            <Link key={item.name} href={item.href} passHref>
              <span
                key={item.name}
                className={classNames(
                  item.href === pathname
                    ? 'bg-[#eef3fb] text-mainBlue'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'flex items-center py-2 pr-3 pl-5 text-sm font-medium rounded-lg cursor-pointer text-left'
                )}
              >
                <item.icon
                  className={classNames(
                    item.href === pathname
                      ? 'bg-[#eef3fb] text-mainBlue'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-4 flex flex-shrink-0 items-start justify-center w-6 h-6'
                  )}
                  aria-hidden='true'
                />

                <span className='flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'>
                  {isMobile ? t(`page:${item.name}`) : !isCollapse ? t(`page:${item.name}`) : ''}
                </span>
              </span>
            </Link>
          ))}
        </ul>
      </Transition>
    </>
  );
};

export default SidebarSubmenu;
