import classNames from 'classnames';

type BoxProps = {
  className?: string;
  boxColor: string;
};

const DayTypeBox = ({className, boxColor}: BoxProps) => {
  const handleColor = () => {
    switch (boxColor) {
      case 'GOOD_DAY':
        return 'bg-green-500';
      case 'NORMAL_DAY':
        return 'bg-yellow-400';
      case 'BAD_DAY':
        return 'bg-red-500';
      default:
        return 'hidden';
    }
  };
  return (
    <div className={classNames(['h-12 border-2 border-gray-800', className, handleColor()])}></div>
  );
};

export default DayTypeBox;
