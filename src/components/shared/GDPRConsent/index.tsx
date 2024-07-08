import useTranslation from 'next-translate/useTranslation';
import {useEffect, useState} from 'react';
import Button from '../Button';

const Consent = () => {
  const [show, setShow] = useState(false);
  const {t} = useTranslation();
  const Accept = () => {
    localStorage.setItem('gdprConsent', 'true');
    setShow(false);
  };

  const Reject = () => {
    localStorage.setItem('gdprConsent', 'false');
    setShow(false);
  };

  useEffect(() => {
    const gdprConsent = localStorage.getItem('gdprConsent');
    if (gdprConsent) {
      if (gdprConsent.length > 0) {
        setShow(false);
      }
    } else {
      setShow(true);
    }
  }, []);

  return show ? (
    <div className='z-50 transition border rounded-sm border-mainGreen duration-200 !h-fit md:!h-16 transform ease scale-90 max-w-screen-lg mx-auto fixed bg-white inset-x-5 p-5 bottom-2 drop-shadow-2xl flex gap-4 flex-wrap md:flex-nowrap text-center md:text-left items-center justify-center md:justify-between'>
      <div className='w-full'>
        Please click accept button to provide your consent for{' '}
        <a className='text-primary font-bold' href='/gdprPolicy' target='_blank'>
          GDPR Policy
        </a>
      </div>
      <div className='flex flex-row gap-2 items-center w-full sm:w-96 md:w-auto'>
        <Button onClick={Reject} className='w-full md:w-auto px-5' variant='Red'>
          {t('common:decline')}
        </Button>
        <Button onClick={Accept} className='w-full md:w-auto px-5' variant='Primary'>
          {t('common:accept')}
        </Button>
      </div>
    </div>
  ) : null;
};
export default Consent;
