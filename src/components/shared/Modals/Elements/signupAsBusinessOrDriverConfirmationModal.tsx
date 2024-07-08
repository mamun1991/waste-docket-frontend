import {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';
import {ThreeDots} from 'react-loader-spinner';
import {useMutation} from '@apollo/client';
import mutations from '@/constants/GraphQL/User/mutations';
import {useSession} from 'next-auth/react';

const SignupAsBusinessOrDriverConfirmationModal = (data: any) => {
  const session = useSession();
  const {hideModal} = ModalContextProvider();
  const {t} = useTranslation();
  const [error, setError] = useState('');
  const [updateSubRole, {loading}] = useMutation(mutations.updateSubRoleByUser);

  return (
    <Modal title={`${t('page:signup_role_confirmation')}`} medium preventClose={loading}>
      {loading && (
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
        <p className='text-black'>
          {t('page:are_you_sure_you_want_to_continue_signup_as_a')} {data?.subRoleType}?
        </p>
      </div>
      <div className='flex flex-row flex-wrap sm:flex-nowrap justify-end gap-2 mt-4'>
        <button
          type='button'
          className='px-6 py-2 border rounded border-mainGreen hover:bg-mainGreen'
          onClick={() => {
            hideModal();
          }}
        >
          {t('common:no')}
        </button>
        <button
          onClick={async () => {
            await updateSubRole({
              variables: {
                subRole: data?.signupType,
              },
              context: {
                headers: {
                  Authorization: session?.data?.accessToken,
                },
              },
              onCompleted: data => {
                if (data?.updateSubRoleByUser?.status === 200) {
                  hideModal();
                  () => data?.redirect();
                } else {
                  setError(data?.updateSubRoleByUser?.message);
                }
              },
            });
          }}
          className='px-6 py-2 text-white rounded bg-mainGreen'
          type='button'
        >
          {loading ? t('common:loading') : t('common:yes')}
        </button>
      </div>
      {error && <span className='text-red-400'>{error}</span>}
    </Modal>
  );
};
export default SignupAsBusinessOrDriverConfirmationModal;
