import {useState} from 'react';
import {useMutation} from '@apollo/client';

import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import mutations from '@/constants/GraphQL/Fleet/mutations';

import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';
import Button from '../../Button';
import InformationalMessage from '../../InformationalMessage';

const DeleteWastePermitDocuments = el => {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [DeleteWastePermitDocument] = useMutation(mutations.DeleteWastePermitDocument);
  const {data: session} = useSession();
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const [responseMessage, setResponseMessage] = useState('');

  return (
    <Modal title={`${t('common:delete_documents')}`} small>
      <div className='flex flex-row-reverse flex-wrap gap-2 mt-2 sm:flex-nowrap'>
        <Button
          type='button'
          variant='Red'
          onClick={async () => {
            try {
              setSubmitting(true);
              const response = await DeleteWastePermitDocument({
                variables: {
                  wasteCollectionPermitDocumentId: el.wasteCollectionPermitDocumentId,
                  fleetId: el.fleetId,
                },
                context: {
                  headers: {
                    Authorization: session?.accessToken,
                  },
                },
              });
              setSubmitting(false);
              console.log(response);
              if (response?.data?.deleteWastePermitDocument?.response?.status !== 200) {
                setError(response?.data?.deleteWastePermitDocument?.response?.message);
                return;
              }

              if (response?.data?.deleteWastePermitDocument?.response?.status === 200) {
                setResponseMessage(response?.data?.deleteWastePermitDocument?.response?.message);
                router.reload();
                return;
              }
              setError('');
              hideModal();
            } catch (e) {
              console.log(e);
            }
          }}
          className='inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium text-red-600 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {submitting ? t('common:deleting') : t('common:delete')}
        </Button>
        <Button
          type='button'
          variant='Primary'
          onClick={hideModal}
          className='inline-flex justify-center px-4 py-2 mr-2 text-sm font-medium rounded-md shadow-md text-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:No')}
        </Button>
      </div>
      <span className='text-red-400'>{error}</span>
      <InformationalMessage title={responseMessage} className='mt-4' />
    </Modal>
  );
};
export default DeleteWastePermitDocuments;
