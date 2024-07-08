import {useContext} from 'react';
import {useRouter} from 'next/router';
import classNames from 'classnames';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {UserContext} from '@/components/context/user';
import NavLink from '@/components/topbar/nav-link';
import Branding from '@/components/topbar/branding';
import {ACCOUNT_TYPES} from '@/constants/enums';
import {userRoutes, adminRoutes} from '@/routes/index';
import ChangeLanguage from 'components/shared/LanguageSwitcher/LanguageSwitcherSidebar';
import {ArrowCircleRightIcon} from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  isMobile?: boolean;
  setClosed?: any;
  setCollapsed?: any;
  collapsed: boolean;
};

const Sidebar = ({isMobile, setClosed, collapsed, setCollapsed}: Props) => {
  const {t} = useTranslation();
  const {pathname} = useRouter();
  const {user: userData} = useContext(UserContext);
  const {showModal} = ModalContextProvider();
  return (
    <div
      className={classNames(
        collapsed ? 'w-24' : 'w-0',
        'flex-col justify-between fixed inset-y-0 transition-width duration-300 easy z-50 bg-white',
        isMobile ? 'flex' : 'hidden xl:flex'
      )}
    >
      <div className='flex flex-col flex-grow overflow-hidden justify-between border-r border-gray-300 border-opacity-70 bg-white overflow-y-auto bg-opacity-80'>
        <Branding collapsed={collapsed} setCollapsed={setCollapsed} setClosed={setClosed} />
        <nav className='flex flex-col flex-1 flex-grow px-4 pb-4 space-y-2 mt-2 bg-white'>
          {userData?.accountType === ACCOUNT_TYPES.ADMIN
            ? adminRoutes &&
              adminRoutes.map((route, index) => (
                <NavLink
                  key={index}
                  name={route.name}
                  href={route.href}
                  icon={route.icon}
                  pathname={pathname}
                  setCollapsed={setCollapsed}
                  collapsed={collapsed}
                  route={route}
                />
              ))
            : userRoutes &&
              userRoutes.map((route, index) => (
                <NavLink
                  key={index}
                  name={route.name}
                  href={route.href}
                  icon={route.icon}
                  pathname={pathname}
                  setCollapsed={setCollapsed}
                  collapsed={collapsed}
                  route={route}
                />
              ))}
        </nav>
        <ChangeLanguage />
        <span
          className={classNames(
            'text-gray-600 mb-4 hover:bg-gray-50 hover:text-gray-900 flex items-center py-2 pr-3 pl-9 rounded-lg cursor-pointer text-left',

            collapsed && '!mb-6'
          )}
        >
          <ArrowCircleRightIcon
            className={
              'text-gray-400 group-hover:text-gray-500 mr-4 flex flex-shrink-0 items-start justify-center w-6 h-6'
            }
            aria-hidden='true'
          />
          {!collapsed && (
            <span
              className={classNames(
                'flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'
              )}
              onClick={() => {
                showModal(MODAL_TYPES.SIGN_OUT);
              }}
            >
              {t(`profile:sign_out`)}
              <p className='text-xs text-gray-600 truncate'>{userData?.email}</p>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
