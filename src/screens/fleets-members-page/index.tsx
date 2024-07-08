import {useState} from 'react';
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

const FleetMembersPage = () => {
  const {t} = useTranslation();
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
  const fleetId = router?.query?.id;

  const {loading: loadingGetFleetById} = useQuery(queries.GetFleetMemebersByIdWithSorting, {
    variables: {
      fleetId: fleetId,
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
    skip: !fleetId,
    fetchPolicy: 'network-only',
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    onCompleted: data => {
      if (data?.getFleetMembersByIdWithSorting?.response?.status === 200) {
        setFleetsData(data?.getFleetMembersByIdWithSorting?.fleetData);
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
          fleetId: fleetId,
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

  if (loadingGetFleetById || submitting) {
    return <Loader />;
  }
  return (
    <>
      <div className='container mx-auto'>
        <div className='grid items-center mb-5 md:grid-cols-3'>
          <div className='col-span-2 flex items-start px-2'>
            {fleetsData && (
              <h1 className='text-primary font-bold text-xl px-2'>{fleetsData?.name} </h1>
            )}
          </div>
          <div className='flex items-center justify-start md:justify-end lg:justify-end md:mt-3 lg:mt-5 my-3'>
            <Button
              variant='Primary'
              className='sm:text-white rounded-lg shadow-sm text-md font-medium ml-5 focus:outline-none px-2 py-2 text-md  '
              onClick={() => showModal(MODAL_TYPES.INVITE_USER_IN_FLEET, fleetsData)}
            >
              {t('common:invite_member')}
            </Button>
            {isMemberTableSelected ? (
              <Button
                variant='Primary'
                className='sm:text-white rounded-lg shadow-sm text-md font-medium ml-5 focus:outline-none px-2 py-2 text-md  '
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
                className='sm:text-white rounded-lg shadow-sm text-md font-medium ml-5 focus:outline-none px-2 py-2 text-md  '
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

export default FleetMembersPage;
