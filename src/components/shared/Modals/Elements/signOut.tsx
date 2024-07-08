import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {signOut} from 'next-auth/react';
import {useRouter} from 'next/router';
import Modal from '../Modal';

const SignoutModal = () => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const router = useRouter();

  return (
    <Modal title={t('common:signout_confirm')} medium>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-4'>
        <button
          type='button'
          onClick={hideModal}
          className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
        >
          {t('common:No')}
        </button>
        <button
          type='button'
          onClick={async () => {
            const path = await signOut({
              callbackUrl: `/${router.locale}/`,
              redirect: false,
            });
            router.push(path.url);
          }}
          className='inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 hover:bg-red-700 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
        >
          {t('Yes')}
        </button>
      </div>
    </Modal>
  );
};
export default SignoutModal;
