import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import HalfScreenLayout from '@/components/PreLogin/HalfScreenLayout';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import Button from '@/components/shared/Button';
import {AccountSubTypes, INVIATION_STATUS} from '@/constants/enums';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';

type FleetInvitation = {
  _id: string;
  inviteeEmail: string;
  fleetName: string;
  status: INVIATION_STATUS.PENDING | INVIATION_STATUS.ACCEPTED | INVIATION_STATUS.REJECTED;
  fleetId: {
    _id: string;
    isIndividual: boolean;
    name: string;
    VAT: string;
    permitNumber: string;
    ownerEmail: string;
    membersEmails: string[];
  };
};

function updateInvitationStatus(
  id: string,
  ACTION: INVIATION_STATUS.ACCEPTED | INVIATION_STATUS.REJECTED,
  invitationArray: any[]
) {
  const modifiedArray = invitationArray.map(invitation => {
    if (invitation._id === id) {
      return {
        ...invitation,
        status: ACTION,
      };
    }
    return invitation;
  });
  return modifiedArray;
}

const PendingInvitesPage = ({invitations}) => {
  const dontChangeSelectedFleet = false;
  const router = useRouter();
  const {t} = useTranslation();
  const [InvitationAction] = useMutation(mutations.InvitationAction);
  const {data: session} = useSession();
  const [invitationsArray, setInvitationsArray] = useState<FleetInvitation[]>(invitations);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  console.log('Pending invites component', router?.query);

  const handleInvitationAction = async (fleetInvitation: FleetInvitation, action) => {
    const fleetId = fleetInvitation.fleetId._id;
    try {
      setSubmitting(true);
      const response = await InvitationAction({
        variables: {
          dontChangeSelectedFleet,
          action,
          fleetId,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      setSubmitting(false);

      if (response?.data?.invitationAction?.status === 200) {
        if (invitations.length === 1 && action === INVIATION_STATUS.ACCEPTED) {
          router.push('/dashboard');
        }
        const modifiedArray = updateInvitationStatus(fleetInvitation._id, action, invitationsArray);
        setInvitationsArray(modifiedArray);
      } else {
        setError(response?.data?.invitationAction?.message);
      }
    } catch (e) {
      setSubmitting(false);

      console.log('e', e);
    }
  };

  return (
    <div>
      <HalfScreenLayout>
        <div className='h-fit min-w-[300px] sm:w-[450px] flex justify-center items-center align-center flex-col mx-8 sm:mx-auto bg-white sm:border-0 sm:h-full md:px-4'>
          <div className='bg-white rounded-md border-2 border-gray-300 px-2 pb-2 h-fit md:h-auto w-full flex flex-col gap-3 md:gap-0 justify-between'>
            <div className='flex flex-col gap-4 items-center justify-center py-4'>
              <div className='w-4/5'>
                <h2 className='font-bold text-[19px] md:text-xl text-center text-[#121825]'>
                  {t('common:pendingFleetInvites')}
                </h2>
              </div>
              <div className='w-full flex flex-col gap-2 max-h-[230px] 2xl:max-h-[250px] overflow-y-auto px-2'>
                {invitationsArray?.map((item, index) => (
                  <div
                    key={index}
                    className='w-full border-2 border-gray-300 rounded-md px-3 py-1.5 flex gap-2 md:gap-0 items-center justify-between'
                  >
                    <span className='font-semibold'>{item.fleetName}</span>
                    <div className='flex gap-3'>
                      {item?.status === INVIATION_STATUS.PENDING ? (
                        <>
                          <button
                            className={`px-5 py-1 md:py-1.5 rounded-md font-semibold text-white text-lg ${
                              submitting ? 'bg-gray-500' : 'hover:bg-green-500 bg-[#58DD5A]'
                            }`}
                            onClick={() => {
                              handleInvitationAction(item, INVIATION_STATUS.ACCEPTED);
                            }}
                            disabled={submitting}
                          >
                            {t('common:accept')}
                          </button>
                          <button
                            className={`px-5 py-1 md:py-1.5 rounded-md font-semibold text-white text-lg ${
                              submitting ? 'bg-gray-500' : 'hover:bg-red-600 bg-[#FB0220]'
                            }`}
                            onClick={() => {
                              handleInvitationAction(item, INVIATION_STATUS.REJECTED);
                            }}
                            disabled={submitting}
                          >
                            {t('common:reject')}
                          </button>
                        </>
                      ) : (
                        <button
                          className='px-5 py-1 md:py-1.5 bg-gray-500 rounded-md font-semibold text-white text-lg '
                          disabled={true}
                        >
                          {item?.status}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='w-full lg:mt-2'>
              <Button
                variant='Primary'
                disabled={submitting}
                onClick={async () => {
                  setSubmitting(true);
                  const {data: GetUserById} = await graphqlRequestHandler(
                    queries.getUserById,
                    {token: session?.accessToken},
                    session?.accessToken
                  );
                  setSubmitting(false);
                  const user = GetUserById?.data?.getUserById?.userData;

                  if (user?.isSignUpComplete || user?.accountSubType === AccountSubTypes.DRIVER) {
                    router.push('/dashboard');
                  } else if (
                    !user?.isSignUpComplete &&
                    user?.accountSubType === AccountSubTypes.BUSINESS_ADMIN
                  ) {
                    router.push(
                      `/signupDetails?type=${router?.query?.type}&userType=${AccountSubTypes.BUSINESS_ADMIN}`
                    );
                  }
                }}
              >
                Continue
              </Button>
            </div>
            <p className='text-red-600 text-center'>{error}</p>
          </div>
        </div>
      </HalfScreenLayout>
    </div>
  );
};

export default PendingInvitesPage;
