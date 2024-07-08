import {AppProps} from 'next/app';
import type {NextPage} from 'next';
import React, {PropsWithChildren, ReactElement, ReactNode} from 'react';
import Loader from 'components/shared/Loader/Loader';
import Notification from 'components/shared/Notification/Notification';
import {SessionProvider, useSession} from 'next-auth/react';
import {ApolloProvider} from '@apollo/client';
import StoreContextProviders from 'store/contexts';
import {TabsContextProvider} from 'store/Tabs/Tabs.context';
import {UserContextProvider} from 'store/UserContext/User.context';
import {ModalProvider} from 'store/Modal/Modal.context';
import {NotificationContextProvider} from 'store/Notification/Notification.context';
import UserCtxProvider from '@/context/user';
import LiveCtxProvider from '@/context/live';
import GDPRConsent from '@/components/shared/GDPRConsent';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import client from '../lib/apollo-client';

import 'styles/globals.css';

const Key =
  process.env.NEXT_PUBLIC_STRIPE_MODE === 'test'
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PRODUCTION_PUBLISHABLE_KEY;

console.log(
  process.env.NEXT_PUBLIC_STRIPE_MODE,
  process.env.NEXT_PUBLIC_STRIPE_MODE === 'test'
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PRODUCTION_PUBLISHABLE_KEY
);

const stripePromise = loadStripe(Key as string);

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  auth: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const Auth = ({children}: PropsWithChildren<unknown>) => {
  const {data: session} = useSession({
    required: true,
  });
  const isUser = !!session?.user;

  if (isUser) {
    return <>{children}</>;
  }
  return <Loader />;
};

const MyApp = ({Component, pageProps}: AppPropsWithLayout) => (
  <>
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={client}>
        <Elements stripe={stripePromise}>
          {Component.auth ? (
            <StoreContextProviders
              contextProvider={[
                NotificationContextProvider,
                ModalProvider,
                UserCtxProvider,
                TabsContextProvider,
                UserContextProvider,
                LiveCtxProvider,
              ]}
            >
              <Auth>
                <Notification />
                <Component {...pageProps} />
              </Auth>
            </StoreContextProviders>
          ) : (
            <>
              <StoreContextProviders
                contextProvider={[
                  NotificationContextProvider,
                  UserContextProvider,
                  ModalProvider,
                  UserCtxProvider,
                  LiveCtxProvider,
                ]}
              >
                <Notification />
                <Component {...pageProps} />
              </StoreContextProviders>
            </>
          )}
        </Elements>
      </ApolloProvider>
      <GDPRConsent />
    </SessionProvider>
  </>
);

export default MyApp;
