import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const DeleteModal = el => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();

  return (
    <Modal title={`${t('common:delete')} ${el.name}`} extraSmall>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <button
          type='button'
          onClick={hideModal}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:No')}
        </button>
        <button
          type='button'
          onClick={() => {
            hideModal();
          }}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:Yes')}
        </button>
      </div>
    </Modal>
  );
};
export default DeleteModal;
