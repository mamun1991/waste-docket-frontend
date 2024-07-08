import {useContext} from 'react';
import {useRouter} from 'next/router';
import classNames from 'classnames';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {UserContext} from '@/context/user';
import NavLink from '@/components/topbar/nav-link';
import Branding from '@/components/topbar/branding';
import {ACCOUNT_TYPES} from '@/constants/enums';
import {userRoutes, adminRoutes, businessRoutes} from '@/routes/index';
import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import {useSession} from 'next-auth/react';

type Props = {
  isMobile?: boolean;
  setClosed?: any;
  setCollapsed?: any;
  collapsed: boolean;
};

const Sidebar = ({isMobile, setClosed, collapsed, setCollapsed}: Props) => {
  const {t} = useTranslation();
  const {pathname} = useRouter();
  const {data: session} = useSession();
  const {user: userData} = useContext(UserContext);
  const {showModal} = ModalContextProvider();
  const doSkipQuery = userData?.selectedFleet ? true : false;
  const {data: GetFleets} = useQuery(queries.GetFleets, {
    variables: {
      fleetsInput: {
        searchText: '',
      },
    },
    skip: doSkipQuery || !userData?.personalDetails?.email,
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
  });

  return (
    <div
      className={classNames(
        isMobile ? 'sm:min-w-[100%] sm:w-[100%]' : 'sm:w-0',
        'flex-col justify-between absolute transition-width duration-300 easy z-20',
        isMobile
          ? 'block relative overflow-y-scroll overflow-x-hidden min-h-screen h-full'
          : 'hidden xl:flex'
      )}
    >
      <div className='z-10 block bg-white border-r border-gray-300 md:flex md:flex-col md:flex-grow border-opacity-70 xl:h-20 xl:flex-row xl:flex-grow-0 xl:fixed xl:top-0 xl:left-0 xl:w-screen xl:border-b xl:px-5'>
        <Branding collapsed={collapsed} setCollapsed={setCollapsed} setClosed={setClosed} />
        <nav className='flex flex-col flex-grow pb-4 mt-2 bg-white xl:flex-row'>
          {userData?.accountType === ACCOUNT_TYPES.ADMIN
            ? adminRoutes &&
              adminRoutes.map((route, index) => (
                <NavLink
                  key={index}
                  name={route.name}
                  href={
                    route.href === '/pricing'
                      ? `/pricing?mode=${
                          userData?.subscription?.stripeSubscriptionId ? 'upgrade' : 'new'
                        }`
                      : route.href
                  }
                  icon={route.icon}
                  pathname={pathname}
                  setCollapsed={setCollapsed}
                  collapsed={collapsed}
                  route={route}
                />
              ))
            : (userData?.selectedFleet?.ownerEmail &&
                userData?.selectedFleet?.ownerEmail === userData?.personalDetails?.email) ||
              (GetFleets?.getFleets?.fleetData?.length > 0 &&
                GetFleets?.getFleets?.fleetData?.find(
                  fleet => fleet?._id === GetFleets?.getFleets?.selectedFleet
                )?.ownerEmail === userData?.personalDetails?.email)
            ? businessRoutes &&
              businessRoutes.map((route, index) => (
                <NavLink
                  key={index}
                  name={route.name}
                  href={
                    route.href === '/pricing'
                      ? `/pricing?mode=${
                          userData?.subscription?.stripeSubscriptionId ? 'upgrade' : 'new'
                        }`
                      : route.href
                  }
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
        <span
          className={classNames(
            'text-gray-500 hover:bg-gray-50 hover:text-gray-900 flex items-center py-0 pr-3 pl-5 text-sm font-medium rounded-lg cursor-pointer text-left',

            collapsed && '!mb-6'
          )}
        >
          {!collapsed && (
            <span
              className={classNames(
                'flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy text-red-600'
              )}
              onClick={() => {
                showModal(MODAL_TYPES.SIGN_OUT);
              }}
            >
              {t(`profile:sign_out`)}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
