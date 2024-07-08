import Head from 'next/head';
import Topbar from '@/components/topbar';
import AuthRoute from '@/helpers/auth-route';
import classNames from 'classnames';
import {useContext, useEffect, useState} from 'react';
import {UserContext} from '@/components/context/user';
import {useRouter} from 'next/router';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostLoginLayout = ({children, fullWidth = false}) => {
  const {push} = useRouter();
  const [collapsed, setCollapsed] = useState(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('collapsed')!) : false
  );
  const {user} = useContext(UserContext);

  useEffect(() => {
    localStorage.setItem('collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (user) {
      if (!user?.welcomeComplete) {
        push('/user/welcome');
      }
    }
  }, [user]);
  return (
    <AuthRoute>
      <Head>
        <link rel='icon' href='/assets/images/favicon.png' />
      </Head>
      <Topbar setCollapsed={setCollapsed} collapsed={collapsed} />
      <div
        className={classNames(
          'min-h-screen flex flex-col h-full transition-width duration-300 ease-in-out',
          collapsed ? 'xl:pl-24' : 'xl:pl-0 '
        )}
      >
        <main className='h-full'>
          <div className='pb-6 h-full'>
            <div
              className={
                fullWidth
                  ? `max-w-full h-full  px-4 sm:px-6 md:px-8 transition-width duration-300 ease-in-out pb-6`
                  : `max-w-7xl h-full mx-auto px-4 sm:px-6 md:px-8 transition-width duration-300 ease-in-out pb-6`
              }
            >
              {children}
            </div>
          </div>
          <ToastContainer
            position='top-center'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>
      </div>
    </AuthRoute>
  );
};

export default PostLoginLayout;
