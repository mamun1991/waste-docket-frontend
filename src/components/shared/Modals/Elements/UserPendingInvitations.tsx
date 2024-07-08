import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {INVIATION_STATUS} from '@/constants/enums';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

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

const UserPendingInvitationsModal = el => {
  const {t} = useTranslation();
  const router = useRouter();
  const dontChangeSelectedFleet = true;
  const [InvitationAction] = useMutation(mutations.InvitationAction);
  const {data: session} = useSession();
  const [invitationsArray, setInvitationsArray] = useState<FleetInvitation[]>(
    el?.PendingInvitations
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
        const modifiedArray = updateInvitationStatus(fleetInvitation._id, action, invitationsArray);
        setInvitationsArray(modifiedArray);
        if (action === INVIATION_STATUS.ACCEPTED) {
          router.reload();
        }
      } else {
        setError(response?.data?.invitationAction?.message);
      }
    } catch (e) {
      setSubmitting(false);

      console.log('e', e);
    }
  };

  return (
    <Modal title={t('common:pendingInvitations')} medium>
      <div className='w-full h-fit flex justify-center items-center align-center flex-col sm:mx-auto bg-white sm:border-0 sm:h-full'>
        <div className='bg-white rounded-md border-2 border-gray-300 px-2 pb-2 h-fit md:h-auto w-full flex flex-col gap-3 md:gap-0 justify-between'>
          <div className='flex flex-col gap-4 items-center justify-center py-4'>
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
                          Accept
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
                          Reject
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

          <p className='text-red-600 text-center'>{error}</p>
        </div>
      </div>
    </Modal>
  );
};
export default UserPendingInvitationsModal;
