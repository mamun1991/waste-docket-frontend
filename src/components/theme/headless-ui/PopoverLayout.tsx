'use client';
import {Fragment, ReactNode} from 'react';
import {Float} from '@headlessui-float/react';
import type {Placement} from '@floating-ui/dom';
import {Popover, Transition} from '@headlessui/react';

type PopoverLayoutProps = {
  toggler: ReactNode;
  children: ReactNode;
  togglerClass?: string;
  placement?: Placement;
  menuClass?: string;
};

const PopoverLayout = ({
  children,
  toggler,
  togglerClass,
  placement,
  menuClass,
}: PopoverLayoutProps) => {
  return (
    <Popover className='relative'>
      {({open}) => (
        <>
          <Float placement={placement} offset={0}>
            <Popover.Button className={togglerClass ?? ''}>{toggler}</Popover.Button>
            <Transition
              as={Fragment}
              show={open}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-out duration-200'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className={menuClass ?? 'mt-0'}>
                {children}
                <Popover.Overlay className='fixed inset-0 bg-black opacity-0 -z-10' />
              </Popover.Panel>
            </Transition>
          </Float>
        </>
      )}
    </Popover>
  );
};

export default PopoverLayout;
