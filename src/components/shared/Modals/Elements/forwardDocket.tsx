import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';
import {ThreeDots} from 'react-loader-spinner';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import ErrorMessage from '../../ErrorMessage';
import InformationalMessage from '../../InformationalMessage';
import {useSession} from 'next-auth/react';

const ForwardDocket = (data: any) => {
  const {hideModal} = ModalContextProvider();
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [error, setError] = useState('');
  const [email, setEmail] = useState(data?.customerEmail);
  const [responseMessage, setResponseMessage] = useState('');
  const [forwardDocket, {loading: forwardDocketLoading}] = useMutation(mutations.ForwardDocket);
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const forwardHandler = async () => {
    setError('');
    setResponseMessage('');
    if (!email || email.trim() === '') {
      setError(t('common:email_is_required'));
      return;
    } else if (!validateEmail(email)) {
      setError(t('common:invalid_email'));
      return;
    } else {
      try {
        await forwardDocket({
          variables: {
            fleetId: data?.fleetId,
            docketId: data?.docketId,
            email: email,
          },
          context: {
            headers: {
              Authorization: session?.accessToken,
            },
          },
          onCompleted: d => {
            if (d?.forwardDocket?.status === 200) {
              setResponseMessage(t('page:email_forwarded_successfully'));
              setTimeout(() => {
                hideModal();
              }, 1000);
            } else {
              setError(d?.forwardDocket?.message);
            }
          },
        });
      } catch (error) {
        console.error('Error occurred:', error);
        setError(error?.message);
      }
    }
  };
  return (
    <Modal title={`${t('page:forward_docket')}`} medium preventClose={forwardDocketLoading}>
      {forwardDocketLoading && (
        <div className='fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='flex flex-col items-center rounded bg-white p-4 text-center shadow-md dark:bg-black'>
            <ThreeDots
              height='56'
              width='56'
              radius='9'
              color={'green'}
              ariaLabel='three-dots-loading'
              visible={true}
            />
            <p className='mt-2'>{t('common:loading')}</p>
          </div>
        </div>
      )}
      <div>
        <label htmlFor='email'>{t('common:email')}</label>
        <input
          type='email'
          name='email'
          id='email'
          className={`block w-full rounded border py-1 px-2 mt-2 border-gray-300`}
          onChange={e => setEmail(e.target.value)}
          value={email}
          placeholder='Please provide the email for forwarding the docket.'
        />
      </div>
      <div className='flex flex-row flex-wrap sm:flex-nowrap justify-end gap-2 mt-4'>
        <button
          type='button'
          className='px-6 py-2 border rounded border-mainGreen hover:bg-mainGreen hover:text-white'
          onClick={() => {
            hideModal();
          }}
        >
          {t('common:cancel')}
        </button>
        <button
          onClick={async () => {
            forwardHandler();
          }}
          className='px-6 py-2 text-white rounded bg-mainGreen'
          type='button'
        >
          {forwardDocketLoading ? t('common:loading') : t('common:forward')}
        </button>
      </div>
      <ErrorMessage title={error} className='mt-4' />
      <InformationalMessage title={responseMessage} className='mt-4' />
    </Modal>
  );
};
export default ForwardDocket;
