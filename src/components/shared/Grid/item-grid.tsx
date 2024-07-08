// import classNames from 'classnames';
import classNames from 'classnames';
import {DetailedHTMLProps, HTMLAttributes, useEffect} from 'react';

type Wcount = '0' | '1' | '2' | '3' | '4' | '5' | '6';
type Hcount =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | 'full';
type RowStartEnd = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'auto';
type ColStartEnd =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | 'auto';

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  row?: Wcount;
  col?: Hcount;
  rowWidth?: {start: RowStartEnd; end: RowStartEnd};
  colHeight?: {start: ColStartEnd; end: ColStartEnd};
  rowStart?: RowStartEnd;
  rowEnd?: RowStartEnd;
  colStart?: ColStartEnd;
  colEnd?: ColStartEnd;
  gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  content?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
}

const Item = ({
  row,
  col,
  rowStart = 'auto',
  rowEnd = 'auto',
  colStart = 'auto',
  colEnd = 'auto',
  justify = 'start',
  content = 'center',
  gap = '0',
  className,
  children,
  ...rest
}: IProps) => {
  useEffect(() => {});
  return (
    <div
      className={classNames([
        'block',
        row ? 'row-span-'.concat(row) : '',
        col ? 'col-span-'.concat(col) : '',
        'justify-'.concat(justify),
        'content-'.concat(content),
        'gap-'.concat(gap),
        rowStart && 'row-start-'.concat(rowStart),
        rowEnd && 'row-end-'.concat(rowEnd),
        colStart && 'col-start-'.concat(colStart),
        colEnd && 'col-end-'.concat(colEnd),
        className ? className : '',
      ])}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Item;
