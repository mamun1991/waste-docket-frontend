import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {CUSTOMER_STATE, CUSTOMER_VALIDATION} from '@/constants/yup/customer';
import {countries} from 'countries-list';
import Modal from '../Modal';
import ErrorMessage from '../../ErrorMessage';
import InformationalMessage from '../../InformationalMessage';

const AddEditCustomerModal = (data: any) => {
  const {data: session} = useSession();
  const [AddCustomerInFleet] = useMutation(mutations.AddCustomerInFleet);
  const [EditCustomerInFleet] = useMutation(mutations.EditCustomerInFleet);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const counties = [
    'Carlow',
    'Cavan',
    'Clare',
    'Cork',
    'Donegal',
    'Dublin',
    'Galway',
    'Kerry',
    'Kildare',
    'Kilkenny',
    'Laois',
    'Leitrim',
    'Limerick',
    'Longford',
    'Louth',
    'Mayo',
    'Meath',
    'Monaghan',
    'Offaly',
    'Roscommon',
    'Sligo',
    'Tipperary',
    'Waterford',
    'Westmeath',
    'Wexford',
    'Wicklow',
  ];
  const customerCountyExists = counties.includes(data?.customerCounty);
  const initialCounty = customerCountyExists ? data.customerCounty : '';
  const formik = useFormik({
    initialValues:
      data.FORM_TYPE === 'ADD_CUSTOMER'
        ? CUSTOMER_STATE
        : {
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail,
            customerAddress: data.customerAddress,
            customerId: data.customCustomerId,
            customerStreet: data?.customerStreet,
            customerCity: data?.customerCity,
            customerCounty: initialCounty,
            customerEircode: data?.customerEircode,
            customerCountry: data?.customerCountry,
          },
    validationSchema: CUSTOMER_VALIDATION,
    onSubmit: async function (values) {
      setSubmitting(true);
      setError('');
      setResponseMessage('');
      if (data.FORM_TYPE === 'ADD_CUSTOMER') {
        try {
          const response = await AddCustomerInFleet({
            variables: {
              fleetId: data.fleetId,
              customerData: {
                customerName: values.customerName,
                customerPhone: values.customerPhone,
                customerEmail: values.customerEmail,
                customerAddress: values.customerAddress,
                customerId: values.customerId,
                customerStreet: values?.customerStreet,
                customerCity: values?.customerCity,
                customerCounty: values?.customerCounty,
                customerEircode: values?.customerEircode,
                customerCountry: values?.customerCountry,
              },
            },
            context: {
              headers: {
                Authorization: session?.accessToken,
              },
            },
          });
          setSubmitting(false);
          if (response?.data?.addCustomerInFleet?.response?.status !== 200) {
            setError(response?.data?.addCustomerInFleet?.response?.message);
            return;
          }

          if (response?.data?.addCustomerInFleet?.response?.status === 200) {
            setResponseMessage(response?.data?.addCustomerInFleet?.response?.message);
            router.reload();
            return;
          }

          setError('');
          hideModal();
        } catch (e) {
          console.log(e);
        }
      }
      if (data.FORM_TYPE === 'EDIT_CUSTOMER') {
        try {
          const response = await EditCustomerInFleet({
            variables: {
              fleetId: data.fleetId,
              customerId: data.customerId,
              customerData: {
                customerName: values.customerName,
                customerPhone: values.customerPhone,
                customerEmail: values.customerEmail,
                customerAddress: values.customerAddress,
                customerId: values.customerId,
                customerStreet: values?.customerStreet,
                customerCity: values?.customerCity,
                customerCounty: values?.customerCounty,
                customerEircode: values?.customerEircode,
                customerCountry: values?.customerCountry,
              },
            },
            context: {
              headers: {
                Authorization: session?.accessToken,
              },
            },
          });
          setSubmitting(false);
          if (response?.data?.editCustomerInFleet?.response?.status !== 200) {
            setError(response?.data?.editCustomerInFleet?.response?.message);
            return;
          }

          if (response?.data?.editCustomerInFleet?.response?.status === 200) {
            setResponseMessage(response?.data?.editCustomerInFleet?.response?.message);
            router.reload();
            return;
          }
          setError('');
          hideModal();
        } catch (e) {
          console.log(e);
        }
      }
    },
  });

  return (
    <Modal
      title={`${data.FORM_TYPE === 'ADD_CUSTOMER' ? t('common:add_customer') : 'Edit Customer'}`}
      medium
      preventClose={submitting}
    >
      <div>
        <form onSubmit={formik.handleSubmit}>
          {data?.showFleets ? (
            <div className='grid w-full grid-cols-2 gap-x-4'>
              <div className='mb-4'>
                <label htmlFor='customerId'>{t('common:customerId')}</label>
                <input
                  type='text'
                  name='customerId'
                  id='customerId'
                  className={`block w-full rounded border py-1 px-2 ${
                    formik.touched.customerId && formik.errors.customerId
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.customerId}
                />
                {formik.touched.customerId && formik.errors.customerId && (
                  <span className='text-red-400'>{formik.errors.customerId}</span>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='customerName'>{t('common:customerName')}*</label>
                <input
                  type='text'
                  name='customerName'
                  id='customerName'
                  className={`block w-full rounded border py-1 px-2 ${
                    formik.touched.customerName && formik.errors.customerName
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.customerName}
                  required
                />
                {formik.touched.customerName && formik.errors.customerName && (
                  <span className='text-red-400'>{formik.errors.customerName}</span>
                )}
              </div>
            </div>
          ) : (
            <div className='grid w-full grid-cols-2 gap-x-4'>
              <div className='mb-4'>
                <label htmlFor='customerId'>{t('common:customerId')}</label>
                <input
                  type='text'
                  name='customerId'
                  id='customerId'
                  className={`block w-full rounded border py-1 px-2 ${
                    formik.touched.customerId && formik.errors.customerId
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.customerId}
                />
                {formik.touched.customerId && formik.errors.customerId && (
                  <span className='text-red-400'>{formik.errors.customerId}</span>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='customerName'>{t('common:customerName')}*</label>
                <input
                  type='text'
                  name='customerName'
                  id='customerName'
                  className={`block w-full rounded border py-1 px-2 ${
                    formik.touched.customerName && formik.errors.customerName
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.customerName}
                  required
                />
                {formik.touched.customerName && formik.errors.customerName && (
                  <span className='text-red-400'>{formik.errors.customerName}</span>
                )}
              </div>
            </div>
          )}
          <div className='grid w-full grid-cols-2 gap-x-4'>
            <div className='mb-4'>
              <label htmlFor='customerEmail'>{t('common:customerEmail')}</label>
              <input
                type='text'
                name='customerEmail'
                id='customerEmail'
                className={`block w-full rounded border py-1 px-2 ${
                  formik.touched.customerEmail && formik.errors.customerEmail
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.customerEmail}
              />
              {formik.touched.customerEmail && formik.errors.customerEmail && (
                <span className='text-red-400'>{formik.errors.customerEmail}</span>
              )}
            </div>
            <div className='mb-4'>
              <label htmlFor='customerPhone'>{t('common:customerPhone')}</label>
              <input
                type='text'
                name='customerPhone'
                id='customerPhone'
                className={`block w-full rounded border py-1 px-2 ${
                  formik.touched.customerPhone && formik.errors.customerPhone
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.customerPhone}
              />
              {formik.touched.customerPhone && formik.errors.customerPhone && (
                <span className='text-red-400'>{formik.errors.customerPhone}</span>
              )}
            </div>
          </div>

          <div className='mb-2'>
            <label htmlFor='customerAddress'>{t('common:address')}</label>
            <input
              type='text'
              name='customerAddress'
              id='customerAddress'
              className={`block w-full rounded border py-1 px-2 ${
                formik.touched.customerAddress && formik.errors.customerAddress
                  ? 'border-red-400'
                  : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.customerAddress}
              placeholder={t('common:addressPlaceholder')}
            />
            {formik.touched.customerAddress && formik.errors.customerAddress && (
              <span className='text-red-400'>{formik.errors.customerAddress}</span>
            )}
          </div>
          <div className='mb-2'>
            <input
              type='text'
              name='customerStreet'
              id='customerStreet'
              className={`block w-full rounded border py-1 px-2 ${
                formik.touched.customerStreet && formik.errors.customerStreet
                  ? 'border-red-400'
                  : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.customerStreet}
              placeholder={t('common:streetName')}
            />
            {formik.touched.customerStreet && formik.errors.customerStreet && (
              <span className='text-red-400'>{formik.errors.customerStreet}</span>
            )}
          </div>
          <div className='mb-2'>
            <label htmlFor='customerCity'>{t('common:city')}</label>
            <input
              type='text'
              name='customerCity'
              id='customerCity'
              className={`block w-full rounded border py-1 px-2 ${
                formik.touched.customerCity && formik.errors.customerCity
                  ? 'border-red-400'
                  : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.customerCity}
            />
            {formik.touched.customerCity && formik.errors.customerCity && (
              <span className='text-red-400'>{formik.errors.customerCity}</span>
            )}
          </div>

          <div className='mb-2'>
            <label htmlFor='customerCounty'>
              {t('common:county')} ({t('common:if applicable')})
            </label>
            <select
              name='customerCounty'
              className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
              onChange={formik.handleChange}
              value={formik.values.customerCounty}
              onBlur={formik.handleBlur}
            >
              <option value='' disabled selected>
                {t('common:Choose a county')}
              </option>
              {counties.map(item => (
                <option
                  value={item}
                  key={item}
                  selected={data.customerCounty === item || formik.values.customerCounty === item}
                >
                  {item}
                </option>
              ))}
            </select>

            {formik.touched.customerCounty && formik.errors.customerCounty && (
              <span className='text-red-400'>{formik.errors.customerCounty}</span>
            )}
          </div>
          <div className='mb-2'>
            <label htmlFor='customerEircode'>{t('common:eircode')}</label>
            <input
              type='text'
              name='customerEircode'
              id='customerEircode'
              className={`block w-full rounded border py-1 px-2 ${
                formik.touched.customerEircode && formik.errors.customerEircode
                  ? 'border-red-400'
                  : 'border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.customerEircode}
              placeholder={t('common:Enter area Eircode')}
            />
            {formik.touched.customerEircode && formik.errors.customerEircode && (
              <span className='text-red-400'>{formik.errors.customerEircode}</span>
            )}
          </div>
          <div>
            {t('common:Country')}
            <select
              name='customerCountry'
              className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
              onChange={formik.handleChange}
              value={formik.values.customerCountry}
              onBlur={formik.handleBlur}
            >
              <option value='' disabled selected>
                {t('page:choose_country')}
              </option>
              {Object.entries(countries)
                .map(([, countryInfo]) => countryInfo.name)
                .sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'base'}))
                .map(countryName => (
                  <option
                    value={countryName}
                    key={countryName}
                    selected={
                      data.customerCountry === countryName ||
                      formik.values.customerCountry === countryName
                    }
                  >
                    {countryName}
                  </option>
                ))}
            </select>
            {formik.touched.customerCountry && formik.errors.customerCountry && (
              <span className='text-red-400'>{formik.errors.customerCountry}</span>
            )}
          </div>
          <div className='text-center'>
            {data.FORM_TYPE === 'EDIT_CUSTOMER' ? (
              <button
                className='p-3 mt-5 text-white rounded bg-primary'
                type='submit'
                disabled={submitting}
              >
                {submitting ? 'Editing...' : 'Edit Customer'}
              </button>
            ) : (
              <button
                className='p-3 mt-5 text-white rounded bg-primary'
                type='submit'
                disabled={submitting}
              >
                {submitting ? t('common:adding') : t('common:add_customer')}
              </button>
            )}

            <button
              type='button'
              className='p-3 ml-4 text-white bg-red-400 rounded'
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
          </div>
          <ErrorMessage title={error} className='mt-4' />
          <InformationalMessage title={responseMessage} className='mt-4' />
        </form>
      </div>
    </Modal>
  );
};
export default AddEditCustomerModal;
