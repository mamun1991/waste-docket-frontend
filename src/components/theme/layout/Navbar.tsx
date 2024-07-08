'use client';

import {useEffect, useRef} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {getHorizontalMenuItems, getMenuItems} from '@/helpers/menu';
import {OffcanvasLayout} from '@/components/theme';
import {useToggle} from '@/hooks';
import {FaBars, FaXmark} from 'react-icons/fa6';
import AppMenu from './Menu';
import VerticalMenu from './VerticalMenu';

import logoDark from '../../../../public/assets/images/logo-dark.png';

const Navbar = () => {
  const [isOpenOffcanvas, toggleOffcanvas, _openOffcanvas, closeOffcanvas] = useToggle();

  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('scroll', e => {
      e.preventDefault();
      if (navbarRef.current) {
        if (window.scrollY >= 80)
          navbarRef.current.classList.add('bg-white', 'shadow', 'lg:bg-white');
        else navbarRef.current.classList.remove('bg-white', 'shadow', 'lg:bg-white');
      }
    });
  }, []);

  return (
    <>
      <header
        id='navbar'
        ref={navbarRef}
        className='fixed top-0 inset-x-0 flex items-center z-40 w-full lg:bg-gray-50 bg-white transition-all py-5'
      >
        <div className='container'>
          <nav className='w-full flex items-center justify-between'>
            <Link href='/'>
              <Image src={logoDark} className='h-12' style={{width: 'auto'}} alt='Logo' />
            </Link>
            <div className='flex'>
              <div className='lg:block hidden ms-auto'>
                <AppMenu menuItems={getHorizontalMenuItems()} />
              </div>
              <div className='lg:hidden flex items-center ms-auto px-2.5'>
                <button type='button' onClick={toggleOffcanvas}>
                  <FaBars size={24} />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <OffcanvasLayout
        placement='end'
        sizeClassName='w-[447px] bg-white border-s'
        open={isOpenOffcanvas}
        toggleOffcanvas={closeOffcanvas}
      >
        <div className='flex flex-col h-[100vh] divide-y-2 divide-gray-200'>
          {/* Mobile Menu Topbar Logo (Header) */}
          <div className='p-6 flex items-center justify-between'>
            <Link href='/'>
              <Image src={logoDark} width={126} className='h-8' alt='Logo' />
            </Link>
            <button className='flex items-center px-2' onClick={closeOffcanvas}>
              <FaXmark size={20} />
            </button>
          </div>
          {/* Mobile Menu Link List */}
          <div className='p-6 overflow-scroll h-full' id='right-menu'>
            <VerticalMenu menuItems={getMenuItems()} />
          </div>
        </div>
      </OffcanvasLayout>
    </>
  );
};

export default Navbar;
