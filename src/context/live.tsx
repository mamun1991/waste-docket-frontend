/* eslint-disable react-hooks/rules-of-hooks */
import {createContext, PropsWithChildren, useState} from 'react';

type Section = {
  name: String;
};

const emptyUserObject = {
  name: '',
};

export const LiveContext = createContext<{
  section: Section;
  setSection: any;
}>({
  section: emptyUserObject,
  setSection: null,
});

const UserCtxProvider = ({children}: PropsWithChildren<unknown>) => {
  const [section, setSection] = useState(emptyUserObject);

  return (
    <LiveContext.Provider
      value={{
        section,
        setSection,
      }}
    >
      {children}
    </LiveContext.Provider>
  );
};

export default UserCtxProvider;
