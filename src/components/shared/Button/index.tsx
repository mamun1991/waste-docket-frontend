import classNames from 'classnames';
import {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

interface IProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text?: string;
  // border?: '0' | '1' | '2' | '8';
  // color?: 'Blue' | 'Black' | 'White';
  round?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '2xl' | 'full';
  font?: 'bold' | 'sans' | 'serif' | 'mono';
  height?: '1' | '2' | '4' | '6' | '8' | '10' | '12' | '14' | 'full';
  width?: '1' | '2' | '4' | '6' | '8' | '10' | '12' | '14' | 'full';
  variant?: 'Black' | 'Blue' | 'White' | 'Orange' | 'Gray' | 'Red' | 'Green' | 'Primary';
  icon?: any;
  out?: Boolean;
  textSize?:
    | 'xs'
    | 'sm'
    | 'tiny'
    | 'base'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl';
  loading?: true | false;
}
const Button = ({
  text = 'ClickMe',
  className,
  children,
  icon,
  round = 'lg',
  font = 'bold',
  height = '10',
  width = 'full',
  textSize = 'base',
  variant = 'Blue',
  out = false,
  loading = false,
  ...rest
}: IProps) => {
  const Variants = {
    Primary: {
      in: 'bg-primary text-white active:bg-transparent active:text-primary active:ring-2 active:ring-primary',
      out: 'bg-transparent ring-2 ring-primary text-primary active:bg-primary active:text-white ',
    },
    Blue: {
      in: 'bg-mainBlue text-white active:bg-transparent active:text-mainBlue active:ring-2 active:ring-mainBlue',
      out: 'bg-transparent ring-2 ring-mainBlue text-mainBlue active:bg-mainBlue active:text-white ',
    },
    Black: {
      in: 'bg-mainBlack text-white active:bg-transparent active:text-mainBlack active:ring-2 active:ring-mainBlack',
      out: 'bg-transparent ring-2 ring-mainBlack text-mainBlack active:bg-mainBlack active:text-white ',
    },
    White: {
      in: 'bg-transparent text-white active:ring-2 active:ring-white',
      out: 'bg-transparent ring-2 ring-mainWhite text-mainWhite active:ring-0',
    },
    Red: {
      in: 'bg-mainRed text-white active:bg-transparent active:text-mainRed active:ring-2 active:ring-mainRed',
      out: 'bg-transparent ring-2 ring-mainRed text-mainRed active:bg-mainRed active:text-white ',
    },
    Orange: {
      in: 'bg-mainOrange text-white active:bg-transparent active:text-mainOrange active:ring-2 active:ring-mainOrange',
      out: 'bg-transparent ring-2 ring-mainOrange text-mainOrange active:bg-mainOrange active:text-white ',
    },
    Gray: {
      in: 'bg-mainGray text-white active:bg-transparent active:text-mainGray active:ring-2 active:ring-mainGray',
      out: 'bg-transparent ring-2 ring-mainGray text-mainGray active:bg-mainGray active:text-white ',
    },
    Green: {
      in: 'bg-mainGreen text-white active:bg-transparent active:text-mainGreen active:ring-2 active:ring-mainGreen',
      out: 'bg-transparent ring-2 ring-mainGreen text-mainGreen active:bg-mainGreen active:text-white ',
    },
  };
  const Sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    tiny: 'text-tiny',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl',
  };
  return (
    <button
      disabled={loading}
      value={text}
      className={classNames([
        width && `w-${width}`,
        height && `h-${height}`,
        font && `font-${font}`,
        textSize && Sizes[textSize],
        round && `rounded-${round}`,
        'select-none',
        `${loading ? 'opacity-25' : ''}`,
        out ? Variants[variant].out : Variants[variant].in,
        rest.disabled && 'disabled:bg-mainGray disabled:text-mainWhite',
        className && className,
      ])}
      {...rest}
    >
      {icon && icon} {children ? children : text}
    </button>
  );
};

export default Button;
