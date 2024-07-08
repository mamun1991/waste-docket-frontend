import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';

import Loader from 'components/shared/Loader/Loader';

type Props = {
  children: React.ReactNode;
};

const AuthRoute = ({children}: Props) => {
  const {push} = useRouter();
  const {status} = useSession();

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    push('/');
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthRoute;
