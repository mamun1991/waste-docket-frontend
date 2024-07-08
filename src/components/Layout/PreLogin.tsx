// import Footer from 'components/PreLogin/Footer';
import Head from 'next/head';
import {PropsWithChildren} from 'react';
import Header from '../PreLogin/Header';

type IProps = {
  title?: string;
};

const PreLoginLayout = ({children, title}: PropsWithChildren<IProps>) => (
  <div className='flex flex-col justify-between h-screen bg-mainWhite'>
    <Head>
      <link rel='icon' href='/assets/images/logo.png' />
      <title>{title}</title>
    </Head>
    <Header />
    <main className='mt-20 h-full bg-mainWhite'>{children}</main>
    {/* <Footer /> */}
  </div>
);

PreLoginLayout.auth = true;

export default PreLoginLayout;
