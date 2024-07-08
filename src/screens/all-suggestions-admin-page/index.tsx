import {useState} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import {useQuery} from '@apollo/client';
import {ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmRightIcon, TrashIcon} from '@heroicons/react/solid';
import queries from '@/constants/GraphQL/Suggestion/queries';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const AllSuggestionsForAdmin = () => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const [suggestionsData, setSuggestionsData] = useState<any>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [count, setCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

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

  const {loading: GetSuggestionsLoading} = useQuery(queries.GetSuggestions, {
    variables: {
      searchParams: {
        searchText: searchText.trim(),
        resultsPerPage: rowsPerPage,
        pageNumber: selectedPage,
        sortColumn: sortColumn,
        sortOrder: sortOrder,
      },
    },
    skip: !session,
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
    onCompleted: data => {
      if (data?.getSuggestions?.response?.status === 200) {
        const suggestionsData = data?.getSuggestions?.suggestions;
        const totalCount = data?.getSuggestions?.totalCount;
        setSuggestionsData(suggestionsData);
        setCount(totalCount);
      }
    },
    onError: error => {
      console.error('Error fetching suggestions data:', error);
    },
  });

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  if (GetSuggestionsLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='mt-8'>
        <div className='flex justify-end'>
          <Button
            variant='Primary'
            className='px-4 py-2 mt-2 ml-0 font-medium rounded-lg shadow-sm w-full sm:w-44 sm:text-white text-md focus:outline-none'
            onClick={() => {
              showModal(MODAL_TYPES.DELETE_SUGGESTION, {
                doDeleteAll: true,
              });
            }}
          >
            {t('common:delete_all')}
          </Button>
        </div>
        <div className='relative flex mt-4 flex-wrap items-center justify-start w-full gap-2 mb-3 lg:-mx-2 md:justify-between'>
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
                className='w-full text-sm text-gray-500 border-gray-300 rounded-md md:w-auto'
                placeholder={t('common:search')}
              />
              <Button
                type='button'
                className='w-40 px-4 py-2 ml-5 font-medium text-white rounded-lg shadow-sm sm:text-white text-md focus:outline-none bg-primary'
                onClick={() => {
                  setSearchText(tempSearch);
                  setSelectedPage(1);
                }}
              >
                {t('common:search')}
              </Button>
            </div>
          </div>
          <div className='flex items-center whitespace-nowrap'>
            <div className='py-1'>
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
              Page {selectedPage} of {Math.ceil(count / rowsPerPage)}
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

        <div>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-10'>
            <div className='inline-block min-w-full py-4 md:py-0 sm:px-6 lg:px-8'>
              <div className=''>
                <table
                  className={`min-w-full sm:min-w-full md:min-w-full text-center table-fixed md:mt-2 mt-2`}
                >
                  <thead className='border-b bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] cursor-pointer max-w-[15%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('fleetName')}
                      >
                        <div className='flex items-center cursor-pointer'>
                          {renderSortArrow('fleetName')}
                          {t('common:business')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] cursor-pointer max-w-[15%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                      >
                        <div className='flex items-center'>{t('common:user')}</div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] cursor-pointer max-w-[15%] text-sm font-bold text-black px-6 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('suggestion')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('suggestion')}
                          {t('common:suggestion')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] cursor-pointer max-w-[15%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('createdAt')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('createdAt')}
                          {t('common:createdAt')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[10%] w-[10%] cursor-pointer max-w-[10%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                      >
                        {t('common:actions')}
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll'>
                    {suggestionsData &&
                      // eslint-disable-next-line arrow-body-style
                      suggestionsData.map(el => {
                        const shortSuggestion = truncateText(el?.suggestion, 100);
                        const hasMore = el?.suggestion?.length > 100;
                        return (
                          <tr key={el?._id} className='w-full bg-white border-b'>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              {el?.fleet?.name || el?.fleetName}
                            </td>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              <p>
                                <span className='font-bold'>{t('common:name')}</span>: {el?.name}
                              </p>
                              <p>
                                <span className='font-bold'>{t('common:email')}</span>: {el?.email}
                              </p>
                            </td>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-6 py-2 text-left'>
                              {shortSuggestion}
                              {hasMore && (
                                <button
                                  onClick={() => {
                                    showModal(MODAL_TYPES.SUGGESTION_DETAILS, {
                                      ...el,
                                    });
                                  }}
                                  className='text-blue-500 underline'
                                >
                                  {t('common:see_more')}
                                </button>
                              )}
                            </td>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              {el.createdAt !== null && el.createdAt !== undefined
                                ? dayjs(
                                    ((el.createdAt as unknown as number) / 1000) * 1000,
                                    dayjs.tz.guess()
                                  ).format('MMM DD, YYYY hh:mm A')
                                : ''}
                            </td>
                            <td className='min-w-[10%] w-[10%] max-w-[10%] text-sm text-black px-2 py-2 text-left'>
                              <button
                                onClick={() => {
                                  showModal(MODAL_TYPES.DELETE_SUGGESTION, {
                                    ...el,
                                    doDeleteAll: false,
                                  });
                                }}
                                className='flex flex-row gap-2 items-start justify-center text-red-500 bg-white rounded-md'
                              >
                                <TrashIcon className='w-5 h-5 text-left' />
                                {t('common:delete')}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {suggestionsData?.length === 0 ? (
                  <div className='flex px-2 text-lg text-red-700 justify-left'>
                    {t('common:no_suggestions')}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center mt-12 space-x-2 text-black'>
            <div className='space-x-2'></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllSuggestionsForAdmin;
