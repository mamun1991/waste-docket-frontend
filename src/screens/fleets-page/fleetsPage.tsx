import Loader from '@/components/shared/Loader/Loader';
import {MODAL_TYPES} from '@/constants/context/modals';
import {UserContext} from '@/context/user';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, {useContext} from 'react';

const FleetsPage = ({loading, CardData, addButtonModal}) => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {user} = useContext(UserContext);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {CardData?.map(el => (
            <div key={el} className='flex flex-col py-4'>
              <div className='flex flex-col pt-4 pb-1 pl-3 mb-1 items-start'>
                <div className=''>
                  <h4 className='text-xl text-[#007337] font-bold overflow-hidden line-clamp-2 min-h-[4rem] text-left'>
                    {el?.CardHeading}
                  </h4>
                </div>
                {el?.permitHolderLogo && (
                  <div className='w-40 h-40 rounded-full'>
                    <img
                      src={el?.permitHolderLogo}
                      className='object-cover w-40 h-40 rounded-full'
                      alt=''
                    />
                  </div>
                )}
              </div>
              {el.CardData.map((value, key) => (
                <div key={key}>
                  <div className='w-full px-3 mb-6 md:w-1/2 flex flex-row text-lg'>
                    <div className='text-lg min-w-[200px] font-bold pr-4'>
                      {t(`common:${value.key}`)}
                    </div>
                    <div className='text-lg font-normal'>{value.value}</div>
                  </div>
                </div>
              ))}
              <div className='flex flex-col mt-4 gap-y-2 gap-x-4 sm:flex-row flex-col flex-col-reverse'>
                <div>
                  {user?.personalDetails?.email === el?.ownerEmail ? (
                    <button
                      onClick={() => showModal(addButtonModal, el)}
                      className='w-full p-1 px-3 sm:mx-2 sm:w-60 sm:h-16 text-lg text-white border rounded-md shadow-sm border-primary bg-primary font-small active:opacity-75'
                    >
                      {t('common:edit')}
                    </button>
                  ) : (
                    <button
                      onClick={() => showModal(MODAL_TYPES.LEAVE_FLEET, el)}
                      className={classNames([
                        'w-full p-1 px-3 text-lg sm:w-60 sm:h-16 text-white bg-red-400 border border-red-400 rounded-md shadow-sm font-small active:opacity-75',
                      ])}
                    >
                      {t('common:leaveFleet')}
                    </button>
                  )}
                </div>
                <div>
                  <button
                    onClick={e => {
                      e.preventDefault();
                      showModal(MODAL_TYPES.FLEET_DETAILS, el);
                    }}
                    className='w-full sm:h-16 sm:w-60 p-1 px-3 text-lg text-white border rounded-md shadow-sm border-primary bg-primary font-small active:opacity-75'
                  >
                    {t('page:show_information_company')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default FleetsPage;
