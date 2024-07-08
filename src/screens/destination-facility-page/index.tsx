import {useState, useContext} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
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
import {UserContext} from '@/context/user';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const FacilityPage = () => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const userObject = useContext(UserContext);
  const [destinationFacilityData, setDestinationFacilityData] = useState<any>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [count, setCount] = useState(0);
  const [tempSearch, setTempSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [doUseSelectedFleetState, setDoUsSelectedFleetState] = useState(false);
  const [FleetsData, setFleetsData] = useState<any[]>([]);
  const [selectedFleet, setSelectedFleet] = useState<any>(null);

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

  const userFleets: any = userObject?.user?.fleets;
  const selectedFleetObject = userObject?.user?.selectedFleet;
  const userFleetId = selectedFleetObject
    ? selectedFleetObject?._id
    : userFleets && userFleets?.length > 0
    ? userFleets[0]?._id
    : '';
  const checkUserLoading: any = userObject?.loadingUser;
  const {loading: GetDestinationFacilityLoading} = useQuery(
    queries.GetDestinationFacilityWithSorting,
    {
      variables: {
        fleetId: doUseSelectedFleetState ? selectedFleet?._id : userFleetId,
        facilityInput: {
          searchText: searchText.trim(),
          sortColumn: sortColumn,
          sortOrder: sortOrder,
          itemsPerPage: rowsPerPage,
          pageNumber: selectedPage,
        },
      },
      skip: !session || !userObject?.user?.fleets || checkUserLoading,
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
      fetchPolicy: 'network-only',
      onCompleted: data => {
        if (data?.getDestinationFacilityWithSorting?.response?.status === 200) {
          const facilityData = data?.getDestinationFacilityWithSorting?.destinationFacilityData;
          const totalCount = data?.getDestinationFacilityWithSorting?.totalCount;
          let parsedFleetData;
          if (userFleets?.length !== 0) {
            parsedFleetData = userFleets?.map((el: any) => {
              let allowedWaste = [];
              if (el?.allowedWaste?.length > 0) {
                allowedWaste = el?.allowedWaste.map(({__typename, ...rest}) => rest);
              }
              return {
                _id: el?._id,
                name: el?.name || '',
                VAT: el?.VAT,
                permitHolderName: el?.permitHolderName,
                permitNumber: el?.permitNumber,
                permitHolderAddress: el?.permitHolderAddress,
                permitHolderContactDetails: el?.permitHolderContactDetails,
                permitHolderEmail: el?.permitHolderEmail,
                permitHolderLogo: el?.permitHolderLogo,
                prefix: el?.prefix || '',
                docketNumber: el?.docketNumber,
                createdAt: el?.createdAt,
                ownerEmail: el?.ownerEmail,
                allowedWaste: allowedWaste,
                action: null,
                membersEmails: el?.membersEmails,
              };
            });
          }
          const selectedFleetFromTableData = parsedFleetData?.find(
            el => el._id === selectedFleetObject?._id
          );
          if (parsedFleetData) {
            parsedFleetData = parsedFleetData.sort((a, b) =>
              a.name.localeCompare(b.name, undefined, {sensitivity: 'accent'})
            );
            setFleetsData(parsedFleetData);
            if (!selectedFleet) {
              if (selectedFleetFromTableData) {
                setSelectedFleet(selectedFleetFromTableData);
              } else {
                setSelectedFleet(parsedFleetData[0]);
              }
            }
          } else {
            setFleetsData([]);
          }
          const parseFacilityData = facilityData?.map(el => ({
            facilityId: el._id,
            facilityName: el.destinationFacilityName,
            facilityAuthorisationNumber: el.destinationFacilityAuthorisationNumber,
            facilityAddress: el.destinationFacilityAddress,
            facilityStreet: el.destinationFacilityStreet,
            facilityCity: el.destinationFacilityCity,
            facilityCounty: el.destinationFacilityCounty,
            facilityCountry: el.destinationFacilityCountry,
            facilityEirCode: el.destinationFacilityEircode,
            facilityLongitude: el.destinationFacilityLongitude,
            facilityLatitude: el.destinationFacilityLatitude,
            facilityIdByBusiness: el.destinationFacilityId,
          }));
          console.log(parseFacilityData, 'parseFacilityData');
          setDestinationFacilityData(parseFacilityData);
          setCount(totalCount);
        }
      },
      onError: error => {
        console.error('Error fetching destination facility data:', error);
      },
    }
  );

  const handleSelect = async (event: {target: {value: any}}) => {
    setSelectedPage(1);
    const selectedKey = event.target.value;
    const selectedObject: any = FleetsData[selectedKey];
    setSelectedFleet(selectedObject);
    setDoUsSelectedFleetState(true);
  };

  if (GetDestinationFacilityLoading || userObject?.loadingUser) {
    return <Loader />;
  }

  return (
    <>
      <div className='mx-auto'>
        <div className='grid items-center mb-5 md:grid-cols-3 lg:-mx-2'>
          <div className='flex flex-col justify-between w-full gap-4 sm:flex-row md:flex-col lg:flex-row lg:items-center md:w-fit'>
            {FleetsData.length > 1 ? (
              <select
                name='language'
                className='block max-w-md py-2 pl-3 pr-10 overflow-hidden text-sm border-gray-300 rounded-md w-fit focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-base'
                onChange={handleSelect}
              >
                {Object?.keys(FleetsData)?.map((key, index) => (
                  <option
                    value={key}
                    key={index}
                    selected={selectedFleet ? FleetsData[key]._id === selectedFleet._id : undefined}
                  >
                    {FleetsData[key]?.name}
                  </option>
                ))}
              </select>
            ) : (
              <h1 className='text-xl font-bold text-primary'>{FleetsData[0]?.name} </h1>
            )}
          </div>
          <div></div>
          <div className='flex items-center self-start justify-start my-3 md:justify-end lg:justify-end lg:mt-5 md:my-0 lg:my-5'>
            <Button
              variant='Primary'
              className='px-4 py-2 ml-0 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none'
              disabled={!FleetsData || FleetsData?.length === 0}
              onClick={() => {
                showModal(MODAL_TYPES.ADD_EDIT_FACILITY, {
                  fleetId: selectedFleet?._id,
                  FORM_TYPE: 'ADD_FACILITY',
                  showFleets: true,
                });
              }}
            >
              {t('page:addFacility')}
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
                        className='min-w-[15%] w-[15%] max-w-[15%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() =>
                          handleSortClick('destinationFacilityData.destinationFacilityId')
                        }
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('destinationFacilityData.destinationFacilityId')}
                          {t('common:facilityId')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] max-w-[15%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() =>
                          handleSortClick('destinationFacilityData.destinationFacilityName')
                        }
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('destinationFacilityData.destinationFacilityName')}
                          {t('common:facilityName')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[15%] w-[15%] max-w-[15%] text-sm font-bold text-black px-6 py-2 whitespace-nowrap text-left'
                        onClick={() =>
                          handleSortClick(
                            'destinationFacilityData.destinationFacilityAuthorisationNumber'
                          )
                        }
                      >
                        <div className='flex items-center'>
                          {renderSortArrow(
                            'destinationFacilityData.destinationFacilityAuthorisationNumber'
                          )}
                          {t('common:facilityAuthorisationNumber')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[25%] w-[25%] max-w-[25%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() =>
                          handleSortClick('destinationFacilityData.destinationFacilityAddress')
                        }
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('destinationFacilityData.destinationFacilityAddress')}
                          {t('common:facilityAddress')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[5%] w-[20%] md:w-[5%] md:max-w-[5%] text-sm font-bold text-black px-6 sm:px-0 py-2 whitespace-nowrap'
                      >
                        {t('common:actions')}
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll'>
                    {destinationFacilityData &&
                      // eslint-disable-next-line arrow-body-style
                      destinationFacilityData.map(el => {
                        return (
                          <tr key={el?.facilityId} className='w-full bg-white border-b'>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              {el?.facilityIdByBusiness}
                            </td>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-2 py-2 text-left'>
                              {el?.facilityName}
                            </td>
                            <td className='min-w-[15%] w-[15%] max-w-[15%] text-sm text-black px-6 py-2 text-left'>
                              {el?.facilityAuthorisationNumber}
                            </td>
                            <td className='min-w-[25%] w-[25%] max-w-[25%] text-left text-sm text-black px-2 py-2'>
                              {`${el.facilityAddress || ''}${
                                el.facilityAddress && el.facilityStreet ? ', ' : ''
                              }${el.facilityStreet || ''}`}
                            </td>

                            <td className='px-4 py-2 text-sm flex gap-x-2 text-black'>
                              <button
                                onClick={() => {
                                  showModal(MODAL_TYPES.ADD_EDIT_FACILITY, {
                                    ...el,
                                    fleetId: selectedFleet?._id,
                                    facilityId: el?.facilityId,
                                    FORM_TYPE: 'EDIT_FACILITY',
                                  });
                                }}
                                className='font-bold text-left text-black bg-white rounded-md hover:text-primary'
                              >
                                <PencilAltIcon className='w-5 h-5 text-left' />
                              </button>
                              <button
                                onClick={() => {
                                  showModal(MODAL_TYPES.DELETE_FACILITY, {
                                    ...el,
                                    fleetId: selectedFleet?._id,
                                    facilityId: el?.facilityId,
                                    FORM_TYPE: 'EDIT_FACILITY',
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
                {destinationFacilityData?.length === 0 ? (
                  <div className='flex px-2 text-lg text-red-700 justify-left'>
                    {t('common:no_facilities')}
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

export default FacilityPage;
