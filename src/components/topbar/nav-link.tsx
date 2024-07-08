import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  name: string;
  pathname: string;
  icon: any;
  href: string;
  collapsed: boolean;
  route: any;
  setCollapsed: (value: boolean) => void;
};

const NavLink = (props: Props) => {
  // State
  const {t} = useTranslation('page');
  return (
    <>
      <a key={props.name} href={`${props.href}`}>
        <span
          key={props.name}
          className={classNames(
            props.href === props.pathname
              ? 'text-mainGreen font-bold'
              : 'text-gray-500 font-normal hover:text-primary',
            'flex   xl:flex-col sm:flex-row  md:flex-row group space-x-1 items-center py-2 pr-3 pl-5 text-base rounded-lg cursor-pointer text-left'
          )}
        >
          <props.icon
            className={classNames(
              props.href === props.pathname
                ? 'text-mainGreen'
                : 'text-gray-500 group-hover:text-primary',
              'flex flex-shrink-0 items-start justify-center w-8 h-8'
            )}
            aria-hidden='true'
          />

          {!props.collapsed && (
            <span className='flex-1 min-w-0 my-0 text-xs break-words duration-200 whitespace-nowrap transition-width easy'>
              {t(props.name)}
            </span>
          )}
        </span>
      </a>
    </>
  );
};

export default NavLink;
