import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const DeleteModal = el => {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteFleet] = useMutation(mutations.DeleteFleet);
  const {data: session} = useSession();
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();

  return (
    <Modal title={`${t('common:delete_fleet')}`} small>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <button
          type='button'
          onClick={hideModal}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
        >
          {t('common:No')}
        </button>
        <button
          type='button'
          onClick={async () => {
            try {
              setSubmitting(true);
              const response = await deleteFleet({
                variables: {
                  fleetId: el.id,
                },
                context: {
                  headers: {
                    Authorization: session?.accessToken,
                  },
                },
              });
              setSubmitting(false);
              if (response?.data?.deleteFleet?.status !== 200) {
                setError(response?.data?.deleteFleet?.message);
                return;
              }
              setError('');
              router.reload();
              hideModal();
            } catch (e) {
              console.log(e);
            }
          }}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
        >
          {submitting ? t('common:deleting') : t('common:delete')}
        </button>
      </div>
      <span className='text-red-400'>{error}</span>
    </Modal>
  );
};
export default DeleteModal;
