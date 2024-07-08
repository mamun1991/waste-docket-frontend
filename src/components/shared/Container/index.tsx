import React, {useEffect} from 'react';
import classNames from 'classnames';

type IProps = {
  className?: string;
};

const Container = ({
  className,
  children,
  ...rest
}: IProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  useEffect(() => {});
  return (
    <div
      className={classNames([
        'mx-auto container h-full w-full p-2 md:px-2 sm:w-11/12 md:w-5/6 flex justify-center',
        className,
      ])}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Container;
