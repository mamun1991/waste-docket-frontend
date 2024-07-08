import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const DeleteModal = ({pathname}) => {
  const {t} = useTranslation();
  const pageName = pathname.split('/')[1];

  const modalText = () => {
    switch (pageName) {
      case 'dashboard':
        return t('common:dashboard_help_text');
      case 'dockets':
        return t('common:dockets_help_text');
      case 'fleets':
        return t('common:fleets_help_text');
      case 'userProfile':
        return t('common:user_profile_help_text');
      default:
        return t('common:default_help_text');
    }
  };
  return (
    <Modal title={`${t('common:help')}`} large>
      <div className='bg-white flex flex-col py-8 space-y-4 max-h-[400px] xl:max-h-[500px] overflow-y-auto w-full pr-2'>
        <dd
          className='custom'
          dangerouslySetInnerHTML={{
            __html: modalText(),
          }}
        ></dd>
      </div>
    </Modal>
  );
};
export default DeleteModal;
