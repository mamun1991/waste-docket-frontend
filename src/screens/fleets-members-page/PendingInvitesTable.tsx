import {INVIATION_STATUS} from '@/constants/enums';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import {TrashIcon, ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmRightIcon} from '@heroicons/react/solid';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';

const MembersTable = ({
  pendingInvitationData,
  selectedPage,
  setSelectedPage,
  pendingMembersRowsPerPage,
  setPendingMembersRowsPerPage,
  pendingMembersCount,
  sortColumn,
  setSortColumn,
  sortOrder,
  setSortOrder,
}) => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
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
                setPendingMembersRowsPerPage(Number(event.target.value));
                setSelectedPage(1);
              }}
            >
              <option value='25' selected={pendingMembersRowsPerPage === 25}>
                25
              </option>
              <option value='50' selected={pendingMembersRowsPerPage === 50}>
                50
              </option>
              <option value='100' selected={pendingMembersRowsPerPage === 100}>
                100
              </option>
            </select>
          </div>
        </div>
      </div>
      <div className='inset-x-0 mx-auto my-2 left-2/12 w-fit md:w-fit whitespace-nowrap'>
        {pendingMembersCount && pendingMembersCount > 25 ? (
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
              {Math.ceil(pendingMembersCount / pendingMembersCount)}
            </span>

            <button
              onClick={() => {
                console.log('clicked');
                setSelectedPage(selectedPage + 1);
              }}
              disabled={selectedPage === Math.ceil(pendingMembersCount / pendingMembersRowsPerPage)}
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
          <div className='py-4 inline-block min-w-full'>
            <div className=''>
              <h1 className='text-primary font-bold text-lg px-2'>{t('common:pending_invites')}</h1>
              <table
                className={`min-w-full sm:min-w-full md:min-w-full lg:w-full text-center table-fixed md:mt-5 mt-2`}
              >
                <thead className='border-b bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                      onClick={() => handleSortClick('inviteeEmail')}
                    >
                      <div className='flex items-center'>
                        {renderSortArrow('inviteeEmail')}
                        {t('common:email')}
                      </div>
                    </th>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%]  text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      onClick={() => handleSortClick('status')}
                    >
                      <div className='flex items-center'>
                        {renderSortArrow('status')}
                        {t('common:status')}
                      </div>
                    </th>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%]  text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      onClick={() => handleSortClick('createdAt')}
                    >
                      <div className='flex items-center'>
                        {renderSortArrow('createdAt')}
                        {t('common:date_invited')}
                      </div>
                    </th>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%]  text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                    >
                      {t('common:actions')}
                    </th>
                  </tr>
                </thead>

                <tbody className='overflow-y-scroll'>
                  {pendingInvitationData &&
                    pendingInvitationData
                      .filter(el => el.status === INVIATION_STATUS.PENDING)
                      .map(el => {
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        const createdDate = dayjs(+el?.createdAt).format(' DD MMMM YYYY');
                        return (
                          <tr key={el._id} className='bg-white border-b w-20'>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                              {el.inviteeEmail}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                              {t(`common:${el?.status}`)}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                              {createdDate}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-center'>
                              <button
                                onClick={() => {
                                  showModal(MODAL_TYPES.DELETE_PENDING_INVITE, el);
                                }}
                                className='bg-white text-red-500 hover:text-primary font-bold rounded-md'
                              >
                                <TrashIcon className='h-5 w-5 text-left' />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>

              {!pendingInvitationData || pendingInvitationData?.length === 0 ? (
                <div className='flex justify-center mt-5 text-gray-500 text-2xl'>
                  {t('common:no_data')}
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
