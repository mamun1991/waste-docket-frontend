import {useContext} from 'react';
import {CollapseContext} from './collapseContext';
import {CollapseProps} from '.';

type CollapseToggleProps = {
  openClass?: string;
} & CollapseProps;

const CollapseToggle = ({
  children,
  as: tag = 'button',
  className,
  openClass,
}: CollapseToggleProps) => {
  const {open, handleCollapse} = useContext(CollapseContext);
  const Tag = tag;
  return (
    <Tag
      className={`${className}${open ? ' open fc-col-open ' : ' fc-col-close '}${
        open && openClass ? openClass : ''
      }`}
      onClick={handleCollapse}
    >
      {children}
    </Tag>
  );
};

export default CollapseToggle;
