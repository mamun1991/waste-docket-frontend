import {useState} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import {useLazyQuery, useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import suggestionQuery from '@/constants/GraphQL/Suggestion/queries';
import {MailIcon} from '@heroicons/react/solid';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const DashboardScreen = () => {
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const [PendingInvitations, setPendingInvitations] = useState([]);
  const [selectedFleet, setSelectedFleet] = useState<any>(null);
  const [isFleetOwner, setIsFleetOwner] = useState(false);
  const [FleetsData, setFleetsData] = useState<any[]>([]);

  const messages = [
    t('page:You are awesome!'),
    t('page:Keep up the great work!'),
    t('page:Your progress is impressive!'),
    t('page:Have a great day!'),
    t('page:Today is your day!'),
    t('page:Keep shining brightly!'),
    t('page:You make a difference!'),
    // Add more motivational messages as needed
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  const randomMessage = messages[randomIndex];

  const {loading} = useQuery(queries.GetFleets, {
    variables: {
      fleetsInput: {
        searchText: '',
      },
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
    onCompleted: data => {
      if (data?.getFleets?.response.status === 200) {
        const fleetData = data?.getFleets?.fleetData;
        const selectedFleetId = data?.getFleets?.selectedFleet;
        setPendingInvitations(data?.getFleets?.UserPendingInvitations);
        let parsedFleetData;
        if (fleetData?.length !== 0) {
          parsedFleetData = fleetData?.map((el: any) => {
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
            };
          });
        }
        const selectedFleetFromTableData = parsedFleetData?.find(el => el._id === selectedFleetId);
        if (selectedFleetFromTableData?.ownerEmail === session?.user?.email) {
          setIsFleetOwner(true);
        }
        if (fleetData) {
          parsedFleetData = parsedFleetData.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, {sensitivity: 'accent'})
          );
          setFleetsData(parsedFleetData);
          if (selectedFleetFromTableData) {
            setSelectedFleet(selectedFleetFromTableData);
          } else {
            setSelectedFleet(parsedFleetData[0]);
          }
        } else {
          setFleetsData([]);
        }
        GetDocketsQuery();
        GetDestinationFacilityQuery();
        GetWasteCollectionPermitDocumentWithSortingQuery();
        GetCustomersQuery();
        GetSuggestionsQuery();
      }
    },
  });

  const [GetDocketsQuery, {data: GetDocketsData, loading: GetDocketsLoading}] = useLazyQuery(
    isFleetOwner ? queries.getAllDocketsByFleetId : queries.GetDocketsByFleetId,
    {
      variables: {
        fleetId: selectedFleet?._id,
        searchParams: {
          searchText: '',
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
      fetchPolicy: 'network-only',
    }
  );

  const [
    GetDestinationFacilityQuery,
    {data: GetDestinationFacility, loading: GetDestinationFacilityLoading},
  ] = useLazyQuery(queries.GetDestinationFacility, {
    variables: {
      fleetId: selectedFleet?._id,
      facilityInput: {
        searchText: '',
      },
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
  });

  const [GetCustomersQuery, {data: GetCustomers, loading: GetCustomersLoading}] = useLazyQuery(
    queries.GetCustomerContactByFleetId,
    {
      variables: {
        fleetId: selectedFleet?._id,
        customersInput: {
          searchText: '',
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
      fetchPolicy: 'network-only',
    }
  );

  const [GetSuggestionsQuery, {data: GetSuggestions, loading: GetSuggestionsLoading}] =
    useLazyQuery(suggestionQuery.GetSuggestions, {
      variables: {
        fleetId: selectedFleet?._id,
        doFetchJustCount: true,
        searchParams: {
          searchText: '',
          sortColumn: 'createdAt',
          sortOrder: 'desc',
        },
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
      fetchPolicy: 'network-only',
    });

  const [
    GetWasteCollectionPermitDocumentWithSortingQuery,
    {
      data: GetWasteCollectionPermitDocumentWithSorting,
      loading: GetWasteCollectionPermitDocumentWithSortingWithSortingLoading,
    },
  ] = useLazyQuery(queries.GetWasteCollectionPermitDocumentWithSorting, {
    variables: {
      wastePermitDocumentWithSortingInput: {
        searchText: '',
        sortColumn: 'createdAt',
        sortOrder: 'desc',
        pageNumber: 1,
        itemsPerPage: 10000,
      },
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
  });

  const handleSelect = async event => {
    const selectedKey = event.target.value;
    const selectedObject: any = FleetsData[selectedKey];
    setSelectedFleet(selectedObject);
    if (selectedObject?.ownerEmail === session?.user?.email) {
      setIsFleetOwner(true);
    } else {
      setIsFleetOwner(false);
    }
  };

  if (
    loading ||
    GetDocketsLoading ||
    GetDestinationFacilityLoading ||
    GetWasteCollectionPermitDocumentWithSortingWithSortingLoading ||
    GetCustomersLoading ||
    GetSuggestionsLoading
  ) {
    return <Loader />;
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 bg-white text-md sm:grid-cols-2 md:grid-cols-3 2xl:pt-2 pt-12'>
        <div className='col-span-1 mx-auto sm:mx-0 flex h-[240px] w-[350px] flex-row items-center sm:items-start justify-center sm:justify-start sm:w-full sm:max-w-[350px] lg:col-span-2 lg:h-[240px] lg:max-w-[960px] hover:shadow-lg hover-up-2 transition duration-500'>
          <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
            <div className='flex w-full flex-row items-center justify-start'>
              <div className='pr-2 text-2xl font-normal text-black'>{t('page:Hello')}</div>
            </div>
            <div className='flex w-full flex-row items-center justify-start font-thin text-black text-opacity-70'>
              {randomMessage}
            </div>
          </div>
        </div>
        <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
          <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
            <div className='row-span-1 mx-auto mb-0 text-5xl font-extrabold text-[#d54a30] min-h-6'>
              <img
                alt='dashboard_image'
                src={
                  !isFleetOwner
                    ? '/assets/images/welcome-driver.svg'
                    : '/assets/images/welcome-fleet.svg'
                }
                className='w-14 h-14'
              />
            </div>
            {FleetsData && FleetsData?.length === 1 ? (
              <div className='row-span-1 min-h-9'>
                {isFleetOwner ? (
                  <h3 className='text-sm text-center font-heading'>
                    {t('common:you_are_the_owner_of')}
                  </h3>
                ) : (
                  <h3 className='text-sm text-center font-heading'>
                    {t('common:you_are_the_member_of')}
                  </h3>
                )}
                <h1 className='font-bold text-center'>{FleetsData[0]?.name}</h1>
              </div>
            ) : FleetsData && FleetsData?.length > 1 ? (
              <>
                <div className='row-span-1 min-h-9'>
                  {isFleetOwner ? (
                    <h3 className='text-sm font-heading'>{t('common:you_are_the_owner_of')}</h3>
                  ) : (
                    <h3 className='text-sm font-heading'>{t('common:you_are_the_member_of')}</h3>
                  )}
                </div>
                <select
                  name='language'
                  className='block max-w-md py-1 overflow-hidden text-sm border-gray-300 rounded-md w-60 md:w-40 lg:w-60 focus:outline-none focus:ring-mainGreen focus:border-mainGreen'
                  onChange={handleSelect}
                >
                  {Object?.keys(FleetsData)?.map((key, index) => (
                    <option
                      value={key}
                      key={index}
                      selected={
                        selectedFleet ? FleetsData[key]._id === selectedFleet._id : undefined
                      }
                    >
                      {FleetsData[key]?.name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <h3 className='text-sm font-heading'>{t('page:you_have_not_any_business')}</h3>
            )}
          </div>
        </div>
        {isFleetOwner && (
          <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
              <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
                Add Driver
              </div>
              <div className='row-span-1 mx-auto mb-0 text-5xl font-extrabold text-[#d54a30] min-h-6'>
                <img
                  alt='dashboard_image'
                  src='/assets/images/adddriver.svg'
                  className='w-14 h-14'
                />
              </div>
              <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40 lg:my-1'>
                <Button
                  type='button'
                  text='Add Driver'
                  onClick={() => showModal(MODAL_TYPES.INVITE_USER_IN_FLEET, selectedFleet)}
                  className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                />
              </div>
            </div>
          </div>
        )}
        {isFleetOwner && (
          <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
              <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
                Drivers
              </div>
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {' '}
                {selectedFleet ? (
                  selectedFleet?.membersEmails?.length === 0 ? (
                    <div className='h-14'>You have no drivers</div>
                  ) : (
                    <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                      {selectedFleet?.membersEmails?.length}
                    </p>
                  )
                ) : (
                  0
                )}{' '}
              </div>
              <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40 lg:my-1'>
                <a href={`/allFleetMembers`} target='_blank' rel='noreferrer'>
                  <Button
                    type='button'
                    text='View'
                    className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                  />
                </a>
              </div>
            </div>
          </div>
        )}
        <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
          <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
            <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
              {t(`common:add_docket`)}
            </div>
            <div className='row-span-1 mx-auto mb-0 text-5xl font-extrabold text-[#d54a30] min-h-6'>
              <img alt='dashboard_image' src='/assets/images/adddocket.svg' className='w-14 h-14' />
            </div>
            {FleetsData && FleetsData?.length > 0 ? (
              <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40 lg:my-1'>
                <Button
                  type='button'
                  text={t('common:add_docket')}
                  onClick={() =>
                    showModal(MODAL_TYPES.ADD_DOCKET_DATA, {
                      ...selectedFleet,
                      fleetId: selectedFleet?._id,
                      FORM_TYPE: 'ADD_DOCKET',
                    })
                  }
                  className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                />
              </div>
            ) : (
              <h3 className='text-sm font-heading'>{t('page:you_have_not_any_business')}</h3>
            )}
          </div>
        </div>
        <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
          <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
            <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
              {t(`common:dockets`)}
            </div>
            {isFleetOwner && (
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {GetDocketsData?.getAllDocketsByFleetId?.docketData?.length === 0 ? (
                  <div className='h-14'>You have no dockets</div>
                ) : (
                  <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                    {GetDocketsData?.getAllDocketsByFleetId?.docketData?.length}
                  </p>
                )}
              </div>
            )}
            {!isFleetOwner && (
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {GetDocketsData?.getDocketsByFleetId?.docketData?.length === 0 ? (
                  <div className='h-14'>You have no dockets</div>
                ) : (
                  <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                    {GetDocketsData?.getDocketsByFleetId?.docketData?.length}
                  </p>
                )}
              </div>
            )}
            {FleetsData && FleetsData?.length > 0 ? (
              <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40'>
                <a href={'/dockets'} target='_blank' rel='noreferrer'>
                  <Button
                    type='button'
                    text={t('common:view')}
                    className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                  />
                </a>
              </div>
            ) : (
              <h3 className='text-sm font-heading'>{t('page:you_have_not_any_business')}</h3>
            )}
          </div>
        </div>
        {PendingInvitations?.length > 0 && (
          <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
              <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
                {t(`common:pending_invitations`)}
              </div>
              <div className='row-span-1 mx-auto mb-0 text-5xl font-extrabold text-[#d54a30] min-h-6'>
                <MailIcon className='w-14 h-14 text-mainGreen hover:text-green-700' />
              </div>
              <div className='row-span-1 min-h-9'>
                <h3 className='text-xs font-heading'>
                  {t('common:dashboard_pending_invitation_help')}
                </h3>
              </div>
              <div className='w-40 row-span-1 mx-auto min-h-9 w-72 md:w-40 lg:w-40'>
                <Button
                  type='button'
                  onClick={() =>
                    showModal(MODAL_TYPES.USER_PENDING_INVITATIONS, {PendingInvitations})
                  }
                  text={t('common:invitations')}
                  className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                />
              </div>
            </div>
          </div>
        )}
        {isFleetOwner && (
          <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
              <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
                {t(`common:add_customer`)}
              </div>
              <div className='row-span-1 mx-auto mb-0 text-5xl font-extrabold text-[#d54a30] min-h-6'>
                <img
                  alt='dashboard_image'
                  src='/assets/images/adddocket.svg'
                  className='w-14 h-14'
                />
              </div>

              <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40 lg:my-1'>
                <Button
                  onClick={() => {
                    showModal(MODAL_TYPES.ADD_EDIT_CUSTOMER, {
                      fleetId: selectedFleet?._id,
                      FORM_TYPE: 'ADD_CUSTOMER',
                      showFleets: true,
                    });
                  }}
                  type='button'
                  text={t('common:add_customer')}
                  className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                />
              </div>
            </div>
          </div>
        )}
        {isFleetOwner && (
          <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
              <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
                {t(`common:customers`)}
              </div>
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {GetCustomers?.getCustomerContactByFleetId?.customersData?.length === 0 ? (
                  <div className='h-14'>You have no customers</div>
                ) : (
                  <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                    {GetCustomers?.getCustomerContactByFleetId?.totalCount}
                  </p>
                )}
              </div>
              <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40'>
                <a href={`/allFleetCustomers`} target='_blank' rel='noreferrer'>
                  <Button
                    type='button'
                    text={t('common:view')}
                    className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                  />
                </a>
              </div>
            </div>
          </div>
        )}
        {isFleetOwner && (
          <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
              <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
                {t(`common:how_to`)}
              </div>
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                <div className='h-14'>Frequently Asked Questions</div>
              </div>
              <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40'>
                <a href={'/faq'} target='_blank' rel='noreferrer'>
                  <Button
                    type='button'
                    text={t('common:view_faq')}
                    className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                  />
                </a>
              </div>
            </div>
          </div>
        )}
        <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
          <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
            <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
              {t(`common:destination_facility`)}
            </div>
            {isFleetOwner && (
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {GetDestinationFacility?.getDestinationFacility.destinationFacilityData.length ===
                0 ? (
                  <div className='h-14'>You have no Facility Added</div>
                ) : (
                  <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                    {GetDestinationFacility?.getDestinationFacility.destinationFacilityData.length}
                  </p>
                )}
              </div>
            )}
            {!isFleetOwner && (
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {GetDestinationFacility?.getDestinationFacility.destinationFacilityData.length ===
                0 ? (
                  <div className='h-14'>You have no Destination Facility</div>
                ) : (
                  <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                    {GetDestinationFacility?.getDestinationFacility.destinationFacilityData.length}
                  </p>
                )}
              </div>
            )}
            {FleetsData && FleetsData?.length > 0 ? (
              <div className='w-48 row-span-1 mx-auto min-h-9 sm:w-52'>
                <a href={'/destinationFacility'} target='_blank' rel='noreferrer'>
                  <Button
                    type='button'
                    text={t('common:view')}
                    className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                  />
                </a>
              </div>
            ) : (
              <h3 className='text-sm font-heading'>{t('page:you_have_not_any_business')}</h3>
            )}
          </div>
        </div>

        <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
          <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
            <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
              {t(`common:waste_permit_documents`)}
            </div>
            {isFleetOwner && (
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {GetWasteCollectionPermitDocumentWithSorting
                  ?.getWasteCollectionPermitDocumentWithSorting?.wasteCollectionPermitDocument
                  ?.length === 0 ? (
                  <div className='h-14'>You have no documents Added</div>
                ) : (
                  <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                    {
                      GetWasteCollectionPermitDocumentWithSorting
                        ?.getWasteCollectionPermitDocumentWithSorting?.totalCount
                    }
                  </p>
                )}
              </div>
            )}
            {!isFleetOwner && (
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {GetWasteCollectionPermitDocumentWithSorting
                  ?.getWasteCollectionPermitDocumentWithSorting?.wasteCollectionPermitDocument
                  ?.length === 0 ? (
                  <p>You have no Waste Permit Document Added</p>
                ) : (
                  <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                    {
                      GetWasteCollectionPermitDocumentWithSorting
                        ?.getWasteCollectionPermitDocumentWithSorting?.totalCount
                    }
                  </p>
                )}
              </div>
            )}
            {FleetsData && FleetsData?.length > 0 ? (
              <div className='w-48 row-span-1 mx-auto min-h-9 sm:w-52'>
                <a href={'/wastePermitDocuments'} target='_blank' rel='noreferrer'>
                  <Button
                    type='button'
                    text={t('common:view')}
                    className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                  />
                </a>
              </div>
            ) : (
              <h3 className='text-sm font-heading'>{t('page:you_have_not_any_business')}</h3>
            )}
          </div>
        </div>
        <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
          <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
            <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
              {t(`common:add_suggestion`)}
            </div>
            <div className='row-span-1 mx-auto mb-0 text-5xl font-extrabold text-[#d54a30] min-h-6'>
              <img
                alt='dashboard_image'
                src='/assets/images/addSuggestion.svg'
                className='w-14 h-14'
              />
            </div>
            <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40 lg:my-1'>
              <Button
                onClick={() => {
                  showModal(MODAL_TYPES.ADD_SUGGESTION, {
                    FORM_TYPE: 'ADD_SUGGESTION',
                    email: session?.userDetails?.personalDetails?.email,
                    name: session?.userDetails?.personalDetails?.name,
                  });
                }}
                type='button'
                text={t('common:add_suggestion')}
                className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
              />
            </div>
          </div>
        </div>
        {isFleetOwner && (
          <div className='col-span-1 mx-auto flex h-[240px] w-[350px] flex-row items-center justify-start sm:w-full sm:max-w-[350px] lg:h-[240px] lg:max-w-[780px] hover:shadow-lg hover-up-2 transition duration-500'>
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md border border-black border-opacity-10 px-6 shadow-md'>
              <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
                {t(`common:suggestions`)}
              </div>
              <div className='row-span-1 mx-auto mb-0 min-h-6'>
                {GetSuggestions?.getSuggestions?.totalCount === 0 ? (
                  <div className='h-14'>{t('page:You have no suggestions')}</div>
                ) : (
                  <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
                    {GetSuggestions?.getSuggestions?.totalCount}
                  </p>
                )}
              </div>
              <div className='w-40 row-span-1 mx-auto min-h-9 md:w-40 lg:w-40'>
                <a href={`/allFleetSuggestions`} target='_blank' rel='noreferrer'>
                  <Button
                    type='button'
                    text={t('common:view')}
                    className='inline-flex justify-center w-full mt-1 text-xs sm:text-sm buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
                  />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardScreen;
