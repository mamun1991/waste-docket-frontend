import React from 'react';

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export default function LockButton({...rest}: IProps) {
  return (
    <button {...rest}>
      <img
        className='rounded-md p-1 active:bg-mainBlue cursor-pointer bg-mainWhite'
        src='/assets/Lock.svg'
        width={45}
        height={45}
        alt=''
      />
    </button>
  );
}
