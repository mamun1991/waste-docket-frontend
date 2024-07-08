/* eslint-disable react-hooks/rules-of-hooks */
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {createContext, PropsWithChildren, useState} from 'react';
import queries from 'constants/GraphQL/User/queries';
import {User} from '@/types/user';

const emptyUserObject = {
  accountType: '',
  operatorId: '',
  personalDetails: {
    email: '',
    phone: '',
    name: '',
    description: '',
  },
  fleets: {
    _id: '',
    isIndividual: false,
    name: '',
    VAT: '',
    permitHolderName: '',
    permitNumber: '',
    permitHolderAddress: '',
    termsAndConditions: '',
    permitHolderContactDetails: '',
    permitHolderEmail: '',
    permitHolderLogo: '',
    prefix: '',
    ownerEmail: '',
    membersEmails: [],
    docketNumber: '',
    individualDocketNumber: '',
    createdAt: '',
    allowedWaste: {
      label: '',
      value: '',
    },
  },
  subscription: {
    _id: '',
    plan: '',
    oldPlan: '',
    status: '',
    trialEndsAt: '',
    startAt: '',
    endsAt: '',
    stripeSubscriptionId: '',
    stripeCustomerId: '',
    stripeProductId: '',
    stripePriceId: '',
    createdAt: '',
    updatedAt: '',
    maxLimit: '',
    limit: '',
  },
  selectedFleet: {
    _id: '',
    isIndividual: false,
    name: '',
    VAT: '',
    permitHolderName: '',
    permitNumber: '',
    permitHolderAddress: '',
    termsAndConditions: '',
    permitHolderContactDetails: '',
    permitHolderEmail: '',
    permitHolderLogo: '',
    prefix: '',
    ownerEmail: '',
    membersEmails: [],
    docketNumber: '',
    individualDocketNumber: '',
    createdAt: '',
    allowedWaste: {
      label: '',
      value: '',
    },
  },
  createdAt: '',
};

export const UserContext = createContext<{
  user: User;
  loadingUser: Boolean;
}>({
  user: emptyUserObject,
  loadingUser: false,
});

const UserCtxProvider = ({children}: PropsWithChildren<unknown>) => {
  //

  const [user, setUser] = useState(emptyUserObject);

  const {data: session} = useSession();

  const {loading: loadingUser} = useQuery(queries.getUserById, {
    variables: {
      token: session?.accessToken,
    },
    skip: !session,
    onCompleted: data => {
      setUser({
        ...data?.getUserById?.userData,
        fleets: data?.getUserById?.userData?.fleets,
        subscription: data?.getUserById?.subscription,
        selectedFleet: data?.getUserById?.userData?.selectedFleet,
      });
    },
  });

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser: loadingUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserCtxProvider;
