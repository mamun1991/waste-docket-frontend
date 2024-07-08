import {MenuAlt2Icon} from '@heroicons/react/outline';
import classNames from 'classnames';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

type Props = {
  onCloseSidebar: () => void;
};

const Topbar = ({onCloseSidebar}: Props) => {
  const [scrollActive, setScrollActiveState] = useState(false);
  const {asPath} = useRouter();
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollActiveState(window.scrollY > 20);
    });
  }, []);

  return (
    <>
      <div
        className={`z-30 sticky top-0 flex-shrink-0 flex h-12 lg:h-0 lg:border-none transition-all ${
          scrollActive ? 'bg-opacity-50 pb-4' : 'pt-0'
        }
        ${asPath === '/user/dashboard/' ? 'bg-mainBlack' : 'bg-mainWhite'}
        `}
      >
        <button
          type='button'
          className={classNames([
            'px-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden',
            asPath === '/user/dashboard/' ? 'text-mainWhite' : 'text-mainBlack',
          ])}
          onClick={onCloseSidebar}
        >
          <span className='sr-only'>Open sidebar</span>
          <MenuAlt2Icon className='h-6 w-6' aria-hidden='true' />
        </button>
      </div>
    </>
  );
};
export default Topbar;
