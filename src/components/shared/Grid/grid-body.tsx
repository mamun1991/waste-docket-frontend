import classNames from 'classnames';
import {DetailedHTMLProps, HTMLAttributes, useEffect} from 'react';

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  row?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'auto' | 'min' | 'max';
  col?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'auto' | 'min' | 'max';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  content?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  flow: 'row' | 'col' | 'row-dense' | 'col-dense';
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
}

const GridBody = ({
  justify,
  content,
  row,
  col,
  flow,
  gap,
  className,
  children,
  ...rest
}: IProps) => {
  useEffect(() => {});
  return (
    <div
      className={classNames([
        'grid',
        row === 'auto' && 'auto-rows-auto',
        row === 'min' && 'auto-rows-min',
        row === 'max' && 'auto-rows-max',
        ['min', 'max', 'auto'].indexOf(`${row}`) < 0 && row ? 'grid-rows-'.concat(row) : '',
        col === 'auto' && 'auto-cols-auto',
        col === 'min' && 'auto-cols-min',
        col === 'max' && 'auto-cols-max',
        ['min', 'max', 'auto'].indexOf(`${col}`) < 0 && col ? 'grid-cols-'.concat(col) : '',
        justify && 'justify-'.concat(justify),
        content && 'content-'.concat(content),
        flow && 'grid-flow-'.concat(flow),
        gap && 'gap-'.concat(gap),
        className ? className : '',
      ])}
      {...rest}
    >
      {children}
    </div>
  );
};

export default GridBody;
