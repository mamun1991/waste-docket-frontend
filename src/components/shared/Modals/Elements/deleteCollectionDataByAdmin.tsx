import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';
import Button from '../../Button';
import mutations from '@/constants/GraphQL/Fleet/mutations';

const DeleteCollectionDataByAdminModal = data => {
  const [error, setError] = useState('');
  const {data: session} = useSession();
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const [deleteCollectionDataMutation, {loading: deleteCollectionDataLoading}] = useMutation(
    mutations.DeleteCollectionsDataByAdmin
  );

  return (
    <Modal title={`Delete ${data?.collection}`} small>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-4'>
        <Button
          type='button'
          variant='Red'
          onClick={async () => {
            try {
              await deleteCollectionDataMutation({
                variables: {
                  collection: data?.collection,
                },
                context: {
                  headers: {
                    Authorization: session?.accessToken,
                  },
                },
                onCompleted: data => {
                  console.log(data);

                  if (data?.deleteCollectionsDataByAdmin?.status !== 200) {
                    setError(data?.deleteCollectionsDataByAdmin?.message);
                    return;
                  }
                  setError('');
                  router.reload();
                  hideModal();
                },
              });
            } catch (e) {
              console.log(e);
            }
          }}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {deleteCollectionDataLoading ? t('common:deleting') : t('common:delete')}
        </Button>
        <Button
          type='button'
          variant='Primary'
          onClick={hideModal}
          className='shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:No')}
        </Button>
      </div>
      <span className='text-red-400'>{error}</span>
    </Modal>
  );
};
export default DeleteCollectionDataByAdminModal;
