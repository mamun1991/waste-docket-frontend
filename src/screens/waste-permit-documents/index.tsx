import {useState} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import queries from '@/constants/GraphQL/Fleet/queries';
import {
  TrashIcon,
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  ArrowSmRightIcon,
  DocumentIcon,
} from '@heroicons/react/solid';

import {useQuery} from '@apollo/client';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const WastePermitDocuments = () => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const [FleetsData, setFleetsData] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [count, setCount] = useState(0);
  const [tempSearch, setTempSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [wasteCollectionPermitDocument, setWasteCollectionPermitDocument] = useState<any>([]);
  const [isOwner, setIsOwner] = useState(false);
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

  const {loading: GetWasteCollectionPermitDocumentWithSortingLoading} = useQuery(
    queries.GetWasteCollectionPermitDocumentWithSorting,
    {
      variables: {
        wastePermitDocumentWithSortingInput: {
          searchText: searchText.trim(),
          sortColumn: sortColumn,
          sortOrder: sortOrder,
          pageNumber: selectedPage,
          itemsPerPage: rowsPerPage,
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
      fetchPolicy: 'network-only',
      onCompleted: data => {
        const wastePermitDocument =
          data?.getWasteCollectionPermitDocumentWithSorting?.wasteCollectionPermitDocument;
        const totalCount = data?.getWasteCollectionPermitDocumentWithSorting?.totalCount;

        const parseWasteCollectionPermitDocumentData = wastePermitDocument?.map(el => {
          const removeFileExtension = el?.documentName.split('.');
          const wasteCollectionPermitDocumentName =
            removeFileExtension.length > 1
              ? removeFileExtension.slice(0, -1).join('.')
              : el?.documentName;
          const timestamp = el?.createdAt;
          const dateObject = new Date(Number(timestamp));

          const dateFormatted = dateObject.toISOString();
          const wasteCollectionPermitDocumentCreatedAt = dayjs(dateFormatted).format('YYYY-MM-DD');

          return {
            wasteCollectionPermitDocumentId: el?._id,
            wasteCollectionPermitDocumentName,
            wasteCollectionPermitDocumentCreatedAt,
          };
        });
        const fleet = data?.getWasteCollectionPermitDocumentWithSorting?.fleet;
        setFleetsData(fleet);
        setIsOwner(fleet?.ownerEmail === session?.user?.email);
        setWasteCollectionPermitDocument(parseWasteCollectionPermitDocumentData);
        setCount(totalCount);
      },
    }
  );

  if (GetWasteCollectionPermitDocumentWithSortingLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='mx-auto'>
        <div className='grid items-center mb-5 md:grid-cols-3 lg:-mx-2'>
          <div className='flex flex-col justify-between w-full gap-4 sm:flex-row md:flex-col lg:flex-row lg:items-center md:w-fit'>
            <h1 className='text-xl font-bold text-primary'>{FleetsData?.name} </h1>
          </div>
          <div></div>
          {isOwner && (
            <div className='flex items-center self-start justify-start my-3 md:justify-end lg:justify-end lg:mt-5 md:my-0 lg:my-5'>
              <Button
                variant='Primary'
                className='px-4 w-56 py-2 ml-0 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none'
                onClick={() => {
                  showModal(MODAL_TYPES.ADD_DOCUMENTS, {
                    fleetId: FleetsData?._id,
                    FORM_TYPE: 'ADD_DOCUMENTS',
                  });
                }}
              >
                {t('page:uploadDocument')}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className='relative flex flex-wrap items-center justify-start w-full gap-2 mb-3 lg:-mx-2 md:justify-between'>
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
                className='w-40 px-4 py-2 ml-5 font-medium text-white rounded-lg shadow-sm sm:text-white text-md focus:outline-none bg-primary '
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
                        className='min-w-[25%] w-[25%] max-w-[25%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('documentName')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('documentName')}
                          {t('common:documentName')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[25%] w-[25%] max-w-[25%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('createdAt')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('createdAt')}
                          {t('common:createdAt')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[25%] w-[25%] md:w-[25%] md:max-w-[25%] text-sm font-bold text-black px-6 sm:px-0 py-2 whitespace-nowrap'
                      >
                        {t('common:actions')}
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll'>
                    {wasteCollectionPermitDocument &&
                      // eslint-disable-next-line arrow-body-style
                      wasteCollectionPermitDocument.map(el => {
                        return (
                          <tr
                            key={el?.wasteCollectionPermitDocumentId}
                            className='w-full bg-white border-b'
                          >
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              {el?.wasteCollectionPermitDocumentName}
                            </td>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              {el?.wasteCollectionPermitDocumentCreatedAt}
                            </td>
                            <td className='px-4 py-2 text-sm text-black'>
                              <button
                                onClick={async () => {
                                  showModal(MODAL_TYPES.VIEW_PDF, {
                                    ...el,
                                    fleetId: FleetsData?._id,
                                    FORM_TYPE: 'VIEW_PDF',
                                  });
                                }}
                              >
                                <DocumentIcon className='w-5 h-5 text-left' />
                              </button>
                              {isOwner && (
                                <button
                                  onClick={() => {
                                    showModal(MODAL_TYPES.DELETE_DOCUMENTS, {
                                      ...el,
                                      fleetId: FleetsData?._id,
                                      FORM_TYPE: 'DELETE_DOCUMENTS',
                                    });
                                  }}
                                  className='font-bold text-left text-red-500 bg-white rounded-md hover:text-primary'
                                >
                                  <TrashIcon className='w-5 h-5 text-left' />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {wasteCollectionPermitDocument?.length === 0 ? (
                  <div className='flex px-2 text-lg text-red-700 justify-left'>
                    {t('common:no_permit_documents')}
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

export default WastePermitDocuments;
