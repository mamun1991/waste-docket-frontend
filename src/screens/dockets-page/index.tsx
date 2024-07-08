import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {convert} from 'html-to-text';
import {marked} from 'marked';
import useTranslation from 'next-translate/useTranslation';
import {useState, useContext} from 'react';
import {useSession} from 'next-auth/react';
import {UserContext} from '@/context/user';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import {
  InformationCircleIcon,
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  ArrowSmRightIcon,
  PencilAltIcon,
  TrashIcon,
  ArrowCircleRightIcon,
  DownloadIcon,
  PencilIcon,
} from '@heroicons/react/solid';
import Button from '@/components/shared/Button';
import {DocketT} from '@/types/docket';
import Loader from '@/components/shared/Loader/Loader';
import {MODAL_TYPES} from 'constants/context/modals';
import DocketPDFDownload from './DocketPDFDownload';
import Link from 'next/link';
import {ArrowUTurnRightIcon} from '@/constants';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

function markdownToText(markdownText) {
  if (!markdownText) return '';
  const markDown = marked(markdownText);
  return convert(markDown, {wordwrap: false});
}

const DocketScreen = () => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const userObject = useContext(UserContext);
  const [isOwner, setIsOwner] = useState(false);
  const [sortColumn, setSortColumn] = useState('docketData.date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [startDate, setStartDate] = useState('');
  const [doUseStartDateState, setDoUseStartDateState] = useState(false);
  const [doUseSelectedFleetState, setDoUsSelectedFleetState] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<any>(null);
  const [FleetsData, setFleetsData] = useState<any[]>([]);
  const [tempSearch, setTempSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [DocketsData, setDocketsData] = useState<DocketT[]>([]);
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

  const userFleets: any = userObject?.user?.fleets;
  const selectedFleetObject = userObject?.user?.selectedFleet;
  const checkIsOwner = selectedFleetObject
    ? selectedFleetObject?.ownerEmail === session?.user?.email
    : userFleets && userFleets?.length > 0
    ? userFleets[0]?.ownerEmail === session?.user?.email
    : false;
  const userFleetId = selectedFleetObject
    ? selectedFleetObject?._id
    : userFleets && userFleets?.length > 0
    ? userFleets[0]?._id
    : '';
  const checkUserLoading: any = userObject?.loadingUser;
  const {loading: GetDocketsByFleetIdLoading} = useQuery(
    checkIsOwner
      ? queries.getAllDocketsByFleetIdWithPagination
      : queries.GetDocketsByFleetIdWithSorting,
    {
      variables: {
        fleetId: doUseSelectedFleetState ? selectedFleet?._id : userFleetId,
        searchParams: {
          searchText,
          resultsPerPage: rowsPerPage,
          pageNumber: selectedPage,
          sortColumn: sortColumn,
          sortOrder: sortOrder,
          startDate: checkIsOwner
            ? doUseStartDateState
              ? startDate
              : dayjs(userObject?.user?.createdAt).format('YYYY-MM-DD')
            : currentDate,
          endDate,
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
      skip: !session || !userObject?.user?.fleets || checkUserLoading,
      fetchPolicy: 'network-only',
      onCompleted: data => {
        console.log('GetDockets ===> query loading,');
        let docketData =
          data?.[
            checkIsOwner ? 'getAllDocketsByFleetIdWithSorting' : 'getDocketsByFleetIdWithSorting'
          ]?.docketData;
        let totalCount =
          data?.[
            checkIsOwner ? 'getAllDocketsByFleetIdWithSorting' : 'getDocketsByFleetIdWithSorting'
          ]?.totalCount;
        console.log(totalCount);

        setCount(totalCount);
        let fleet =
          data?.[
            checkIsOwner ? 'getAllDocketsByFleetIdWithSorting' : 'getDocketsByFleetIdWithSorting'
          ]?.fleet;
        fleet = {
          ...fleet,
          termsAndConditions: markdownToText(fleet?.termsAndConditions),
        };
        let parsedFleetData;
        if (userFleets?.length !== 0) {
          parsedFleetData = userFleets?.map((el: any) => {
            let allowedWaste = [];
            if (el?.allowedWaste.length > 0) {
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
              termsAndConditions: fleet?.termsAndConditions,
            };
          });
        }
        const selectedFleetFromTableData = parsedFleetData?.find(
          el => el._id === selectedFleetObject?._id
        );
        if (selectedFleetFromTableData?.ownerEmail === session?.user?.email) {
          setIsOwner(true);
        }
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
        const parsedDocketsData = docketData?.map(el => {
          const docketId = el?._id;
          if (el?.docketData) {
            const {
              individualDocketNumber,
              jobId,
              prefix,
              docketNumber,
              gpsOn,
              longitude,
              latitude,
              date,
              time,
              vehicleRegistration,
              generalPickupDescription,
              nonWasteLoadPictures,
              isWaste,
              wastes,
              collectedFromWasteFacility,
              collectionPointName,
              collectionPointAddress,
              collectionPointStreet,
              collectionPointCity,
              collectionPointCounty,
              collectionPointEircode,
              collectionPointCountry,
              driverSignature,
              wasteFacilityRepSignature,
              customerSignature,
              isLoadForExport,
              portOfExport,
              countryOfDestination,
              facilityAtDestination,
              tfsReferenceNumber,
              additionalInformation,
            } = el.docketData;
            const {
              customerName,
              customerPhone,
              customerAddress,
              customerEmail,
              customerId,
              customerStreet,
              customerCity,
              customerCounty,
              customerEircode,
              customerCountry,
            } = el?.customerContact;
            const {
              destinationFacilityLatitude,
              destinationFacilityLongitude,
              destinationFacilityName,
              destinationFacilityAuthorisationNumber,
              destinationFacilityAddress,
              destinationFacilityStreet,
              destinationFacilityCity,
              destinationFacilityCounty,
              destinationFacilityEircode,
              destinationFacilityCountry,
              destinationFacilityId,
            } = el?.destinationFacility?.destinationFacilityData ?? {};

            return {
              customerName,
              customerPhone,
              jobId,
              customerAddress,
              customerStreet,
              customerCity,
              customerCounty,
              customerEircode,
              customerCountry: customerCountry || 'Ireland',
              customerEmail,
              customerId,
              individualDocketNumber,
              prefix,
              docketNumber,
              gpsOn,
              longitude,
              latitude,
              date,
              time,
              vehicleRegistration,
              generalPickupDescription,
              nonWasteLoadPictures,
              isWaste,
              wastes,
              collectedFromWasteFacility,
              collectionPointName,
              collectionPointAddress,
              collectionPointStreet: collectionPointStreet || '',
              collectionPointCity: collectionPointCity || '',
              collectionPointCounty: collectionPointCounty || '',
              collectionPointEircode,
              collectionPointCountry: collectionPointCountry || 'Ireland',
              destinationFacilityLatitude,
              destinationFacilityLongitude,
              destinationFacilityName,
              destinationFacilityAuthorisationNumber,
              destinationFacilityAddress,
              destinationFacilityStreet,
              destinationFacilityCity,
              destinationFacilityCounty,
              destinationFacilityEircode,
              destinationFacilityId,
              destinationFacilityCountry: destinationFacilityCountry || 'Ireland',
              driverSignature,
              wasteFacilityRepSignature,
              customerSignature,
              isLoadForExport,
              portOfExport,
              countryOfDestination,
              facilityAtDestination,
              tfsReferenceNumber,
              additionalInformation,
              creatorEmail: el.creatorEmail,
              driverName:
                session?.user?.email === el?.creatorEmail
                  ? session?.userDetails?.personalDetails?.name
                  : el?.user?.personalDetails?.name,
              driverEmail:
                session?.user?.email === el?.creatorEmail
                  ? session?.userDetails?.personalDetails?.email
                  : el?.user?.personalDetails?.email,
              permitHolderName: fleet?.permitHolderName,
              permitHolderAddress: fleet?.permitHolderAddress,
              permitHolderContactDetails: fleet?.permitHolderContactDetails,
              permitHolderEmail: fleet?.permitHolderEmail,
              permitHolderLogo: fleet?.permitHolderLogo,
              permitNumber: fleet?.permitNumber,
              fleetName: fleet?.name,
              fleetId: fleet?._id,
              termsAndConditions: fleet?.termsAndConditions,
              docketId,
              VAT: fleet?.VAT,
              createdAt: el?.createdAt,
            };
          }
        });
        console.log('GetDockets ===> query loading, parsedDocketsData ==>', parsedDocketsData);
        setDocketsData(parsedDocketsData);
      },
      onError: error => {
        console.error('Error fetching dockets data:', error);
      },
    }
  );

  const handleSelect = async event => {
    setSelectedPage(1);
    const selectedKey = event.target.value;
    const selectedObject: any = FleetsData[selectedKey];
    setSelectedFleet(selectedObject);
    setDoUsSelectedFleetState(true);
    if (selectedObject?.ownerEmail === session?.user?.email) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  };

  if (userObject?.loadingUser || GetDocketsByFleetIdLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-wrap items-center justify-between mb-5'>
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
          <div className='w-full flex flex-col sm:flex-row items-start sm:items-center sm:self-end justify-start sm:my-3 mt-3 md:justify-end lg:justify-end md:my-0 lg:my-5'>
            <Button
              variant='Primary'
              className='px-4 py-2 mt-2 ml-0 font-medium rounded-lg shadow-sm w-full sm:w-44 sm:text-white text-md focus:outline-none'
              disabled={!FleetsData || FleetsData?.length === 0}
              onClick={() =>
                showModal(MODAL_TYPES.ADD_DOCKET_DATA, {
                  ...selectedFleet,
                  fleetId: selectedFleet?._id,
                  FORM_TYPE: 'ADD_DOCKET',
                  refreshPageAfterOperation: true,
                })
              }
            >
              {t('common:add_docket')}
            </Button>
            <Button
              variant='Primary'
              className='px-4 py-2 mt-2 sm:ml-5 font-medium rounded-lg shadow-sm w-full sm:w-44 sm:text-white text-md focus:outline-none'
              disabled={!DocketsData || DocketsData?.length === 0}
              onClick={async () => {
                showModal(MODAL_TYPES.EXPORT_DOCKET_DATA, {
                  fleetId: selectedFleet?._id,
                  accessToken: session?.accessToken,
                  isOwner: isOwner,
                  searchParams: {
                    searchText: searchText,
                    startDate: doUseStartDateState
                      ? startDate
                      : dayjs(userObject?.user?.createdAt).format('YYYY-MM-DD'),
                    endDate: endDate,
                  },
                });
              }}
            >
              {t('common:export_data')}
            </Button>
            <Button
              variant='Primary'
              className='w-full sm:w-72 px-4 py-2 mt-2 sm:ml-5 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none'
              disabled={!DocketsData || DocketsData?.length === 0}
              onClick={async () => {
                showModal(MODAL_TYPES.EXPORT_ANNUAL_ENVIRONMENTAL_DATA, {
                  fleetId: selectedFleet?._id,
                  accessToken: session?.accessToken,
                  fleetName: selectedFleet?.name,
                  searchParams: {
                    searchText: searchText,
                    startDate: doUseStartDateState
                      ? startDate
                      : dayjs(userObject?.user?.createdAt).format('YYYY-MM-DD'),
                    endDate: endDate,
                  },
                });
              }}
            >
              {t('page:Annual Environmental Report')}
            </Button>
          </div>
        </div>

        <div className='relative flex flex-wrap items-center justify-start w-full gap-2 mb-3 md:justify-between'>
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
          <div className='flex flex-col gap-4 font-semibold sm:flex-row lg:gap-6'>
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
            <div className='flex items-center gap-2 whitespace-nowrap'>
              {isOwner ? (
                <>
                  <label htmlFor='start-date'>Start Date: </label>
                  <input
                    type='date'
                    name='start-date'
                    id='start-date'
                    value={
                      doUseStartDateState
                        ? startDate
                        : dayjs(userObject?.user?.createdAt).format('YYYY-MM-DD')
                    }
                    onChange={e => {
                      setStartDate(e.target.value);
                      setDoUseStartDateState(true);
                    }}
                    className='py-1 text-gray-500 border-gray-500 rounded-sm focus:ring-0 w-36 lg:w-full'
                    required
                    onKeyDown={e => e.preventDefault()}
                  />
                </>
              ) : (
                <input
                  type='date'
                  name='start-date'
                  id='start-date'
                  value={currentDate}
                  onChange={e => setCurrentDate(e.target.value)}
                  className='hidden py-1 text-gray-500 border-gray-500 rounded-sm focus:ring-0 w-36 lg:w-full'
                  required
                  onKeyDown={e => e.preventDefault()}
                />
              )}
            </div>
            {isOwner && (
              <div className='flex items-center gap-2 whitespace-nowrap'>
                <label htmlFor='end-date'>End Date: </label>
                <input
                  type='date'
                  name='end-date'
                  id='end-date'
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className='py-1 ml-2 text-gray-500 border-gray-500 rounded-sm focus:ring-0 w-36 lg:w-full sm:ml-0'
                  required
                  onKeyDown={e => e.preventDefault()}
                />
              </div>
            )}
          </div>
        </div>

        {count && count > 25 && (
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
        )}

        <div>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-4 md:py-0 sm:px-6 lg:px-8'>
              <div className=''>
                <table
                  className={
                    count === 0
                      ? `min-w-full sm:min-w-full md:min-w-full lg:w-full text-center table-fixed md:mt-5 mt-0`
                      : `min-w-full sm:min-w-full md:min-w-full lg:w-full text-center table-fixed md:mt-5 mt-2`
                  }
                >
                  <thead className='border-b bg-gray-50'>
                    <tr className='w-full hidden sm:grid grid-cols-3 sm:grid-cols-8 bg-white border-b'>
                      <th
                        className='col-span-1 w-full text-sm font-bold text-black cursor-pointer py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('docketData.individualDocketNumber')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('docketData.individualDocketNumber')}
                          {t('page:docket')}
                        </div>
                      </th>
                      <th className='col-span-2 w-full text-sm font-bold text-black py-2 whitespace-nowrap text-left'>
                        <div className='flex items-center'>{t('common:customerName')}</div>
                      </th>
                      <th
                        className='col-span-2 w-full cursor-pointer text-sm font-bold text-black py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('creatorEmail')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('creatorEmail')}
                          {t('common:details')}
                        </div>
                      </th>
                      <th className='col-span-1 text-left w-full text-sm font-bold text-black px-2 py-2 whitespace-nowrap'>
                        {t('common:waste')}
                      </th>
                      <th className='col-span-2 text-left w-full text-sm font-bold text-black px-2 py-2 whitespace-nowrap'>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll '>
                    {DocketsData &&
                      // eslint-disable-next-line arrow-body-style
                      DocketsData.map((el, index) => {
                        return (
                          <tr
                            key={index}
                            className='w-full grid grid-cols-1 sm:grid-cols-8 bg-white border-t'
                          >
                            <td className='col-span-1 w-full text-sm text-black px-2 py-1 sm:py-2 flex flex-row'>
                              <span className='flex sm:hidden mr-2'>Docket Number: </span>
                              {`${el.prefix}${el.docketNumber}`}
                            </td>
                            <td className='col-span-2 w-full text-sm text-black px-2 py-1 sm:py-2 text-left flex flex-row'>
                              <span className='flex sm:hidden mr-2'>Customer Name: </span>
                              {el.customerName}
                            </td>
                            <td className='col-span-2 w-full text-sm text-black px-2 py-1 sm:py-2 text-left break-all flex flex-col'>
                              <p>
                                <span className='font-bold'>{t('page:creator')}</span>:{' '}
                                {el?.creatorEmail}
                              </p>
                              {el?.vehicleRegistration && (
                                <p>
                                  <span className='font-bold'>{t('page:vehicle')}</span>:{' '}
                                  {el.vehicleRegistration && <span>{el.vehicleRegistration}</span>}
                                </p>
                              )}
                              <p>
                                <span className='font-bold'>{t('page:collection')}</span>:{' '}
                                {el?.date && el?.time
                                  ? dayjs(`${el.date} ${el.time}`, 'YYYY-MM-DD HH:mm').format(
                                      'MMM DD, YYYY hh:mm A'
                                    )
                                  : ''}
                              </p>
                              <p>
                                <span className='font-bold'>{t('page:creation')}</span>:{' '}
                                {el.createdAt !== null && el.createdAt !== undefined
                                  ? dayjs(
                                      ((el.createdAt as unknown as number) / 1000) * 1000,
                                      dayjs.tz.guess()
                                    ).format('MMM DD, YYYY hh:mm A')
                                  : ''}
                              </p>
                            </td>
                            <td className='col-span-1 w-full px-2 py-1 sm:py-2 text-sm text-black text-left flex flex-row'>
                              <span className='flex sm:hidden mr-2'>Is Waste: </span>
                              {el.isWaste ? 'Yes' : 'No'}
                            </td>
                            <td className='col-span-2 w-full px-2 py-2 text-sm text-black'>
                              <div className='flex flex-col items-center justify-center gap-x-3'>
                                <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                  <button
                                    onClick={() => {
                                      showModal(MODAL_TYPES.DOCKET_DETIALS, {
                                        ...el,
                                        fleetId: selectedFleet?._id,
                                        termsAndConditions: selectedFleet?.termsAndConditions,
                                      });
                                    }}
                                    className='flex flex-row gap-2 items-start justify-center  text-sm text-black bg-white rounded-md hover:text-primary'
                                  >
                                    <InformationCircleIcon className='w-5 h-5 text-left' />
                                    Information
                                  </button>
                                </div>
                                <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                  <Link
                                    href={`/docket/${el.docketId}`}
                                    className='flex flex-row gap-2 items-start justify-center'
                                  >
                                    <ArrowCircleRightIcon className='w-5 h-5 text-left' />
                                    Details
                                  </Link>
                                </div>
                                <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                  <div
                                    className='flex flex-row gap-2 items-start cursor-pointer'
                                    onClick={() => DocketPDFDownload.GeneratePDFFile(el)}
                                  >
                                    <DownloadIcon className='w-5 h-5 text-left' />
                                    <span>Download PDF</span>
                                  </div>
                                </div>
                                <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                  <button
                                    onClick={() => {
                                      showModal(MODAL_TYPES.FORWARD_DOCKET, {
                                        ...el,
                                        fleetId: selectedFleet?._id,
                                      });
                                    }}
                                    className='flex flex-row gap-2 items-start justify-center text-black bg-white rounded-md hover:text-primary'
                                  >
                                    <ArrowUTurnRightIcon />
                                    Forward
                                  </button>
                                </div>
                                {!isOwner && !el?.customerSignature && (
                                  <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                    <button
                                      onClick={() => {
                                        showModal(MODAL_TYPES.ADD_DOCKET_SIGNATURE, {
                                          ...el,
                                          fleetId: selectedFleet?._id,
                                          FORM_TYPE: 'customer_signature',
                                          refreshPageAfterOperation: true,
                                        });
                                      }}
                                      className='flex flex-row gap-2 items-start justify-center text-sm text-black bg-white rounded-md hover:text-primary'
                                    >
                                      <PencilIcon className='w-5 h-5 text-left' />
                                      {t('page:customer_signature')}
                                    </button>
                                  </div>
                                )}
                                {!isOwner && !el?.wasteFacilityRepSignature && (
                                  <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                    <button
                                      onClick={() => {
                                        showModal(MODAL_TYPES.ADD_DOCKET_SIGNATURE, {
                                          ...el,
                                          fleetId: selectedFleet?._id,
                                          FORM_TYPE: 'destination_signature',
                                          refreshPageAfterOperation: true,
                                        });
                                      }}
                                      className='flex flex-row gap-2 items-start justify-center text-sm text-black bg-white rounded-md hover:text-primary'
                                    >
                                      <PencilIcon className='w-5 h-5 text-left' />
                                      {t('page:destination_signature')}
                                    </button>
                                  </div>
                                )}
                                {!isOwner && !el?.driverSignature && (
                                  <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                    <button
                                      onClick={() => {
                                        showModal(MODAL_TYPES.ADD_DOCKET_SIGNATURE, {
                                          ...el,
                                          fleetId: selectedFleet?._id,
                                          FORM_TYPE: 'driver_signature',
                                          refreshPageAfterOperation: true,
                                        });
                                      }}
                                      className='flex flex-row gap-2 items-start justify-center text-sm text-black bg-white rounded-md hover:text-primary'
                                    >
                                      <PencilIcon className='w-5 h-5 text-left' />
                                      {t('page:driver_signature')}
                                    </button>
                                  </div>
                                )}
                                {isOwner && (
                                  <>
                                    <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                      <button
                                        onClick={() => {
                                          showModal(MODAL_TYPES.ADD_DOCKET_DATA, {
                                            ...el,
                                            fleetId: selectedFleet?._id,
                                            FORM_TYPE: 'EDIT_DOCKET',
                                            refreshPageAfterOperation: true,
                                          });
                                        }}
                                        className='flex flex-row gap-2 items-start justify-center text-sm text-black bg-white rounded-md hover:text-primary'
                                      >
                                        <PencilAltIcon className='w-5 h-5 text-left' />
                                        Edit
                                      </button>
                                    </div>
                                    <div className='flex flex-col items-start justify-center w-full h-full text-sm'>
                                      <button
                                        onClick={() => {
                                          showModal(MODAL_TYPES.DELETE_DOCKET, el);
                                        }}
                                        className='flex flex-row gap-2 items-start justify-center text-red-500 bg-white rounded-md hover:text-primary'
                                      >
                                        <TrashIcon className='w-5 h-5 text-left' />
                                        Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {!DocketsData || DocketsData?.length === 0 ? (
                  <div className='flex px-2 text-lg text-red-700 justify-left'>
                    {t('common:no_dockets')}
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

export default DocketScreen;
