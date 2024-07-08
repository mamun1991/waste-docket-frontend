import {useEffect, useState, useRef} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import {
  PencilAltIcon,
  TrashIcon,
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  ArrowSmRightIcon,
} from '@heroicons/react/solid';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const CustomersScreen = () => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const router = useRouter();
  const [FleetsData, setFleetsData] = useState<any>(null);
  const [CustomersData, setCustomersData] = useState<any>([]);
  const [pageNumberList, setPageNumberList] = useState<number[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [searchText, setSearchText] = useState('');
  const searchInputText = useRef('');
  const fleetId = router?.query?.id;
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const sortedData = CustomersData?.sort((a, b) => {
      if (sortColumn === '') return 0;
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setCustomersData(sortedData);
  }, [sortColumn, sortOrder]);

  const handleSortClick = column => {
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

  const {data: getFleetById, loading: loadingGetFleetById} = useQuery(queries.GetFleetById, {
    variables: {
      fleetId: fleetId,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  const {data: GetCustomerContactByFleetId, loading: GetCustomerContactByFleetIdLoading} = useQuery(
    queries.GetCustomerContactByFleetId,
    {
      variables: {
        fleetId: fleetId,
        customersInput: {
          searchText: searchText.trim(),
          isPlainText: false,
          filteredFields: [],
          paginationArgs: {
            itemsPerPage: rowsPerPage,
            pageNumber: selectedPage,
          },
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    }
  );

  useEffect(() => {
    if (getFleetById) {
      setFleetsData(getFleetById?.getFleetById?.fleetData);
    }
  }, [getFleetById]);

  useEffect(() => {
    const customerData = GetCustomerContactByFleetId?.getCustomerContactByFleetId?.customersData;
    const totalCount = GetCustomerContactByFleetId?.getCustomerContactByFleetId?.totalCount;
    /* eslint-disable-next-line */
    const parsedDocketsData = customerData?.map(el => {
      return {
        customerId: el._id,
        customerName: el.customerName,
        customerPhone: el.customerPhone,
        customerEmail: el.customerEmail,
        customerAddress: el.customerAddress,
        customerStreet: el.customerStreet,
        customerCity: el.customerCity,
        customerCounty: el.customerCounty,
        customerEircode: el.customerEircode,
        customerCountry: el.customerCountry,
        customCustomerId: el.customerId,
      };
    });
    setCustomersData(parsedDocketsData);
    const totalPagesCalculated = totalCount && Math.ceil(totalCount / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [GetCustomerContactByFleetId]);

  useEffect(() => {
    setSelectedPage(1);
  }, [rowsPerPage]);

  useEffect(() => {
    setRowsPerPage(rowsPerPage);
    let pageNumbersArray: number[];
    if (totalPages > 5) {
      pageNumbersArray = Array.from({length: 5}, (_, i) => i + 1);
    } else {
      pageNumbersArray = Array.from({length: totalPages}, (_, i) => i + 1);
    }
    if (selectedPage > 3) {
      pageNumbersArray = Array.from({length: 5}, (_, i) => i + selectedPage - 2);
      pageNumbersArray = pageNumbersArray.filter(pageNumbers => pageNumbers <= totalPages);
      if (pageNumbersArray.length < 5) {
        !Number.isNaN(pageNumbersArray[0] - 1) && pageNumbersArray.unshift(pageNumbersArray[0] - 1);

        if (pageNumbersArray.length < 5 && pageNumbersArray[0] > 1) {
          pageNumbersArray.unshift(pageNumbersArray[0] - 1);
        }
      }
    }
    pageNumbersArray?.length === 1 ? setPageNumberList([]) : setPageNumberList(pageNumbersArray);
  }, [rowsPerPage, selectedPage, totalPages]);

  if (GetCustomerContactByFleetIdLoading || loadingGetFleetById) {
    return <Loader />;
  }
  return (
    <>
      <div className='mx-auto'>
        <div className='grid items-center mb-5 md:grid-cols-3 lg:-mx-2'>
          <div className='flex flex-col justify-between w-full gap-4 sm:flex-row md:flex-col lg:flex-row lg:items-center md:w-fit'>
            {FleetsData && <h1 className='text-xl font-bold text-primary'>{FleetsData?.name} </h1>}
          </div>
          <div></div>
          <div className='flex items-center self-end justify-start my-3 md:justify-end lg:justify-end lg:mt-5 md:my-0 lg:my-5'>
            <Button
              variant='Primary'
              className='px-4 py-2 ml-0 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none'
              onClick={() => {
                showModal(MODAL_TYPES.ADD_EDIT_CUSTOMER, {
                  fleetId,
                  FORM_TYPE: 'ADD_CUSTOMER',
                  showFleets: true,
                });
              }}
            >
              Add Customer
            </Button>
            <Button
              variant='Primary'
              className='px-4 py-2 ml-5 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none'
              onClick={() => {
                showModal(MODAL_TYPES.IMPORT_CUSTOMERS, {
                  fleetId,
                });
              }}
            >
              Import Customers
            </Button>
          </div>
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
                  searchInputText.current = event.target.value;
                }}
                className='w-full text-sm text-gray-500 border-gray-300 rounded-md  md:w-auto'
                placeholder={t('common:search')}
              />
              <Button
                type='button'
                className='w-40 px-4 py-2 ml-5 font-medium text-white rounded-lg shadow-sm sm:text-white text-md focus:outline-none bg-primary '
                onClick={() => {
                  setSearchText(searchInputText.current);
                }}
              >
                {t('common:search')}
              </Button>
            </div>
          </div>
        </div>

        <div className='inset-x-0 mx-auto my-2 left-2/12 w-fit md:w-fit whitespace-nowrap'>
          {pageNumberList.length !== 0 && (
            <button
              onClick={() =>
                selectedPage !== pageNumberList[0] ? setSelectedPage(selectedPage - 1) : null
              }
            >
              <span className='flex px-3 py-2 mx-1 text-base font-bold leading-tight text-gray-500 transition duration-150 ease-in-out bg-gray-200 rounded shadow cursor-pointer sm:block hover:bg-blue-700 hover:text-white focus:outline-none'>
                {t('common:txt_Prev')}
              </span>
            </button>
          )}

          {pageNumberList?.map(pageNumber => {
            let pageButtonStyle;
            if (pageNumber !== selectedPage) {
              pageButtonStyle =
                'inline w-10 text-primary hover:bg-blue-700 hover:text-white bg-gray-200 text-base leading-tight font-bold cursor-pointer shadow transition duration-150  ease-in-out mx-1 rounded px-1.5 py-2 focus:outline-none';
            } else {
              pageButtonStyle =
                'inline w-10 bg-primary text-white text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-1.5 py-2 focus:outline-none';
            }

            return (
              <button
                key={pageNumber}
                className={pageButtonStyle}
                onClick={() => {
                  setSelectedPage(pageNumber);
                }}
              >
                {pageNumber}
              </button>
            );
          })}
          {pageNumberList.length !== 0 && (
            <button
              disabled={selectedPage === pageNumberList[-1]}
              onClick={() =>
                selectedPage !== pageNumberList[pageNumberList.length - 1]
                  ? setSelectedPage(selectedPage + 1)
                  : null
              }
            >
              <span className='flex px-3 py-2 mx-1 text-base font-bold leading-tight text-gray-500 transition duration-150 ease-in-out bg-gray-200 rounded shadow cursor-pointer sm:block hover:bg-blue-700 hover:text-white focus:outline-none'>
                {t('common:txt_Next')}
              </span>
            </button>
          )}
        </div>

        <div>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-10'>
            <div className='inline-block min-w-full py-4 md:py-0 sm:px-6 lg:px-8'>
              <div className=''>
                <table
                  className={
                    pageNumberList.length === 0
                      ? `min-w-full sm:min-w-full md:min-w-full text-center table-fixed md:mt-2 mt-0`
                      : `min-w-full sm:min-w-full md:min-w-full text-center table-fixed md:mt-2 mt-2`
                  }
                >
                  <thead className='border-b bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] max-w-[15%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('customerId')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('customerId')}
                          {t('common:customerId')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] max-w-[15%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('customerName')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('customerName')}
                          {t('common:customerName')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] max-w-[15%] text-sm font-bold text-black px-6 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('customerEmail')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('customerEmail')}
                          {t('common:customerEmail')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[40%] w-[40%] max-w-[40%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('customerAddress')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('customerAddress')}
                          {t('common:customerAddress')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[5%] w-[20%] md:w-[5%] md:max-w-[5%] text-sm font-bold text-black px-6 sm:px-0 py-2 whitespace-nowrap'
                      >
                        {t('common:Edit')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[5%] w-[20%] md:w-[5%] md:max-w-[5%] text-sm font-bold text-black px-2 sm:px-0 py-2 whitespace-nowrap'
                      >
                        {t('common:Delete')}
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll'>
                    {CustomersData &&
                      // eslint-disable-next-line arrow-body-style
                      CustomersData.map(el => {
                        return (
                          <tr key={el?.customerName} className='w-full bg-white border-b'>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              {el?.customCustomerId}
                            </td>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              {el?.customerName}
                            </td>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-6 py-2 text-left'>
                              {el?.customerEmail}
                            </td>
                            <td className='min-w-[40%] w-[40%] max-w-[40%] text-left text-sm text-black px-2 py-2'>
                              {el?.customerAddress}
                            </td>

                            <td className='py-2 text-sm text-black w-fit'>
                              <button
                                onClick={() => {
                                  showModal(MODAL_TYPES.ADD_EDIT_CUSTOMER, {
                                    ...el,
                                    fleetId,
                                    FORM_TYPE: 'EDIT_CUSTOMER',
                                  });
                                }}
                                className='font-bold text-left text-black bg-white rounded-md hover:text-primary'
                              >
                                <PencilAltIcon className='w-5 h-5 text-left' />
                              </button>
                            </td>
                            <td className='py-2 text-sm text-black'>
                              <button
                                onClick={() => {
                                  showModal(MODAL_TYPES.DELETE_CUSTOMER_IN_FLEET, {
                                    ...el,
                                    fleetId,
                                    FORM_TYPE: 'EDIT_CUSTOMER',
                                  });
                                }}
                                className='font-bold text-left text-red-500 bg-white rounded-md hover:text-primary'
                              >
                                <TrashIcon className='w-5 h-5 text-left' />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {CustomersData?.length === 0 ? (
                  <div className='flex px-2 text-lg text-red-700 justify-left'>
                    {t('common:no_customers')}
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

export default CustomersScreen;
