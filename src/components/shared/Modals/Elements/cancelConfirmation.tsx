import {ModalContextProvider} from '@/store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const CancelConfirmation = ({handleConfirm}: {handleConfirm: () => void}) => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();

  return (
    <Modal title={`Confirmation`} medium>
      <div className='w-full flex justify-center items-start flex-col'>
        <h3 className='text-[24px] text-black mb-8'>{t('setting:are_you_sure')}</h3>
        <div className='w-full flex justify-end items-center gap-4'>
          <button
            type='button'
            className='bg-red-400 rounded p-3 text-white'
            onClick={() => hideModal()}
          >
            {t('setting:cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className='bg-primary rounded p-3 text-white'
            type='submit'
          >
            {t('setting:confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default CancelConfirmation;
