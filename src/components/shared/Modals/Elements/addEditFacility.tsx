import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {countries} from 'countries-list';
import {FACILITY_STATE, FACILITY_VALIDATION} from '@/constants/yup/facility';
import Modal from '../Modal';
import ErrorMessage from '../../ErrorMessage';
import InformationalMessage from '../../InformationalMessage';

const AddEditFacilityModal = (data: any) => {
  const {data: session} = useSession();
  const [AddFacilityInFleet] = useMutation(mutations.AddFacilityInFleet);
  const [EditFacilityInFleet] = useMutation(mutations.EditFacilityInFleet);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  console.log('data ======= from add edit', data);
  const formik = useFormik({
    initialValues:
      data.FORM_TYPE === 'ADD_FACILITY'
        ? FACILITY_STATE
        : {
            destinationFacilityName: data.facilityName,
            destinationFacilityAuthorisationNumber: data.facilityAuthorisationNumber,
            destinationFacilityAddress: data.facilityAddress,
            destinationFacilityStreet: data.facilityStreet,
            destinationFacilityCity: data.facilityCity,
            destinationFacilityCounty: data.facilityCounty,
            destinationFacilityEircode: data.facilityEirCode,
            destinationFacilityCountry: data.facilityCountry,
            destinationFacilityLongitude: data.facilityLongitude,
            destinationFacilityLatitude: data.facilityLatitude,
            destinationFacilityId: data.facilityIdByBusiness,
          },
    validationSchema: FACILITY_VALIDATION,
    onSubmit: async function (values) {
      setSubmitting(true);
      setError('');
      setResponseMessage('');
      if (data.FORM_TYPE === 'ADD_FACILITY') {
        try {
          const response = await AddFacilityInFleet({
            variables: {
              fleetId: data.fleetId,
              facilityData: {
                destinationFacilityName: values?.destinationFacilityName,
                destinationFacilityAuthorisationNumber:
                  values?.destinationFacilityAuthorisationNumber,
                destinationFacilityAddress: values?.destinationFacilityAddress,
                destinationFacilityStreet: values?.destinationFacilityStreet,
                destinationFacilityCity: values?.destinationFacilityCity,
                destinationFacilityCounty: values?.destinationFacilityCounty,
                destinationFacilityEircode: values?.destinationFacilityEircode,
                destinationFacilityCountry: values?.destinationFacilityCountry,
                destinationFacilityLongitude: values?.destinationFacilityLongitude,
                destinationFacilityLatitude: values?.destinationFacilityLatitude,
                destinationFacilityId: values?.destinationFacilityId,
              },
            },
            context: {
              headers: {
                Authorization: session?.accessToken,
              },
            },
          });
          setSubmitting(false);
          if (response?.data?.addFacilityInFleet?.response?.status !== 200) {
            setError(response?.data?.addFacilityInFleet?.response?.message);
            return;
          }

          if (response?.data?.addFacilityInFleet?.response?.status === 200) {
            setResponseMessage(response?.data?.addFacilityInFleet?.response?.message);
            router.reload();
            return;
          }

          setError('');
          hideModal();
        } catch (e) {
          console.log(e);
        }
      }
      if (data.FORM_TYPE === 'EDIT_FACILITY') {
        try {
          const response = await EditFacilityInFleet({
            variables: {
              fleetId: data.fleetId,
              facilityId: data.facilityId,
              facilityData: {
                destinationFacilityName: values?.destinationFacilityName,
                destinationFacilityAuthorisationNumber:
                  values?.destinationFacilityAuthorisationNumber,
                destinationFacilityAddress: values?.destinationFacilityAddress,
                destinationFacilityStreet: values?.destinationFacilityStreet,
                destinationFacilityCity: values?.destinationFacilityCity,
                destinationFacilityCounty: values?.destinationFacilityCounty,
                destinationFacilityEircode: values?.destinationFacilityEircode,
                destinationFacilityCountry: values?.destinationFacilityCountry,
                destinationFacilityLongitude: values?.destinationFacilityLongitude,
                destinationFacilityLatitude: values?.destinationFacilityLatitude,
                destinationFacilityId: values?.destinationFacilityId,
              },
            },
            context: {
              headers: {
                Authorization: session?.accessToken,
              },
            },
          });
          console.log(response);
          setSubmitting(false);
          if (response?.data?.editFacilityInFleet?.response?.status !== 200) {
            setError(response?.data?.editFacilityInFleet?.response?.message);
            return;
          }

          if (response?.data?.editFacilityInFleet?.response?.status === 200) {
            setResponseMessage(response?.data?.editFacilityInFleet?.response?.message);
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
  const [destinationGps, setDestinationGps] = useState(false);

  const handleGetCoordinates = fieldName => {
    const fieldPrefix = fieldName === 'collectionPoint' ? '' : 'destinationFacility';
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          formik.setFieldValue(
            `${fieldName === 'collectionPoint' ? 'latitude' : `${fieldPrefix}Latitude`}`,
            latitude.toString()
          );
          formik.setFieldValue(
            `${fieldName === 'collectionPoint' ? 'longitude' : `${fieldPrefix}Longitude`}`,
            longitude.toString()
          );
          if (fieldName === 'destinationFacility') {
            setDestinationGps(true);
          }
        },
        geolocationError => {
          console.error('Error getting location:', geolocationError);
          let errorMessage = 'An unknown error occurred.';
          switch (geolocationError.code) {
            case 1:
              errorMessage = 'User denied the request for Geolocation.';
              break;
            case 2:
              errorMessage = 'Location information is unavailable.';
              break;
            case 3:
              errorMessage = 'Request for Geolocation timed out.';
              break;
            default:
              errorMessage = 'An unexpected error occurred.';
              break;
          }
          formik.setFieldError(
            `${fieldName === 'collectionPoint' ? 'latitude' : `${fieldPrefix}Latitude`}`,
            errorMessage
          );
          formik.setFieldError(
            `${fieldName === 'collectionPoint' ? 'longitude' : `${fieldPrefix}Longitude`}`,
            errorMessage
          );
        }
      );
    } else {
      console.error('Geolocation is not available in your browser.');
      formik.setFieldError(
        `${fieldName === 'collectionPoint' ? 'latitude' : `${fieldPrefix}Latitude`}`,
        'Geolocation is not available.'
      );
      formik.setFieldError(
        `${fieldName === 'collectionPoint' ? 'longitude' : `${fieldPrefix}Longitude`}`,
        'Geolocation is not available.'
      );
    }
  };

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
  return (
    <Modal
      title={`${
        data.FORM_TYPE === 'ADD_FACILITY' ? t('common:add_facility') : t('common:edit_facility')
      }`}
      medium
      preventClose={submitting}
    >
      <div>
        <form onSubmit={formik.handleSubmit}>
          {data?.showFleets ? (
            <div className='grid w-full grid-cols-1 gap-x-4'>
              <div className='mb-4'>
                <label htmlFor='destinationFacilityId'>{t('common:destinationFacilityId')}*</label>
                <input
                  type='text'
                  name='destinationFacilityId'
                  id='destinationFacilityId'
                  className={`block w-full rounded border py-1 px-2 ${
                    formik.touched.destinationFacilityId && formik.errors.destinationFacilityId
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.destinationFacilityId}
                  required
                />
                {formik.touched.destinationFacilityId && formik.errors.destinationFacilityId && (
                  <span className='text-red-400'>{formik.errors.destinationFacilityId}</span>
                )}
              </div>
            </div>
          ) : (
            <div className='mb-4'>
              <label htmlFor='destinationFacilityId'>{t('common:destinationFacilityId')}*</label>
              <input
                type='text'
                name='destinationFacilityId'
                id='destinationFacilityId'
                className={`block w-full rounded border py-1 px-2 ${
                  formik.touched.destinationFacilityId && formik.errors.destinationFacilityId
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.destinationFacilityId}
                required
              />
              {formik.touched.destinationFacilityId && formik.errors.destinationFacilityId && (
                <span className='text-red-400'>{formik.errors.destinationFacilityId}</span>
              )}
            </div>
          )}
          <div>
            <div className='grid w-full grid-cols-2 gap-x-4'>
              <div className='mb-4'>
                <label htmlFor='destinationFacilityName'>
                  {t('common:destinationFacilityName')}*
                </label>
                <input
                  type='text'
                  name='destinationFacilityName'
                  id='destinationFacilityName'
                  className={`block w-full rounded border py-1 px-2 ${
                    formik.touched.destinationFacilityName && formik.errors.destinationFacilityName
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.destinationFacilityName}
                  required
                />
                {formik.touched.destinationFacilityName &&
                  formik.errors.destinationFacilityName && (
                    <span className='text-red-400'>{formik.errors.destinationFacilityName}</span>
                  )}
              </div>
              <div className='mb-4'>
                <label htmlFor='destinationFacilityAuthorisationNumber'>
                  {t('common:authorisationNumber')}*
                </label>
                <input
                  type='text'
                  name='destinationFacilityAuthorisationNumber'
                  id='destinationFacilityAuthorisationNumber'
                  className={`block w-full rounded border py-1 px-2 ${
                    formik.touched.destinationFacilityAuthorisationNumber &&
                    formik.errors.destinationFacilityAuthorisationNumber
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.destinationFacilityAuthorisationNumber}
                  required
                />
                {formik.touched.destinationFacilityAuthorisationNumber &&
                  formik.errors.destinationFacilityAuthorisationNumber && (
                    <span className='text-red-400'>
                      {formik.errors.destinationFacilityAuthorisationNumber}
                    </span>
                  )}
              </div>
            </div>
            <div className='grid w-full grid-cols-2 gap-x-4'>
              <div>
                <div className='mb-2'>
                  <label htmlFor='destinationFacilityAddress'>{t('common:address')}</label>
                  <input
                    type='text'
                    name='destinationFacilityAddress'
                    id='destinationFacilityAddress'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.destinationFacilityAddress &&
                      formik.errors.destinationFacilityAddress
                        ? 'border-red-400'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.destinationFacilityAddress}
                    placeholder={t('common:addressPlaceholder')}
                  />
                  {formik.touched.destinationFacilityAddress &&
                    formik.errors.destinationFacilityAddress && (
                      <span className='text-red-400'>
                        {formik.errors.destinationFacilityAddress}
                      </span>
                    )}
                </div>
                <div className='mb-2'>
                  <input
                    type='text'
                    name='destinationFacilityStreet'
                    id='destinationFacilityStreet'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.destinationFacilityStreet &&
                      formik.errors.destinationFacilityStreet
                        ? 'border-red-400'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.destinationFacilityStreet}
                    placeholder={t('common:streetName')}
                  />
                  {formik.touched.destinationFacilityStreet &&
                    formik.errors.destinationFacilityStreet && (
                      <span className='text-red-400'>
                        {formik.errors.destinationFacilityStreet}
                      </span>
                    )}
                </div>
                <div className='mb-2'>
                  <label htmlFor='destinationFacilityCity'>{t('common:city')}</label>
                  <input
                    type='text'
                    name='destinationFacilityCity'
                    id='destinationFacilityCity'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.destinationFacilityCity &&
                      formik.errors.destinationFacilityCity
                        ? 'border-red-400'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.destinationFacilityCity}
                  />
                  {formik.touched.destinationFacilityCity &&
                    formik.errors.destinationFacilityCity && (
                      <span className='text-red-400'>{formik.errors.destinationFacilityCity}</span>
                    )}
                </div>

                <div className='mb-2'>
                  <label htmlFor='destinationFacilityCounty'>
                    {t('common:county')} ({t('common:if applicable')})
                  </label>
                  <select
                    name='destinationFacilityCounty'
                    className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                    onChange={formik.handleChange}
                    value={formik.values.destinationFacilityCounty}
                    onBlur={formik.handleBlur}
                  >
                    <option value='' disabled selected>
                      {t('common:Choose a county')}
                    </option>
                    {counties.map(item => (
                      <option
                        value={item}
                        key={item}
                        selected={
                          data.destinationFacilityCounty === item ||
                          formik.values.destinationFacilityCounty === item
                        }
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                  {formik.touched.destinationFacilityCounty &&
                    formik.errors.destinationFacilityCounty && (
                      <span className='text-red-400'>
                        {formik.errors.destinationFacilityCounty}
                      </span>
                    )}
                </div>
                <div className='mb-2'>
                  <label htmlFor='destinationFacilityEircode'>{t('common:eircode')}</label>
                  <input
                    type='text'
                    name='destinationFacilityEircode'
                    id='destinationFacilityEircode'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.destinationFacilityEircode &&
                      formik.errors.destinationFacilityEircode
                        ? 'border-red-400'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.destinationFacilityEircode}
                    placeholder={t('common:Enter area Eircode')}
                  />
                  {formik.touched.destinationFacilityEircode &&
                    formik.errors.destinationFacilityEircode && (
                      <span className='text-red-400'>
                        {formik.errors.destinationFacilityEircode}
                      </span>
                    )}
                </div>
                <div>
                  {t('common:Country')}
                  <select
                    name='destinationFacilityCountry'
                    className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                    onChange={formik.handleChange}
                    value={formik.values.destinationFacilityCountry}
                    onBlur={formik.handleBlur}
                    required
                  >
                    {Object.entries(countries)
                      .map(([, countryInfo]) => countryInfo.name)
                      .sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'base'}))
                      .map(countryName => (
                        <option
                          value={countryName}
                          key={countryName}
                          selected={
                            data.destinationFacilityCountry === countryName ||
                            formik.values.destinationFacilityCountry === countryName
                          }
                        >
                          {countryName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.destinationFacilityCountry &&
                    formik.errors.destinationFacilityCountry && (
                      <span className='text-red-400'>
                        {formik.errors.destinationFacilityCountry}
                      </span>
                    )}
                </div>
              </div>
              <div className='mb-1'>
                <label>{t('common:gpsLocation')}</label>
                <div
                  className={`flex h-[335px] flex-col justify-center items-center border border-gray-300 ${
                    destinationGps
                      ? 'py-6'
                      : data.FORM_TYPE === 'EDIT_FACILITY' && !destinationGps
                      ? 'py-1'
                      : formik.errors.destinationFacilityLatitude
                      ? 'py-5'
                      : 'py-7'
                  } px-4`}
                >
                  {!destinationGps && !formik.values.destinationFacilityLatitude && (
                    <button
                      type='button'
                      onClick={() => handleGetCoordinates('destinationFacility')}
                      className='px-2 py-2 font-bold text-white cursor-pointer bg-mainGreen'
                    >
                      {t('common:Pick Location')}
                    </button>
                  )}
                  {formik.values.destinationFacilityLatitude && (
                    <p>
                      {t('common:Latitude')}: {formik.values.destinationFacilityLatitude}
                    </p>
                  )}
                  {formik.values.destinationFacilityLongitude && (
                    <p>
                      {t('common:Longitude')}: {formik.values.destinationFacilityLongitude}
                    </p>
                  )}
                </div>
                {formik.errors.destinationFacilityLatitude && (
                  <span className='text-red-400'>{formik.errors.destinationFacilityLatitude}</span>
                )}
              </div>
            </div>
          </div>
          <div className='text-center'>
            {data.FORM_TYPE === 'EDIT_FACILITY' ? (
              <button
                className='p-3 mt-5 text-white rounded bg-primary'
                type='submit'
                disabled={submitting}
              >
                {submitting ? 'Editing...' : t('common:edit_facility')}
              </button>
            ) : (
              <button
                className='p-3 mt-5 text-white rounded bg-primary'
                type='submit'
                disabled={submitting}
              >
                {submitting ? t('common:adding') : t('common:add_facility')}
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
export default AddEditFacilityModal;
