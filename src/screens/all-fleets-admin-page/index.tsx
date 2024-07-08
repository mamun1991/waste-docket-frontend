import {useState} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import {TrashIcon, ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmRightIcon} from '@heroicons/react/solid';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const AllFleetsForAdmin = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();
  const [FleetsData, setFleetsData] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [searchText, setSearchText] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [count, setCount] = useState(0);

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

  const {loading} = useQuery(queries.GetAllBusinessesForAdminWithSorting, {
    variables: {
      fleetsInput: {
        searchText: searchText.trim(),
        sortColumn: sortColumn,
        sortOrder: sortOrder,
        itemsPerPage: rowsPerPage,
        pageNumber: selectedPage,
      },
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
    onCompleted: data => {
      const fleetData = data?.getAllBusinessesForAdminWithSorting?.fleetData;
      const totalCount = data?.getAllBusinessesForAdminWithSorting?.totalCount;
      const parsedFleetData = fleetData?.map(el => ({
        _id: el?._id,
        name: el?.name || '',
        permitNumber: el?.permitNumber,
        VAT: el?.VAT,
        ownerEmail: el?.ownerEmail,
        action: null,
        membersEmails: el?.membersEmails,
        createdAt: el?.createdAt,
      }));
      if (fleetData) {
        setFleetsData(parsedFleetData);
        setCount(totalCount);
      } else {
        setFleetsData([]);
      }
    },
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className='container'>
        <h1 className='font-bold text-2xl text-primary'>All Fleets</h1>
        <div className='relative pt-2 flex flex-wrap items-center justify-start w-full gap-2 mb-3 lg:-mx-2 md:justify-between'>
          <div className='flex flex-col justify-between w-full gap-4 sm:flex-row md:flex-col lg:flex-row lg:items-center md:w-fit'>
            <div className='flex items-center justify-start gap-y-4'>
              <input
                type='text'
                id='filter'
                name='filter'
                onChange={event => {
                  setTempSearch(event.target.value);
                }}
                value={tempSearch}
                className=' md:w-auto rounded-md border-gray-300 w-full text-gray-500 text-sm'
                placeholder={t('common:search')}
              />
              <Button
                type='button'
                className='w-40 sm:text-white rounded-lg shadow-sm text-md font-medium ml-5 focus:outline-none px-4 py-2 text-md bg-primary text-white '
                onClick={() => {
                  setSearchText(tempSearch);
                  setSelectedPage(1);
                }}
              >
                {t('common:search')}
              </Button>
            </div>
          </div>
          <div className='flex items-center gap-2 whitespace-nowrap'>
            <div className='py-1 mr-2'>
              <select
                name='language'
                className='block max-w-md py-2 pl-3 pr-10 overflow-hidden text-sm border-gray-300 rounded-md w-fit focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-base'
                onChange={event => {
                  setRowsPerPage(Number(event.target.value));
                  setSelectedPage(1);
                }}
              >
                <option value='25' selected={rowsPerPage === 25}>
                  25
                </option>
                <option value='50' selected={rowsPerPage === 50}>
                  50
                </option>
                <option value='100' selected={rowsPerPage === 100}>
                  100
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className='inset-x-0 mx-auto my-2 left-2/12 w-fit md:w-fit whitespace-nowrap'>
          {count && count > 25 ? (
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
                {t('page:Page')} {selectedPage} {t('page:of')} {Math.ceil(count / rowsPerPage)}
              </span>

              <button
                onClick={() => {
                  console.log('clicked');
                  setSelectedPage(selectedPage + 1);
                }}
                disabled={selectedPage === Math.ceil(count / rowsPerPage)}
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
          <div className='overflow-x-auto lg:-mx-4  w-[95vw] lg:w-[98vw] xl:w-full mx-auto'>
            <div className='py-4 md:py-0 inline-block min-w-full sm:px-6 lg:px-8 h-full'>
              <div className=''>
                <table
                  className={`min-w-full sm:min-w-full md:min-w-full text-center table-fixed md:mt-5 mt-2`}
                >
                  <thead className='border-b bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('name')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('name')}
                          {t('common:name')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-6 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('ownerEmail')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('ownerEmail')}
                          {t('common:email')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-6 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('permitNumber')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('permitNumber')}
                          {t('common:permitNumber')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-20 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('VAT')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('VAT')}
                          {t('common:VAT')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-6 lg:px-14 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('createdAt')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('createdAt')}
                          {t('common:date')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('name')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('name')}
                          {t('common:delete')}
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll'>
                    {FleetsData &&
                      // eslint-disable-next-line arrow-body-style
                      FleetsData.map(el => {
                        return (
                          <tr key={el.permitHolderName} className='bg-white border-b w-20'>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                              {el.name}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-6 py-2 text-left'>
                              {el.ownerEmail}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                              {el.permitNumber}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                              {el.VAT}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-8 py-2 whitespace-nowrap'>
                              {dayjs(dayjs(+el.createdAt)).format('DD MMM YYYY')}
                            </td>
                            <td className='text-sm text-black px-2 py-2'>
                              <button
                                className='bg-white text-red-500 hover:text-primary font-bold rounded-md text-left'
                                onClick={() => {
                                  showModal(MODAL_TYPES.DELETE_FLEET_ADMIN, el);
                                }}
                              >
                                <TrashIcon className='h-6 w-6 text-left' />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='text-black flex items-center justify-center space-x-2 mt-12'>
            <div className='space-x-2'></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllFleetsForAdmin;
