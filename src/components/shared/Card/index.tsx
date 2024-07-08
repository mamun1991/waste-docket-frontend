import {useState, useEffect, useContext} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {UserContext} from '@/context/user';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import classNames from 'classnames';
import {InformationCircleIcon} from '@heroicons/react/outline';
import {PlusCircleIcon, LogoutIcon} from '@heroicons/react/solid';
import Loader from 'components/shared/Loader/Loader';
import Button from '../Button';

const Card = ({
  CardData,
  addButtonText,
  addButtonModal,
  deleteButtonModal,
  setSearchQuery,
  selectedPage,
  rowsPerPage,
  setRowsPerPage,
  loading,
  pageNumberList,
}) => {
  const {user} = useContext(UserContext);
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation();
  const [isPlainText] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedOption] = useState<{value: string; label: string}[]>([]);

  const handleSearch = () => {
    const filteredFields = selectedOption.map(value => value.value);
    const searchQueryBuild = {
      searchText,
      isPlainText,
      filteredFields,
      paginationArgs: {
        pageNumber: selectedPage,
        itemsPerPage: rowsPerPage,
      },
    };
    setSearchQuery(searchQueryBuild);
  };

  useEffect(() => {
    handleSearch();
  }, [selectedPage]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='container mx-auto mb-4'>
          <div className='flex flex-col-reverse justify-between hidden my-3 md:flex-row items-between md:mt-3 lg:mt-5'>
            <div className='flex flex-col items-center justify-start my-3 md:flex-wrap md:flex-row gap-y-4 md:mt-3 lg:mt-5'>
              <input
                type='text'
                id='filter'
                name='filter'
                onChange={event => {
                  setSearchText(event.target.value);
                }}
                className='w-full text-sm text-gray-500 border-gray-300 rounded-md md:w-auto'
                placeholder={t('common:search')}
              />

              <Button
                type='button'
                className='w-40 px-4 py-2 ml-3 font-medium text-white rounded-lg shadow-sm sm:text-white text-md focus:outline-none bg-primary '
                onClick={handleSearch}
              >
                {t('common:search')}
              </Button>
            </div>
          </div>
          {pageNumberList?.length !== 0 && (
            <div className='ml-auto'>
              <select
                name='language'
                className='block max-w-md py-2 pl-3 pr-10 overflow-hidden text-sm border-gray-300 rounded-md w-fit focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-base'
                onChange={event => setRowsPerPage(Number(event.target.value))}
              >
                <option value='25'>25</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
              </select>
            </div>
          )}

          <div className='grid grid-cols-1 gap-6 mb-6 md:grid-cols-3 lg:grid-cols-4'>
            {addButtonText && (
              <div className='flex items-center hidden block max-w-sm rounded-lg shadow-xl bg-slate-50/60 hover:shadow-2xl'>
                <div className='w-full px-6 py-4'>
                  <div className='flex flex-col items-center text-lg font-bold text-center text-primary'>
                    {addButtonText && t(addButtonText)}
                    <PlusCircleIcon
                      width={80}
                      className='mt-8'
                      onClick={() => {
                        showModal(addButtonModal);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {CardData?.map(el => (
              <div
                key={el}
                className='block max-w-sm bg-slate-50/60 rounded-lg shadow-xl hover:shadow-2xl min-h-[200px]'
              >
                <div className='flex pt-4 pl-4 pb-1 mb-1 border-b-[1px] flex-row justify-between items-center'>
                  <div className='card-header-conte'>
                    <h4 className='text-lg text-[#007337] font-bold overflow-hidden line-clamp-2 min-h-[4rem]'>
                      {el?.CardHeading}
                    </h4>
                  </div>
                  <div>
                    <img src={el?.permitHolderLogo} className='w-12' alt='' />
                  </div>
                </div>
                <div className='flex flex-col gap-2 p-4 pt-0'>
                  {el?.CardData.map((value, key) => (
                    <div key={key} className='flex items-center gap-2 align-center'>
                      <img
                        alt={'image'}
                        src={value.icon}
                        className={classNames([
                          'min-w-[10%] max-w-[10%] h-7 text-black stroke-black duration-300',
                        ])}
                        aria-hidden='true'
                      />
                      <p className='min-w-[85%] max-w-[85%] truncate ...'>{value.value}</p>
                    </div>
                  ))}
                  <a
                    onClick={e => {
                      e.preventDefault();
                      showModal(MODAL_TYPES.FLEET_DETAILS, el);
                    }}
                    className={classNames([
                      'flex items-center space-x-1 hover:font-bold hover:text-[#007337] transition-all',
                    ])}
                    href='#'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <div className='flex flex-row gap-2 items-left align-center'>
                      <InformationCircleIcon className={classNames(['w-6 h-6'])} />
                      {t('common:show_details')}
                    </div>
                  </a>
                  {user?.personalDetails?.email === el?.ownerEmail && (
                    <a
                      href={`/fleetMembers/${el.id}`}
                      target='_blank'
                      rel='noreferrer'
                      className={classNames([
                        'flex items-center space-x-1 hover:font-bold hover:text-[#007337] transition-all',
                      ])}
                    >
                      <div className='flex flex-row gap-2 items-left align-center'>
                        <img
                          alt={'image'}
                          src='/assets/images/viewdrivers.svg'
                          className={classNames(['w-6 h-6 text-gray-400 duration-300'])}
                          aria-hidden='true'
                        />
                        {t('common:show_drivers')}
                      </div>
                    </a>
                  )}
                  {user?.personalDetails?.email === el?.ownerEmail && (
                    <a
                      href={`/fleetCustomers/${el.id}`}
                      target='_blank'
                      rel='noreferrer'
                      className={classNames([
                        'flex items-center space-x-1 hover:font-bold hover:text-[#007337] transition-all',
                      ])}
                    >
                      <div className='flex flex-row gap-2 items-left align-center'>
                        <img
                          alt={'image'}
                          src='/assets/images/viewcustomers.svg'
                          className={classNames(['w-6 h-6 text-gray-400 duration-300'])}
                          aria-hidden='true'
                        />
                        {t('common:show_customers')}
                      </div>
                    </a>
                  )}
                </div>
                <div className='flex justify-between p-4 pt-0'>
                  <div className='self-start'>
                    {user?.personalDetails?.email === el?.ownerEmail && (
                      <button
                        onClick={() => showModal(addButtonModal, el)}
                        className='self-end p-1 px-3 text-xs text-white border rounded-md shadow-sm border-primary bg-primary font-small active:opacity-75'
                      >
                        {t('common:edit')}
                      </button>
                    )}
                  </div>
                  <div className='self-end'>
                    {user?.personalDetails?.email === el?.ownerEmail ? (
                      <button
                        onClick={() => showModal(deleteButtonModal, el)}
                        className='self-end p-1 px-3 text-xs text-white bg-red-400 border border-red-400 rounded-md shadow-sm font-small active:opacity-75'
                      >
                        {t('common:delete')}
                      </button>
                    ) : (
                      <LogoutIcon
                        onClick={() => showModal(MODAL_TYPES.LEAVE_FLEET, el)}
                        className={classNames(['w-6 h-6 text-red-600 duration-300 cursor-pointer'])}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
