import {useState, createRef} from 'react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import SignatureCanvas from 'react-signature-canvas';
import {ThreeDots} from 'react-loader-spinner';
import Modal from '../Modal';
import ErrorMessage from '../../ErrorMessage';
import InformationalMessage from '../../InformationalMessage';

const AddDocketSignature = (data: any) => {
  const {data: session} = useSession();
  const [UpdateDocketSignature] = useMutation(mutations.UpdateDocketSignatures);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const wasteFacilityRepSignatureRef: any = createRef();
  const customerSignatureRef: any = createRef();
  const driverSignatureRef: any = createRef();

  const formik = useFormik({
    initialValues: {driverSignature: '', wasteFacilityRepSignature: '', customerSignature: ''},
    onSubmit: async function (values) {
      setSubmitting(true);
      let {driverSignature, wasteFacilityRepSignature, customerSignature} = values;
      try {
        const response = await UpdateDocketSignature({
          variables: {
            fleetId: data.fleetId,
            docketId: data.docketId,
            docketData: {
              driverSignature,
              isDriverSignatureId: false,
              wasteFacilityRepSignature,
              isWasteFacilityRepSignatureId: false,
              customerSignature,
              isCustomerSignatureId: false,
            },
          },
          context: {
            headers: {
              Authorization: session?.accessToken,
            },
          },
        });
        setSubmitting(false);
        if (response?.data?.updateDocketSignatures?.status !== 200) {
          setError(response?.data?.updateDocketSignatures?.message);
          return;
        }
        if (response?.data?.updateDocketSignatures?.status === 200) {
          setResponseMessage(
            `${t(`page:${data?.FORM_TYPE}`)} ${t('page:has been added successfully')}`
          );
          setTimeout(() => {
            router.reload();
            return;
          }, 1000);
        }
      } catch (e) {
        console.log(e);
      }
      return;
    },
  });

  const handleClearSignature = (signatureRef, fieldName) => {
    signatureRef?.current?.clear();
    formik.setFieldValue(fieldName, '');
  };
  const handleSignatureEnd = (fieldName, refName) => {
    formik.setFieldValue(fieldName, refName.current.toDataURL());
  };

  return (
    <Modal
      title={`${t('page:add')} ${t(`page:${data?.FORM_TYPE}`)}`}
      preventClose={submitting}
      additionalClasses='!overflow-visible'
      medium={true}
      select={true}
    >
      {submitting && (
        <div className='fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50'>
          <div className='flex flex-col items-center p-3 text-center bg-white rounded shadow-md'>
            <ThreeDots
              height='50'
              width='50'
              radius='9'
              color='#007337'
              ariaLabel='three-dots-loading'
              visible={true}
            />
          </div>
        </div>
      )}
      <div className='max-h-[400px] xl:max-h-[500px] overflow-y-auto w-full pr-2'>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <div>
              <div className='grid w-full grid-cols-1 gap-x-4'>
                {data?.FORM_TYPE === 'destination_signature' && (
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label htmlFor='wasteFacilityRepSignature'>
                        {t('page:destination_signature')}
                      </label>
                      <button
                        type='button'
                        className='px-1 py-1 text-sm text-white bg-red-400 rounded'
                        onClick={() =>
                          handleClearSignature(
                            wasteFacilityRepSignatureRef,
                            'wasteFacilityRepSignature'
                          )
                        }
                      >
                        {t('page:Clear')}
                      </button>
                    </div>
                    <SignatureCanvas
                      ref={wasteFacilityRepSignatureRef}
                      onEnd={() =>
                        handleSignatureEnd(
                          'wasteFacilityRepSignature',
                          wasteFacilityRepSignatureRef
                        )
                      }
                      canvasProps={{
                        name: 'wasteFacilityRepSignature',
                        id: 'wasteFacilityRepSignature',
                        className: `block h-72 w-full rounded border py-1 px-2 ${
                          formik.touched.wasteFacilityRepSignature &&
                          formik.errors.wasteFacilityRepSignature
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`,
                      }}
                    />
                    {formik.touched.wasteFacilityRepSignature &&
                      formik.errors.wasteFacilityRepSignature && (
                        <span className='text-red-400'>
                          {formik.errors.wasteFacilityRepSignature}
                        </span>
                      )}
                  </div>
                )}
                {data?.FORM_TYPE === 'driver_signature' && (
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label htmlFor='driverSignature'>{t('common:driverSignature')}</label>
                      <button
                        type='button'
                        className='px-1 py-1 text-sm text-white bg-red-400 rounded'
                        onClick={() => handleClearSignature(driverSignatureRef, 'driverSignature')}
                      >
                        {t('page:Clear')}
                      </button>
                    </div>
                    <SignatureCanvas
                      ref={driverSignatureRef}
                      onEnd={() => handleSignatureEnd('driverSignature', driverSignatureRef)}
                      canvasProps={{
                        name: 'driverSignature',
                        id: 'driverSignature',
                        className: `block h-72 w-full rounded border py-1 px-2 ${
                          formik.touched.driverSignature && formik.errors.driverSignature
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`,
                      }}
                    />
                    {formik.touched.driverSignature && formik.errors.driverSignature && (
                      <span className='text-red-400'>{formik.errors.driverSignature}</span>
                    )}
                  </div>
                )}
                {data?.FORM_TYPE === 'customer_signature' && (
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label htmlFor='customerSignature'>{t('common:customerSignature')}</label>
                      <button
                        type='button'
                        className='px-1 py-1 text-sm text-white bg-red-400 rounded'
                        onClick={() =>
                          handleClearSignature(customerSignatureRef, 'customerSignature')
                        }
                      >
                        {t('page:Clear')}
                      </button>
                    </div>
                    <SignatureCanvas
                      ref={customerSignatureRef}
                      onEnd={() => handleSignatureEnd('customerSignature', customerSignatureRef)}
                      canvasProps={{
                        name: 'customerSignature',
                        id: 'customerSignature',
                        className: `block h-72 w-full rounded border ${
                          formik.touched.customerSignature && formik.errors.customerSignature
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`,
                      }}
                    />
                    {formik.touched.customerSignature && formik.errors.customerSignature && (
                      <span className='text-red-400'>{formik.errors.customerSignature}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <ErrorMessage title={error} className='mt-4' />
          <InformationalMessage title={responseMessage} className='mt-4' />
          <div className='flex flex-wrap items-center justify-between'>
            <div />
            <div>
              <button
                type='button'
                className='px-6 py-3 text-white bg-red-400 rounded'
                onClick={() => {
                  if (submitting) {
                    return;
                  }
                  hideModal();
                  wasteFacilityRepSignatureRef?.current?.clear();
                  driverSignatureRef?.current?.clear();
                  customerSignatureRef?.current?.clear();
                }}
              >
                {t('common:cancel')}
              </button>
              <button className='px-6 py-3 mt-5 ml-4 text-white rounded bg-mainGreen' type='submit'>
                {submitting ? t('common:Submitting') : t('common:submit')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default AddDocketSignature;
