type UserIconProps = {
  className?: string;
  width?: string;
  height?: string;
};

const BuildingIcon = ({className, width, height}: UserIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width ? width : '16'}
    height={height ? height : '16'}
    className={className ? className : ''}
    fill='currentColor'
    viewBox='0 0 24 24'
    stroke-width='1.5'
    stroke='currentColor'
  >
    <path
      stroke-linecap='round'
      stroke-linejoin='round'
      d='M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21'
    />
  </svg>
);

export default BuildingIcon;