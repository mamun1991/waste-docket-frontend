import {useState} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {DocketT} from '@/types/docket';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import {
  InformationCircleIcon,
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

const FleetDocketsScreen = () => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const [DocketsData, setDocketsData] = useState<DocketT[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [searchText, setSearchText] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('docketData.date');
  const [sortOrder, setSortOrder] = useState('asc');
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

  const {loading: GetAllDocketsForAdminLoading} = useQuery(
    queries.GetAllDocketsForAdminWithSorting,
    {
      variables: {
        searchParams: {
          searchText: searchText.trim(),
          sortColumn: sortColumn,
          sortOrder: sortOrder,
          resultsPerPage: rowsPerPage,
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
        const docketData = data?.getAllDocketsForAdminWithSorting?.docketData;
        const totalCount = data?.getAllDocketsForAdminWithSorting?.totalCount;
        /* eslint-disable-next-line */
        const parsedDocketsData = docketData?.map(el => {
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
              isWaste,
              wasteDescription,
              wasteLoWCode,
              isHazardous,
              localAuthorityOfOrigin,
              wasteQuantity,
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
              customerAddress,
              customerEmail,
              customerId,
              customerStreet,
              customerCity,
              customerCounty,
              customerEircode,
              customerCountry,
            } = el.customerContact;
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
            const wasteQuantityCleaned = {
              unit: wasteQuantity?.unit,
              amount: wasteQuantity?.amount,
            };
            return {
              customerName,
              jobId,
              customerAddress,
              customerStreet,
              customerCity,
              customerCounty,
              customerEircode,
              customerCountry,
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
              isWaste,
              wasteDescription,
              wasteLoWCode,
              isHazardous,
              localAuthorityOfOrigin,
              wasteQuantity: wasteQuantityCleaned,
              collectedFromWasteFacility,
              collectionPointName,
              collectionPointAddress,
              collectionPointStreet,
              collectionPointCity,
              collectionPointCounty,
              collectionPointEircode,
              collectionPointCountry,
              destinationFacilityId,
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
              driverSignature,
              wasteFacilityRepSignature,
              customerSignature,
              isLoadForExport,
              portOfExport,
              countryOfDestination,
              facilityAtDestination,
              tfsReferenceNumber,
              additionalInformation,
              docketId: el._id,
              creatorEmail: el.creatorEmail,
              termsAndConditions: el?.fleet?.termsAndConditions,
              fleetId: el?.fleet?._id,
            };
          }
        });
        setDocketsData(parsedDocketsData);
        setCount(totalCount);
      },
    }
  );

  if (GetAllDocketsForAdminLoading) {
    return <Loader />;
  }

  return (
    <>
      <h1 className='text-xl font-bold text-primary'>All Dockets</h1>
      <div className='container'>
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
          <div className='overflow-x-auto lg:-mx-4 pb-32 w-[95vw] lg:w-[98vw] xl:w-full mx-auto'>
            <div className='inline-block h-full min-w-full py-4 md:py-0 sm:px-6 lg:px-8'>
              <div className=''>
                <table
                  className={`min-w-full sm:min-w-full md:min-w-full text-center table-fixed md:mt-5 mt-2`}
                >
                  <thead className='border-b bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black py-2 whitespace-nowrap text-left'
                      >
                        <div className='flex items-center'>{t('common:customerName')}</div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] cursor-pointer text-sm font-bold text-black px-6 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('creatorEmail')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('creatorEmail')}
                          {t('common:driverEmail')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] cursor-pointer text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                        onClick={() => handleSortClick('docketData.individualDocketNumber')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('docketData.individualDocketNumber')}
                          {t('common:docketNumber')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] cursor-pointer text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                        onClick={() => handleSortClick('docketData.vehicleRegistration')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('docketData.vehicleRegistration')}
                          {t('common:vehicleRegistration')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] cursor-pointer text-sm font-bold text-black px-4 lg:px-9 py-2 whitespace-nowrap'
                        onClick={() => handleSortClick('docketData.date')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('docketData.date')}
                          {t('common:date')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] cursor-pointer text-sm font-bold text-black pr-8 py-2 whitespace-nowrap'
                        onClick={() => handleSortClick('docketData.time')}
                      >
                        <div className='flex items-center'>
                          {renderSortArrow('docketData.time')}
                          {t('common:time')}
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('common:details')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('common:delete')}
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll'>
                    {DocketsData &&
                      // eslint-disable-next-line arrow-body-style
                      DocketsData.map((el, index) => {
                        return (
                          <tr key={index} className='w-20 bg-white border-b'>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                              {el.customerName}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-6 py-2 text-left'>
                              {el.creatorEmail}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                              {`${el.prefix}${el.docketNumber}`}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                              {el.vehicleRegistration}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-4 py-2 whitespace-nowrap'>
                              {dayjs(dayjs(el.date)).format('DD MMM YYYY')}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black pr-4 py-2'>
                              {el.time}
                            </td>
                            <td className='px-2 py-2 text-sm text-black'>
                              <button
                                onClick={() => {
                                  showModal(MODAL_TYPES.DOCKET_DETIALS, el);
                                }}
                                className='font-bold text-left text-black bg-white rounded-md hover:text-primary'
                              >
                                <InformationCircleIcon className='w-5 h-5 text-left' />
                              </button>
                            </td>
                            <td className='px-2 py-2 text-sm text-black'>
                              <button
                                className='font-bold text-left text-red-500 bg-white rounded-md hover:text-primary'
                                onClick={() => showModal(MODAL_TYPES.DELETE_DOCKET_ADMIN, el)}
                              >
                                <TrashIcon className='w-6 h-6 text-left' />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {DocketsData?.length === 0 ? (
                  <div className='flex justify-center mt-5 text-2xl text-gray-500'>
                    {t('common:no_data')}
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

export default FleetDocketsScreen;
