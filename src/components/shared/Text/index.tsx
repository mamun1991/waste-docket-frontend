import classNames from 'classnames';

interface IProps
  extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  font?:
    | 'sans'
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';
  variant?: 'small' | 'middle' | 'large' | 'extra-large';
  size?:
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
  color?: 'White' | 'Black' | 'Blue' | 'Orange' | 'Gray' | 'Red';
  underline?: 'auto' | '0' | '1' | '2' | '4' | '8';
}

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
const Variants = {
  small: 'text-a1 md:text-a2 lg:text-a3',
  middle: 'text-b1 md:text-b2 lg:text-b3',
  large: 'text-c1 md:text-c2 lg:text-c3',
  'extra-large': 'text-d1 md:text-d2 lg:text-d3',
};

const Colors = {
  White: 'text-mainWhite',
  Black: 'text-mainBlack',
  Blue: 'text-mainBlue',
  Orange: 'text-mainOrange',
  Gray: 'text-mainGray',
  Red: 'text-mainRed',
};
const Fonts = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

const Text = function ({
  className,
  children,
  variant,
  font = 'sans',
  size,
  color = 'Black',
  underline,
  ...rest
}: IProps) {
  return (
    <label
      className={classNames([
        Fonts[font],
        underline && `underline underline-offset-`.concat(underline),
        Colors[color],
        size && Sizes[size],
        variant && Variants[variant],
        className && className,
      ])}
      {...rest}
    >
      {children}
    </label>
  );
};

export default Text;
