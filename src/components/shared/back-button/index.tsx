import React from 'react';

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export default function BackButton({...rest}: IProps) {
  return (
    <button {...rest}>
      <img alt='' src='/assets/back-arrow.svg' width={46} height={46} />
    </button>
  );
}
