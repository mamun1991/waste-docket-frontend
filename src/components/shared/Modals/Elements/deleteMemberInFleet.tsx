import {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const DeleteModal = ({handleDelete, user}) => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal title={`${t('common:delete_member')}`} extraSmall preventClose={submitting}>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <button
          type='button'
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          onClick={hideModal}
          disabled={submitting}
        >
          {t('common:No')}
        </button>
        <button
          type='button'
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          onClick={async () => {
            setSubmitting(true);
            await handleDelete(user);
            setSubmitting(false);
            hideModal();
          }}
          disabled={submitting}
        >
          {submitting ? t('common:deleting') : t('common:delete')}
        </button>
      </div>
    </Modal>
  );
};
export default DeleteModal;
