import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import Modal from '../Modal';
import Button from '../../Button';

const LeaveFleetModal = el => {
  const {data: session} = useSession();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const [LeaveFleet] = useMutation(mutations.LeaveFleet);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLeave = async () => {
    try {
      setSubmitting(true);
      const response = await LeaveFleet({
        variables: {
          fleetId: el?.id,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      setSubmitting(false);
      if (response?.data?.leaveFleet?.status !== 200) {
        setError(response?.data?.leaveFleet?.message);
        return;
      }
      if (response?.data?.leaveFleet?.status === 200) {
        setError('');
        router.reload();
        hideModal();
      }
    } catch (e) {
      setSubmitting(false);
      console.log(e);
    }
  };

  return (
    <Modal title={`${t('common:leave')} ${el.name}`} medium preventClose={submitting}>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-5'>
        <Button variant='Red' disabled={submitting} onClick={handleLeave}>
          {submitting ? t('common:leaving') : t('common:Yes')}
        </Button>
        <Button
          variant='Primary'
          disabled={submitting}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
          onClick={() => {
            hideModal();
          }}
        >
          {t('common:No')}
        </Button>
      </div>
      <span className='text-red-400'>{error}</span>
    </Modal>
  );
};
export default LeaveFleetModal;
