import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {TrashIcon, ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmRightIcon} from '@heroicons/react/solid';

const MembersTable = ({
  memberData,
  selectedPage,
  setSelectedPage,
  membersRowsPerPage,
  setMembersRowsPerPage,
  membersCount,
  handleUserRemoveInFleet,
  submitting,
  sortColumn,
  setSortColumn,
  sortOrder,
  setSortOrder,
}) => {
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation();
  const handleSortClick = column => {
    setSelectedPage(1);
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };
  const renderSortArrow = column => {
    if (column !== sortColumn) return <ArrowSmRightIcon className='w-4 h-4 ml-1' />;
    return sortOrder === 'asc' ? (
      <ArrowSmUpIcon className='w-4 h-4 ml-1' />
    ) : (
      <ArrowSmDownIcon className='w-4 h-4 ml-1' />
    );
  };
  return (
    <>
      <div className='flex justify-end'>
        <div className='flex items-center gap-2 whitespace-nowrap'>
          <div className='py-1 mr-2'>
            <select
              name='language'
              className='block max-w-md py-2 pl-3 pr-10 overflow-hidden text-sm border-gray-300 rounded-md w-fit focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-base'
              onChange={event => {
                setMembersRowsPerPage(Number(event.target.value));
                setSelectedPage(1);
              }}
            >
              <option value='25' selected={membersRowsPerPage === 25}>
                25
              </option>
              <option value='50' selected={membersRowsPerPage === 50}>
                50
              </option>
              <option value='100' selected={membersRowsPerPage === 100}>
                100
              </option>
            </select>
          </div>
        </div>
      </div>
      <div className='inset-x-0 mx-auto my-2 left-2/12 w-fit md:w-fit whitespace-nowrap'>
        {membersCount && membersCount > 25 ? (
          <div className='flex w-full flex-col items-center gap-12 sm:flex-row sm:justify-center'>
            <button
              onClick={() => setSelectedPage(selectedPage - 1)}
              disabled={selectedPage === 1}
              className='flex h-8 w-8 items-center justify-center rounded-md border bg-white shadow-sm'
            >
              <span className='flex px-3 py-2 mx-1 text-base font-bold leading-tight text-gray-500 transition duration-150 ease-in-out bg-gray-200 rounded shadow cursor-pointer sm:block hover:bg-blue-700 hover:text-white focus:outline-none'>
                {t('common:txt_Prev')}
              </span>
            </button>

            <span className='text-mono-700'>
              {t('page:Page')} {selectedPage} {t('page:of')}{' '}
              {Math.ceil(membersCount / membersRowsPerPage)}
            </span>

            <button
              onClick={() => {
                console.log('clicked');
                setSelectedPage(selectedPage + 1);
              }}
              disabled={selectedPage === Math.ceil(membersCount / membersRowsPerPage)}
              className='flex h-8 w-8 items-center justify-center rounded-md border bg-white shadow-sm'
            >
              <span className='flex px-3 py-2 mx-1 text-base font-bold leading-tight text-gray-500 transition duration-150 ease-in-out bg-gray-200 rounded shadow cursor-pointer sm:block hover:bg-blue-700 hover:text-white focus:outline-none'>
                {t('common:txt_Next')}
              </span>
            </button>
          </div>
        ) : null}
      </div>
      <div>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full'>
            <div className=''>
              <h1 className='text-primary font-bold text-lg px-2'>{t('common:members')}</h1>
              <table
                className={`min-w-full sm:min-w-full md:min-w-full lg:w-full text-center table-fixed md:mt-2 mt-2`}
              >
                <thead className='border-b bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                      onClick={() => handleSortClick('personalDetails.name')}
                    >
                      <div className='flex items-center'>
                        {renderSortArrow('personalDetails.name')}
                        {t('common:member_name')}
                      </div>
                    </th>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%]  text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                    >
                      <div className='flex items-center'>
                        {renderSortArrow('personalDetails.email')}
                        {t('common:member_email')}
                      </div>
                    </th>

                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                    >
                      {t('common:actions')}
                    </th>
                  </tr>
                </thead>

                <tbody className='overflow-y-scroll'>
                  {memberData &&
                    memberData?.map(el => (
                      <tr key={el._id} className='bg-white border-b w-20'>
                        <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                          {el.personalDetails?.name}
                        </td>
                        <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                          {el.personalDetails?.email}
                        </td>
                        <td className='text-sm text-black px-2 py-2'>
                          <button
                            className='bg-white text-red-500 hover:text-primary font-bold rounded-md text-left'
                            onClick={() => {
                              showModal(MODAL_TYPES.DELETE_MEMBER_IN_FLEET, {
                                handleDelete: handleUserRemoveInFleet,
                                user: el,
                              });
                            }}
                            disabled={submitting}
                          >
                            <TrashIcon className='h-6 w-6 text-left' />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {!memberData || memberData?.length === 0 ? (
                <div className='flex justify-left text-red-700 text-lg px-2'>
                  {t('common:no_drivers')}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className='text-black flex items-center justify-center space-x-2 mt-12'>
          <div className='space-x-2'></div>
        </div>
      </div>
    </>
  );
};
export default MembersTable;
