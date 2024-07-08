/* eslint-disable no-lone-blocks */
import {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const ConfirmModal = ({
  handleConfirm,
  title,
  message,
  subMessage,
}: {
  handleConfirm: () => void;
  title: string;
  message: string;
  subMessage: string;
}) => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const [loading, setLoading] = useState(false);

  return (
    <Modal title={title} small>
      <div>{message}</div>
      {subMessage ? <div>{subMessage}</div> : null}
      <div className='flex justify-end flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <button
          type='button'
          disabled={loading}
          onClick={hideModal}
          className={
            'shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-white bg-red-600 hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
          }
        >
          {t('common:cancel')}
        </button>
        <button
          type='button'
          onClick={() => {
            setLoading(true);
            handleConfirm();
          }}
          className={
            'shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-white bg-primary-foreground hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground'
          }
        >
          {loading ? 'Confirming...' : 'Confirm'}
        </button>
      </div>
    </Modal>
  );
};
export default ConfirmModal;
