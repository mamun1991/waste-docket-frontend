import {Fragment, useState} from 'react';
import {MenuIcon} from '@heroicons/react/outline';
import classNames from 'classnames';
import {Transition} from '@headlessui/react';
import Topbar from '../topbar';

type Props = {
  heading: string;
  StartChat?: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
};
const Header = ({heading}: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <div className='flex rounded-b-md bg-white justify-between items-center'>
        <div className='flex flex-col items-end '>
          <nav className='flex w-full pt-4' aria-label='Breadcrumb'></nav>
          <div className='flex w-full justify-between pb-4 items-center'>
            <h2 className='text-xl font-bold text-primary sm:text-2xl truncate'>{heading}</h2>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className='w-10 h-10 flex xl:hidden justify-center items-center bg-gray-200 bg-opacity-50 rounded-md'
        >
          <MenuIcon className='w-6 h-6' />
        </button>
      </div>
      <Transition
        show={!collapsed}
        as={Fragment}
        enter='transition ease-out duration-150'
        enterFrom='opacity-0'
        enterTo='opacity-75'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-75'
        leaveTo='opacity-0'
      >
        <div
          className={classNames(
            'bg-black -left-0 top-0 left-0 right-0 xl:hidden bottom-0 z-40 min-h-screen fixed'
          )}
        ></div>
      </Transition>
      <Transition
        show={!collapsed}
        as={Fragment}
        enter='duration-300'
        enterFrom='fixed -left-72'
        enterTo='fixed -left-0'
        leave='duration-300'
        leaveFrom='fixed -left-0'
        leaveTo='fixed -left-72'
      >
        <div
          className={classNames(
            'block left-0 top-0 bottom-0 w-72 z-50 xl:hidden bg-white h-screen overflow-hidden'
          )}
        >
          <Topbar isMobile collapsed={false} setClosed={setCollapsed} />
        </div>
      </Transition>
    </>
  );
};
export default Header;
