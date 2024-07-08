import {useState} from 'react';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import userQueries from '@/constants/GraphQL/User/queries';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import suggestionQueries from 'constants/GraphQL/Suggestion/queries';
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const DashboardScreen = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();
  const [totalDocketsCount, setTotalDocketsCount] = useState(0);
  const [totalBusinessCount, setTotalBusinessCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalSuggestionCount, setTotalSuggestionsCount] = useState(0);
  const [multipleCounts, setMultipleCounts] = useState<any>(null);

  const {loading} = useQuery(queries.GetAllFleetsForAdmin, {
    variables: {
      fleetsInput: {
        searchText: '',
      },
    },
    fetchPolicy: 'network-only',
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    onCompleted: data => {
      setTotalBusinessCount(data?.getAllFleetsForAdmin?.totalCount);
    },
  });

  const {loading: GetAllDocketsForAdminLoading} = useQuery(queries.GetAllDocketsByAdmin, {
    variables: {
      searchParams: {
        searchText: '',
      },
    },
    fetchPolicy: 'network-only',
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    onCompleted: data => {
      setTotalDocketsCount(parseInt(data?.getAllDocketsForAdmin?.totalCount, 10));
    },
  });
  const {loading: GetAllUsersForAdminLoading} = useQuery(userQueries.GetAllUsersForAdmin, {
    variables: {
      searchParams: {
        searchText: '',
      },
    },
    fetchPolicy: 'network-only',
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    onCompleted: data => {
      setTotalUsersCount(parseInt(data?.getAllUsersForAdmin?.totalCount, 10));
    },
  });

  const {loading: GetMultipleCollectionsTotalCountsLoading} = useQuery(
    queries.GetMultipleCollectionsTotalCountsForAdmin,
    {
      variables: {
        searchParams: {
          searchText: '',
        },
      },
      fetchPolicy: 'network-only',
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
      onCompleted: data => {
        setMultipleCounts(data?.getMultipleCollectionsTotalCountsForAdmin);
      },
    }
  );

  const {loading: GetSuggestionsLoading} = useQuery(suggestionQueries.GetSuggestions, {
    variables: {
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
    onCompleted: data => {
      setTotalSuggestionsCount(data?.getSuggestions.totalCount);
    },
  });

  if (
    loading ||
    GetAllDocketsForAdminLoading ||
    GetAllUsersForAdminLoading ||
    GetMultipleCollectionsTotalCountsLoading ||
    GetSuggestionsLoading
  ) {
    return <Loader />;
  }
  return (
    <>
      <div className='bg-white text-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:pt-2'>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            {t('common:welcome')}
          </div>
          <div className='row-span-1 mx-auto mb-0 text-5xl font-extrabold text-[#d54a30] min-h-6'>
            <img
              alt='dashboard_image'
              src='/assets/images/welcome-user.svg'
              className='w-14 h-14'
            />
          </div>
          <div className='row-span-1 min-h-9'>
            <h3 className='font-heading text-sm'>{t('common:you_are_the_admin_of')}</h3>
            <h1 className='font-bold'>Waste Docket</h1>
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            View Business
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {totalBusinessCount}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <a href={`/allFleets`} target='_blank' rel='noreferrer'>
              <Button
                type='button'
                text='View All '
                className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
              />
            </a>
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            View Dockets
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {totalDocketsCount}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <a href={`/allDockets`} target='_blank' rel='noreferrer'>
              <Button
                type='button'
                text='View All '
                className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
              />
            </a>
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            View Users
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {totalUsersCount}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <a href={`/allUsers`} target='_blank' rel='noreferrer'>
              <Button
                type='button'
                text='View All '
                className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
              />
            </a>
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            {t('page:view_suggestions')}
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {totalSuggestionCount}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <a href={`/allSuggestions`} target='_blank' rel='noreferrer'>
              <Button
                type='button'
                text='View All '
                className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
              />
            </a>
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            {t('page:delete_customers')}
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {multipleCounts?.customersCount || 0}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <Button
              type='button'
              text={t('common:delete')}
              onClick={() => {
                showModal(MODAL_TYPES.DELETE_COLLECTION_DATA_BY_ADMIN, {collection: 'Customers'});
              }}
              className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
            />
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            {t('page:delete_destination_facilities')}
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {multipleCounts?.destinationFacilitiesCount || 0}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <Button
              type='button'
              text={t('common:delete')}
              onClick={() => {
                showModal(MODAL_TYPES.DELETE_COLLECTION_DATA_BY_ADMIN, {
                  collection: 'Destination Facilities',
                });
              }}
              className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
            />
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            {t('page:delete_waste_permit_documents')}
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {multipleCounts?.wastePermitDocumentsCount || 0}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <Button
              type='button'
              text={t('common:delete')}
              onClick={() => {
                showModal(MODAL_TYPES.DELETE_COLLECTION_DATA_BY_ADMIN, {
                  collection: 'Waste Permit Documents',
                });
              }}
              className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
            />
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            {t('page:delete_invites')}
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {multipleCounts?.invitesCount || 0}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <Button
              type='button'
              text={t('common:delete')}
              onClick={() => {
                showModal(MODAL_TYPES.DELETE_COLLECTION_DATA_BY_ADMIN, {collection: 'Invites'});
              }}
              className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
            />
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            {t('page:delete_subscriptions')}
          </div>
          <div className='row-span-1 mx-auto mb-0 min-h-6'>
            <p className=' text-2xl font-extrabold my-[-0.1rem] text-mainGreen '>
              {multipleCounts?.subscriptions || 0}
            </p>
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <Button
              type='button'
              text={t('common:delete')}
              onClick={() => {
                showModal(MODAL_TYPES.DELETE_COLLECTION_DATA_BY_ADMIN, {
                  collection: 'Subscriptions',
                });
              }}
              className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
            />
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            ENV
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <a href={`/env`} target='_blank' rel='noreferrer'>
              <Button
                type='button'
                text='View Variables '
                className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
              />
            </a>
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            Finance
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <a href={`/finance`} target='_blank' rel='noreferrer'>
              <Button
                type='button'
                text='View Payments'
                className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
              />
            </a>
          </div>
        </div>
        <div className='w-full bg-gray-100 col-span-1 border border-gray-100 pt-6 pb-4 px-2 text-center shadow hover:shadow-lg hover-up-2 transition duration-500 grid min-h-[240px] h-fit items-center justify-center'>
          <div className='row-span-1 text-[#2b2b2b] text-lg uppercase font-bold mx-auto mb-0 flex flex-row items-center min-h-2'>
            {t('page:app_version')}
          </div>
          <div className='row-span-1 min-h-9 mx-auto w-40 md:w-40 lg:w-40 lg:my-1'>
            <a href={`/appVersion`} target='_blank' rel='noreferrer'>
              <Button
                type='button'
                text={t('page:app_version')}
                className='inline-flex text-xs sm:text-sm justify-center mt-1 w-full buttonBase buttonLinkFull bg-mainGreen hover:bg-green-700'
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardScreen;
