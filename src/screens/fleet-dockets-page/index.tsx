import {useEffect, useState, useRef} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import {useRouter} from 'next/router';
import {DocketT} from '@/types/docket';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import createWorksheet from '@/utils/createWorksheet';
import {ChevronDownIcon, InformationCircleIcon} from '@heroicons/react/solid';
import {Menu, Transition} from '@headlessui/react';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

interface FleetData {
  __typename: string;
  _id: string;
  isIndividual: boolean;
  name: string;
  VAT: string;
  permitNumber: string;
  ownerEmail: string;
  membersEmails: any[];
  invitations: any[];
}

const FleetDocketsScreen = () => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const router = useRouter();
  const [FleetsData, setFleetsData] = useState<FleetData | null>(null);
  const [DocketsData, setDocketsData] = useState<DocketT[]>([]);
  const [pageNumberList, setPageNumberList] = useState<number[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [searchText, setSearchText] = useState('');
  const searchInputText = useRef('');
  const fleetId = router?.query?.id;

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

  const {data: GetAllDocketsByFleetId, loading: GetAllDocketsByFleetIdLoading} = useQuery(
    queries.getAllDocketsByFleetId,
    {
      variables: {
        fleetId: fleetId,
        searchParams: {
          searchText: searchText,
          resultsPerPage: rowsPerPage,
          pageNumber: selectedPage,
          startDate,
          endDate,
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
    const docketData = GetAllDocketsByFleetId?.getAllDocketsByFleetId?.docketData;
    const totalCount = GetAllDocketsByFleetId?.getAllDocketsByFleetId?.totalCount;
    /* eslint-disable-next-line */
    const parsedDocketsData = docketData?.map(el => {
      if (el?.docketData) {
        const {
          individualDocketNumber,
          jobId,
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
        } = el.docketData;
        const {
          customerName,
          customerPhone,
          permitNumber,
          permitHolderAddress,
          permitHolderContactDetails,
          permitHolderLogo,
          permitHolderEmail,
          customerId,
        } = el.customerContact;
        const wasteQuantityCleaned = {
          unit: wasteQuantity?.unit,
          amount: wasteQuantity?.amount,
        };
        return {
          customerName,
          customerPhone,
          customerId,
          jobId,
          permitNumber,
          permitHolderAddress,
          permitHolderContactDetails,
          permitHolderLogo,
          permitHolderEmail,
          individualDocketNumber,
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
          fleetId,
          creatorEmail: el.creatorEmail,
        };
      }
    });
    setDocketsData(parsedDocketsData);
    const totalPagesCalculated = totalCount && Math.ceil(totalCount / rowsPerPage);
    setTotalPages(totalPagesCalculated);
  }, [GetAllDocketsByFleetId]);

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

  if (loadingGetFleetById || GetAllDocketsByFleetIdLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className='flex items-center justify-between'>
        {FleetsData && <h1 className='text-xl font-bold text-primary'>{FleetsData?.name} </h1>}
        <div className='my-3 lg:mt-5 md:my-0 lg:my-5 w-44'>
          <Button
            variant='Primary'
            className='px-4 py-2 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none'
            onClick={() => {
              (async () => {
                await createWorksheet(DocketsData);
              })();
              // XLSX.writeFile(workbook, `DocketsData.xlsx`);
            }}
          >
            {t('common:export_data')}
          </Button>
        </div>
      </div>
      <div className='container'>
        <div className='grid items-center py-4 mb-5 w-fit'>
          <div className='flex flex-col justify-between w-full gap-4 sm:flex-row md:flex-col lg:flex-row lg:items-center md:w-fit'>
            <div className='flex items-center justify-start gap-y-4'>
              <input
                type='text'
                id='filter'
                name='filter'
                onChange={event => {
                  searchInputText.current = event.target.value;
                }}
                className='w-full text-sm text-gray-500 border-gray-300 rounded-md md:w-auto'
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

        <div className='relative flex flex-wrap items-center justify-start w-full gap-2 mb-3 md:justify-between'>
          <div className='flex flex-col gap-4 font-semibold sm:flex-row lg:gap-6'>
            <div className='flex items-center gap-2 whitespace-nowrap'>
              <label htmlFor='start-date'>Start Date: </label>
              <input
                type='date'
                name='start-date'
                id='start-date'
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className='py-1 text-gray-500 border-gray-500 rounded-sm focus:ring-0 w-36 lg:w-full'
                required
                onKeyDown={e => e.preventDefault()}
              />
            </div>
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
          <div className='overflow-x-auto lg:-mx-4 pb-32 w-[95vw] lg:w-[98vw] xl:w-full mx-auto'>
            <div className='inline-block h-full min-w-full py-4 md:py-0 sm:px-6 lg:px-8'>
              <div className=''>
                <table
                  className={
                    pageNumberList.length === 0
                      ? `min-w-full sm:min-w-full md:min-w-full text-center table-fixed md:mt-5 mt-0`
                      : `min-w-full sm:min-w-full md:min-w-full text-center table-fixed md:mt-5 mt-2`
                  }
                >
                  <thead className='border-b bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                      >
                        {t('common:customerName')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-6 py-2 whitespace-nowrap text-left'
                      >
                        {t('common:driverEmail')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                      >
                        {t('common:docketNumber')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('common:vehicleRegistration')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%]  text-sm font-bold text-black px-8 py-2 whitespace-nowrap'
                      >
                        {t('common:date')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-8 py-2 whitespace-nowrap'
                      >
                        {t('common:time')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('common:action')}
                      </th>
                      <th
                        scope='col'
                        className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 whitespace-nowrap'
                      >
                        {t('common:details')}
                      </th>
                    </tr>
                  </thead>

                  <tbody className='overflow-y-scroll'>
                    {DocketsData &&
                      // eslint-disable-next-line arrow-body-style
                      DocketsData.map(el => {
                        return (
                          <tr key={el.customerName} className='w-20 bg-white border-b'>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'>
                              {el.customerName}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-6 py-2 text-left'>
                              {el.creatorEmail}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                              {el.individualDocketNumber}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2'>
                              {el.vehicleRegistration}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-8 py-2 whitespace-nowrap'>
                              {dayjs(dayjs(el.date)).format('DD MMM YYYY')}
                            </td>
                            <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-8 py-2'>
                              {el.time}
                            </td>
                            <td className='px-2 py-2 text-sm text-black'>
                              <button className='px-4 py-2 font-bold text-black bg-white rounded-md hover:text-red-600'>
                                <div className='relative'>
                                  <Menu as='div' className={'relative my-auto'}>
                                    <Menu.Button
                                      className={
                                        'm-auto border border-gray-300 rounded-lg w-7 h-7 hover:bg-gray-200 hover:bg-opacity-60 shadow-md z-10 '
                                      }
                                    >
                                      <ChevronDownIcon
                                        className={'w-6 h-6 text-gray-400 duration-300'}
                                      />
                                    </Menu.Button>
                                    <Transition
                                      enter='transition ease-out duration-100'
                                      enterFrom='transform opacity-0 scale-95'
                                      enterTo='transform opacity-100 scale-100'
                                      leave='transition ease-in duration-75'
                                      leaveFrom='transform opacity-100 scale-100'
                                      leaveTo='transform opacity-0 scale-95'
                                      className={'absolute p-2 rounded-lg right-0 bg-white z-50'}
                                    >
                                      <Menu.Items className='z-50 flex flex-col gap-2'>
                                        <Menu.Item>
                                          <Menu.Button
                                            onClick={() =>
                                              showModal(MODAL_TYPES.ADD_DOCKET_DATA, {
                                                ...el,
                                                FORM_TYPE: 'EDIT_DOCKET',
                                              })
                                            }
                                            className='p-1 px-3 text-xs text-white border rounded-md shadow-sm border-primary bg-primary font-small active:opacity-75'
                                          >
                                            {t('common:edit')}
                                          </Menu.Button>
                                        </Menu.Item>
                                        <Menu.Item>
                                          <Menu.Button
                                            onClick={() => showModal(MODAL_TYPES.DELETE_DOCKET, el)}
                                            className='p-1 px-3 text-xs text-white bg-red-400 border border-red-400 rounded-md shadow-sm font-small active:opacity-75'
                                          >
                                            {t('common:delete')}
                                          </Menu.Button>
                                        </Menu.Item>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                </div>
                              </button>
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
