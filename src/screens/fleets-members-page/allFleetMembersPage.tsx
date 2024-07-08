import {useContext, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useQuery, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import Loader from '@/components/shared/Loader/Loader';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import queries from 'constants/GraphQL/Fleet/queries';
import useTranslation from 'next-translate/useTranslation';
import ErrorMessage from '@/components/shared/ErrorMessage';
import InformationalMessage from '@/components/shared/InformationalMessage';
import Button from '@/components/shared/Button';
import MembersTable from './MembersTable';
import PendingInvitesTable from './PendingInvitesTable';
import {UserContext} from '@/context/user';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

interface MemberData {
  _id: string;
  accountType: string;
  isSignUpComplete: boolean;
  personalDetails: {
    name: boolean;
    email: boolean;
  };
}

interface FleetData {
  __typename: string;
  _id: string;
  isIndividual: boolean;
  name: string;
  VAT: string;
  permitNumber: string;
  ownerEmail: string;
  membersEmails: any[];
  invitations: Invitation[];
}

interface Invitation {
  __typename: string;
  _id: string;
  inviteeEmail: string;
  fleetName: string;
  status: string;
  createdAt: string;
}

const AllFleetMembersPage = () => {
  const {t} = useTranslation();
  const userObject = useContext(UserContext);
  const router = useRouter();
  const [RemoveUserInFleet] = useMutation(mutations.RemoveUserInFleet);
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();
  const [fleetsData, setFleetsData] = useState<FleetData | null | any>(null);
  const [membersData, setMembersData] = useState<MemberData[]>([]);
  const [pendingInvitationData, setPendingInvitationData] = useState<Invitation[]>([]);
  const [membersPageNumber, setMembersPageNumber] = useState<number>(1);
  const [membersRowsPerPage, setMembersRowsPerPage] = useState<number>(5);
  const [pendingMembersPageNumber, setPendingMembersPageNumber] = useState<number>(1);
  const [pendingMembersRowsPerPage, setPendingMembersRowsPerPage] = useState<number>(5);
  const [membersCount, setMembersCount] = useState(0);
  const [pendingMembersCount, setPendingMembersCount] = useState(0);
  const [memberSortColumn, setMemberSortColumn] = useState('cratedAt');
  const [membersSortOrder, setMembersSortOrder] = useState('desc');
  const [pendingMembersSortColumn, setPendingMembersSortColumn] = useState('createdAt');
  const [pendingMembersSortOrder, setPendingMembersSortOrder] = useState('desc');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isMemberTableSelected, setIsMemberTableSelected] = useState(true);
  const [selectedFleet, setSelectedFleet] = useState<any>(null);
  const [doUseSelectedFleetState, setDoUsSelectedFleetState] = useState(false);

  const userFleets: any = userObject?.user?.fleets;
  const selectedFleetObject = userObject?.user?.selectedFleet;
  const userFleetId = selectedFleetObject
    ? selectedFleetObject?._id
    : userFleets && userFleets?.length > 0
    ? userFleets[0]?._id
    : '';
  const checkUserLoading: any = userObject?.loadingUser;
  const {loading: loadingGetFleetById} = useQuery(queries.GetFleetMemebersByIdWithSorting, {
    variables: {
      fleetId: doUseSelectedFleetState ? selectedFleet?._id : userFleetId,
      memberInputParams: {
        doGetMembers: isMemberTableSelected,
        membersPageNumber: membersPageNumber,
        membersItemsPerPage: membersRowsPerPage,
        pendingMembersPageNumber: pendingMembersPageNumber,
        pendingMembersItemsPerPage: pendingMembersRowsPerPage,
        memberSortColumn: memberSortColumn,
        membersSortOrder: membersSortOrder,
        pendingMembersSortColumn: pendingMembersSortColumn,
        pendingMembersSortOrder: pendingMembersSortOrder,
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
      if (data?.getFleetMembersByIdWithSorting?.response?.status === 200) {
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
              prefix: el?.prefix,
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
        if (isMemberTableSelected) {
          setMembersData(data?.getFleetMembersByIdWithSorting?.membersData);
          const membersCount = data?.getFleetMembersByIdWithSorting?.membersCount;
          setMembersCount(membersCount);
        } else {
          setPendingInvitationData(data?.getFleetMembersByIdWithSorting?.pendingFleetInvitations);
          const pendingFleetInvitationsCount =
            data?.getFleetMembersByIdWithSorting?.pendingFleetInvitationsCount;
          setPendingMembersCount(pendingFleetInvitationsCount);
        }
      }
    },
    onError: error => {
      console.error('Error fetching drivers data:', error);
    },
  });
  const handleUserRemoveInFleet = async (user: MemberData) => {
    const {email} = user.personalDetails;
    try {
      setSubmitting(true);
      const response = await RemoveUserInFleet({
        variables: {
          fleetId: selectedFleet?._id,
          email: email,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      setSubmitting(false);
      if (response?.data?.removeUserInFleet?.status !== 200) {
        setError(response?.data?.removeUserInFleet?.message);
        return;
      }
      if (response?.data?.removeUserInFleet?.status === 200) {
        setError('');
        router.reload();
      }
    } catch (e) {
      setSubmitting(false);
      console.log(e);
    }
  };

  const handleSelect = async event => {
    setMembersPageNumber(1);
    setPendingMembersPageNumber(1);
    const selectedKey = event.target.value;
    const selectedObject: any = fleetsData[selectedKey];
    setSelectedFleet(selectedObject);
    setDoUsSelectedFleetState(true);
  };

  if (loadingGetFleetById || submitting || userObject?.loadingUser) {
    return <Loader />;
  }
  return (
    <>
      <div className='container mx-auto'>
        <div className='grid items-center mb-5 grid-cols-1 md:grid-cols-3'>
          <div className='w-full flex items-start col-span-2 px-2'>
            {fleetsData?.length > 1 ? (
              <select
                name='language'
                className='block max-w-md py-2 pl-3 pr-10 overflow-hidden text-sm border-gray-300 rounded-md w-fit focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-base'
                onChange={handleSelect}
              >
                {Object?.keys(fleetsData)?.map((key, index) => (
                  <option
                    value={key}
                    key={index}
                    selected={selectedFleet ? fleetsData[key]._id === selectedFleet._id : undefined}
                  >
                    {fleetsData[key]?.name}
                  </option>
                ))}
              </select>
            ) : (
              fleetsData &&
              fleetsData?.length > 0 && (
                <h1 className='text-xl font-bold text-primary'>{fleetsData[0]?.name} </h1>
              )
            )}
          </div>
          <div className='flex flex-col sm:flex-row gap-2 items-center justify-start my-3 md:justify-end lg:justify-end md:mt-3 lg:mt-5'>
            <Button
              variant='Primary'
              className='w-full sm:w-60 sm:h-16 px-2 py-2 ml-5 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none'
              disabled={!fleetsData || fleetsData?.length === 0}
              onClick={() => showModal(MODAL_TYPES.INVITE_USER_IN_FLEET, selectedFleet)}
            >
              {t('common:invite_member')}
            </Button>
            {isMemberTableSelected ? (
              <Button
                variant='Primary'
                className='w-full sm:w-60 sm:h-16 px-2 py-2 ml-5 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none '
                onClick={() => {
                  setIsMemberTableSelected(false);
                }}
              >
                {t('common:pending_invites')}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsMemberTableSelected(true);
                }}
                variant='Primary'
                className='px-2 py-2 ml-5 font-medium rounded-lg shadow-sm sm:text-white text-md focus:outline-none '
              >
                {t('common:members')}
              </Button>
            )}
          </div>
        </div>
        {<ErrorMessage title={error} />}
        {submitting && <InformationalMessage title={'Deleting User From Fleet...'} />}

        <div className='container px-2'>
          {isMemberTableSelected ? (
            <MembersTable
              memberData={membersData}
              handleUserRemoveInFleet={handleUserRemoveInFleet}
              submitting={submitting}
              selectedPage={membersPageNumber}
              setSelectedPage={setMembersPageNumber}
              membersRowsPerPage={membersRowsPerPage}
              setMembersRowsPerPage={setMembersRowsPerPage}
              membersCount={membersCount}
              sortColumn={memberSortColumn}
              setSortColumn={setMemberSortColumn}
              sortOrder={membersSortOrder}
              setSortOrder={setMembersSortOrder}
            />
          ) : (
            <PendingInvitesTable
              pendingInvitationData={pendingInvitationData}
              selectedPage={pendingMembersPageNumber}
              setSelectedPage={setPendingMembersPageNumber}
              pendingMembersRowsPerPage={pendingMembersRowsPerPage}
              setPendingMembersRowsPerPage={setPendingMembersRowsPerPage}
              pendingMembersCount={pendingMembersCount}
              sortColumn={pendingMembersSortColumn}
              setSortColumn={setPendingMembersSortColumn}
              sortOrder={pendingMembersSortOrder}
              setSortOrder={setPendingMembersSortOrder}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AllFleetMembersPage;
