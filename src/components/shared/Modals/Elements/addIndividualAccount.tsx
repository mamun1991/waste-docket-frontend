import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {
  INDIVIDUAL_ACCOUNT_INITIAL_STATE,
  INDIVIDUAL_ACCOUNT_VALIDATION,
} from '@/constants/yup/individualAccount';
import Modal from '../Modal';

const AddIndividualAccountModal = () => {
  const {data: session} = useSession();
  const [AddIndividualAccount] = useMutation(mutations.AddIndividualAccount);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();

  const formik = useFormik({
    initialValues: INDIVIDUAL_ACCOUNT_INITIAL_STATE,
    validationSchema: INDIVIDUAL_ACCOUNT_VALIDATION,
    onSubmit: async function (values) {
      setSubmitting(true);
      try {
        const response = await AddIndividualAccount({
          variables: {
            permitNumber: values.permitNumber,
          },
          context: {
            headers: {
              Authorization: session?.accessToken,
            },
          },
        });
        setSubmitting(false);

        if (response?.data?.addIndividualAccount?.status !== 200) {
          setError(response?.data?.addIndividualAccount?.message);
          return;
        }
        if (response?.data?.addIndividualAccount?.status === 200) {
          router.reload();
          return;
        }
        setError('');
        router.reload();
        hideModal();
      } catch (e) {
        setSubmitting(false);
        console.log(e);
      }
    },
  });

  return (
    <Modal
      title={t('common:addIndividualAccount')}
      small
      preventClose={submitting}
      additionalClasses='!overflow-visible'
    >
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='permitNumber'>{t('common:permitNumber')}*</label>
            <input
              type='text'
              name='permitNumber'
              id='permitNumber'
              className={`block w-full rounded border py-1 px-2 ${
                formik.touched.permitNumber && formik.errors.permitNumber
                  ? 'border-red-400'
                  : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.permitNumber}
              required
            />
            {formik.touched.permitNumber && formik.errors.permitNumber && (
              <span className='text-red-400'>{formik.errors.permitNumber}</span>
            )}
          </div>

          <div className='text-center'>
            <button className='bg-primary rounded p-3 text-white mt-2' type='submit'>
              {submitting ? t('common:Submitting') : t('common:submit')}
            </button>
            <button
              type='button'
              className='bg-red-400 rounded p-3 text-white ml-4'
              onClick={() => {
                if (submitting) {
                  return;
                }
                hideModal();
              }}
            >
              {t('common:cancel')}
            </button>
          </div>
          <span className='text-red-400'>{error}</span>
        </form>
      </div>
    </Modal>
  );
};
export default AddIndividualAccountModal;
