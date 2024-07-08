/* eslint-disable react-hooks/rules-of-hooks */
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';

import queries from 'constants/GraphQL/User/queries';

type User = {
  accountType: string;
  username: string;
  welcomeComplete: boolean;
  timezone: string;
  email: string;
  workingHours: any;
  escrowAccount: boolean;
  directAccount: boolean;
  allowedConferenceTypes: Array<string>;
};

export const UserContext = createContext<{
  user: User | undefined;
  setUser: (u: User) => void;
}>({
  user: undefined,

  setUser: () => {},
});

const UserCtxProvider = ({children}: PropsWithChildren<unknown>) => {
  //

  const [user, setUser] = useState<User | undefined>(undefined);

  const {data: session} = useSession();

  const {data: userData} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  useEffect(() => {
    if (userData) {
      setUser({
        ...user,
        accountType: userData.getUserById.userData.accountDetails.accountType,
        welcomeComplete: userData.getUserById.userData.welcomeComplete,
        username: userData.getUserById.userData.accountDetails.username,
        timezone: userData.getUserById.userData.locationDetails?.timezone,
        email: userData.getUserById.userData.accountDetails.email,
        workingHours: userData.getUserById.userData.workingHours,
        allowedConferenceTypes: userData.getUserById.userData.accountDetails.allowedConferenceTypes,
        escrowAccount:
          userData.getUserById.userData.accountDetails.paymentAccounts.escrow.length > 0
            ? true
            : false,
        directAccount:
          userData.getUserById.userData.accountDetails.paymentAccounts.direct.length > 0
            ? true
            : false,
      });
    }
  }, [userData]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserCtxProvider;
