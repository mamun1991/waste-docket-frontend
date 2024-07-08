import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const SuggestionDetails = suggestionData => {
  const {t} = useTranslation();
  const {name, email, suggestion} = suggestionData;

  return (
    <Modal title={`${t('common:suggestion_details')}`} large>
      <div className='bg-white flex flex-col rounded-lg p-8 space-y-4 max-h-[400px] xl:max-h-[500px] overflow-y-auto w-full pr-2'>
        <p className='text-lg font-medium'>
          {t('common:name')}: {name}
        </p>
        <p className='text-lg font-medium'>
          {t('common:email')}: {email}
        </p>
        <p className='text-lg font-medium'>
          {t('common:suggestion')}: {suggestion}
        </p>
      </div>
    </Modal>
  );
};
export default SuggestionDetails;
