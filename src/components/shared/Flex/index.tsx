import classNames from 'classnames';
import {DetailedHTMLProps, HTMLAttributes} from 'react';

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  items?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  content?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
  flex?: 'col' | 'row' | 'wrap';
}

const Contents = {
  start: 'content-start',
  end: 'content-end',
  center: 'content-center',
  between: 'content-between',
  around: 'content-around',
  evenly: 'content-evenly',
};

const Justifys = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};
const Items = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  between: 'items-between',
  around: 'items-around',
  evenly: 'items-evenly',
};

function Flex({justify, items, content, flex, gap, className, children, ...rest}: IProps) {
  return (
    <div
      className={classNames([
        'flex',
        flex && 'flex-'.concat(flex),
        gap && 'gap-'.concat(gap),
        items && Items[items],
        justify && Justifys[justify],
        content && Contents[content],
        className && className,
      ])}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Flex;
