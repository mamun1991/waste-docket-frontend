import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession, signOut} from 'next-auth/react';
import {useRouter} from 'next/router';
import mutations from '@/constants/GraphQL/User/mutations';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';
import Button from '../../Button';

const DeleteModal = () => {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [DeleteMyAccount] = useMutation(mutations.DeleteMyAccount);
  const {data: session} = useSession();
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  return (
    <Modal title={`${t('common:delete_account')}`} extraSmall>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <Button
          type='button'
          variant='Red'
          onClick={async () => {
            try {
              setSubmitting(true);
              const response = await DeleteMyAccount({
                context: {
                  headers: {
                    Authorization: session?.accessToken,
                  },
                },
              });
              setSubmitting(false);
              if (response?.data?.deleteMyAccount?.status !== 200) {
                setError(response?.data?.deleteMyAccount?.message);
                return;
              }
              setError('');
              const path = await signOut({
                callbackUrl: `/${router.locale}/`,
                redirect: false,
              });
              router.push(path.url);
              hideModal();
            } catch (e) {
              console.log(e);
            }
          }}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {submitting ? t('common:deleting') : t('common:delete')}
        </Button>
        <Button
          type='button'
          variant='Primary'
          onClick={hideModal}
          className='shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:No')}
        </Button>
      </div>
      <span className='text-red-400'>{error}</span>
    </Modal>
  );
};
export default DeleteModal;
