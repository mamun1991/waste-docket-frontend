import React, {PropsWithChildren} from 'react';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {XIcon, CheckIcon} from '@heroicons/react/outline';
import classNames from 'classnames';

type Props = PropsWithChildren<{
  icon?: any;
  title?: string;
  large?: Boolean;
  medium?: Boolean;
  small?: Boolean;
  extraSmall?: Boolean;
  select?: Boolean;
  preventClose?: Boolean;
  additionalClasses?: string;
  steps?: any;
}>;

const Modal = ({
  title,
  children,
  large,
  medium,
  small,
  extraSmall,
  select,
  preventClose,
  additionalClasses,
  steps,
}: Props) => {
  const {hideModal} = ModalContextProvider();
  return (
    <>
      <div
        className='fixed inset-0 overflow-y-auto'
        style={{
          maxHeight: '100vh',
          paddingRight: '10px',
          paddingLeft: '10px',
          zIndex: '60',
        }}
        aria-labelledby='modal-title'
        role='dialog'
        aria-modal='true'
      >
        <div className='relative min-h-screen max-h-screen text-center flex justify-center items-center'>
          <div
            className='fixed h-screen w-screen inset-0 bg-black bg-opacity-50 transition-opacity max-h-screen'
            aria-hidden='true'
          ></div>
          <div
            className={`${additionalClasses} inline-block bg-white rounded-lg px-4 pb-4 text-left shadow-xl transform transition-all overflow-y-scroll md:overflow-auto lg:overflow-auto md:overflow-x-hidden lg:overflow-x-hidden align-middle max-w-4xl w-full p-6 sm:my-8 sm:align-middle sm:max-w-4xl`}
            style={{
              minHeight: select ? '50vh' : '10vh',
              width: large
                ? '750px'
                : medium
                ? '550px'
                : small
                ? '400px'
                : extraSmall
                ? '340px'
                : '100%',
            }}
          >
            <XIcon
              className='w-8 h-8 float-right rounded-full hover:bg-gray-100 p-2 cursor-pointer'
              onClick={() => {
                if (preventClose) {
                  return;
                }
                hideModal();
              }}
            />
            <div className='sm:flex sm:items-start mb-4'>
              <h3
                className={`${
                  steps && 'mt-2'
                } text-xl leading-9 font-bold text-[#007337] justify-center align-middle w-full text-left`}
              >
                {title}
              </h3>
              {steps && (
                <nav aria-label='Progress'>
                  <ol role='list' className='flex items-center justify-center py-3'>
                    {steps.map((step, index) => (
                      <li
                        key={index}
                        className={classNames(
                          index !== steps.length - 1 ? 'pr-3 sm:pr-10' : '',
                          'relative'
                        )}
                      >
                        {step?.status === 'complete' ? (
                          <>
                            <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                              <div
                                className={`h-0.5 w-full bg-mainGreen transition-width duration-500 ease-in-out`}
                              />
                            </div>
                            <div className='relative w-10 h-10 flex items-center justify-center bg-mainGreen rounded-full hover:bg-mainGreen'>
                              <CheckIcon className='w-5 h-5 text-white' aria-hidden='true' />
                            </div>
                          </>
                        ) : step?.status === 'current' ? (
                          <>
                            <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                              <div className='h-0.5 w-full bg-gray-200' />
                            </div>
                            <div
                              className='relative w-10 h-10 flex items-center justify-center bg-white border-2 border-mainGreen rounded-full'
                              aria-current='step'
                            >
                              <span
                                className='h-2.5 w-2.5 bg-mainGreen rounded-full'
                                aria-hidden='true'
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                              <div className='h-0.5 w-full bg-gray-200' />
                            </div>
                            <div className='group relative w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400'>
                              <span
                                className='h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300'
                                aria-hidden='true'
                              />
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
