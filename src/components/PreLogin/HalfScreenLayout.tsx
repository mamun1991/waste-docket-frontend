import React from 'react';
import Image from 'next/image';
import PreLoginFooter from '@/components/shared/PreLoginFooter';

const HalfScreenLayout = ({children}) => (
  <div className='flex align-center  flex-wrap h-screen'>
    <div className='w-1/2 bg-right bg-center bg-[url("/assets/images/bg_mobile.jpg")] sm:bg-[url("/assets/images/bg.jpg")] h-screen hidden lg:flex bg-cover'>
      <div className='max-w-xs flex items-center align-center  block m-auto h-full'></div>
    </div>
    <div className='flex items-center justify-center align-center h-screen w-screen lg:w-fit'>
      <div className='w-full sm:w-[500px] flex justify-center items-center align-center flex-col h-full pl-4 pr-4'>
        <div className='max-w-md float-left'>
          <Image
            src='/assets/images/logo.png'
            alt='hero'
            height={131}
            width={224}
            className='m-auto'
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
    <PreLoginFooter />
  </div>
);

export default HalfScreenLayout;
