import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import Modal from '../Modal';
import ErrorMessage from '../../ErrorMessage';
import InformationalMessage from '../../InformationalMessage';
import mutations from '@/constants/GraphQL/Suggestion/mutations';
import {SUGGESTION_INITIAL_STATE, SUGGESTION_VALIDATION} from '@/constants/yup/suggestion';

const AddSuggestion = (data: any) => {
  const {data: session} = useSession();
  const [AddSuggestion] = useMutation(mutations.AddSuggestion);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();

  const formik = useFormik({
    initialValues: SUGGESTION_INITIAL_STATE,
    validationSchema: SUGGESTION_VALIDATION,
    onSubmit: async function (values) {
      setSubmitting(true);
      setError('');
      setResponseMessage('');
      try {
        const response = await AddSuggestion({
          variables: {
            suggestionData: {
              suggestion: values?.suggestion,
            },
          },
          context: {
            headers: {
              Authorization: session?.accessToken,
            },
          },
        });
        setSubmitting(false);
        if (response?.data?.addSuggestion?.status !== 200) {
          setError(response?.data?.addSuggestion?.message);
          return;
        }

        if (response?.data?.addSuggestion?.status === 200) {
          setResponseMessage(response?.data?.addSuggestion?.message);
          router.reload();
          return;
        }

        setError('');
        hideModal();
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <Modal title={t('common:add_suggestion')} medium preventClose={submitting}>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className='grid w-full grid-cols-1 gap-x-4'>
            <div className='mb-4'>
              <label htmlFor='userName'>{t('common:name')}</label>
              <input
                type='text'
                name='userName'
                id='userName'
                className={`block w-full rounded border py-1 px-2 ${'border-gray-300'}`}
                value={data?.name}
                disabled
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='userEmail'>{t('common:email')}</label>
              <input
                type='text'
                name='userEmail'
                id='userEmail'
                className={`block w-full rounded border py-1 px-2 ${'border-gray-300'}`}
                value={data?.email}
                disabled
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='suggestion'>{t('common:suggestion')}*</label>
              <textarea
                name='suggestion'
                id='suggestion'
                className={`block w-full rounded border py-3 px-2 ${
                  formik.touched.suggestion && formik.errors.suggestion
                    ? 'border-2 border-red-400'
                    : 'border-gray-300'
                }`}
                rows={3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.suggestion}
                required
              />
              {formik.touched.suggestion &&
                formik.errors.suggestion &&
                formik.values.suggestion &&
                formik.values.suggestion.toString() && (
                  <span className='text-red-400'>{formik.errors.suggestion}</span>
                )}
              {formik.touched.suggestion && !formik.values.suggestion && (
                <span className='text-red-400'>{t('common:Field can not be empty')}</span>
              )}
            </div>
          </div>
          <div className='flex gap-x-2 justify-end'>
            <button
              type='button'
              className='p-3 text-white bg-red-400 rounded'
              disabled={submitting}
              onClick={() => {
                if (submitting) {
                  return;
                }
                hideModal();
              }}
            >
              {t('common:cancel')}
            </button>
            <button
              className='p-3 text-white rounded bg-primary'
              type='submit'
              disabled={submitting}
            >
              {submitting ? t('common:adding') : t('common:add_suggestion')}
            </button>
          </div>
          <ErrorMessage title={error} className='mt-4' />
          <InformationalMessage title={responseMessage} className='mt-4' />
        </form>
      </div>
    </Modal>
  );
};
export default AddSuggestion;
