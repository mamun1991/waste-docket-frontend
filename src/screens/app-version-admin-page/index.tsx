import Loader from '@/components/shared/Loader/Loader';
import {useSession} from 'next-auth/react';
import {useFormik} from 'formik';
import {APP_VERSION_INITIAL_STATE, APP_VERSION_VALIDATION} from '@/constants/yup/appVersion';
import useTranslation from 'next-translate/useTranslation';
import {useMutation, useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/AppVersion/queries';
import mutations from '@/constants/GraphQL/AppVersion/mutations';
import {useState} from 'react';
import ErrorMessage from '../../components/shared/ErrorMessage';
import InformationalMessage from '../../components/shared/InformationalMessage';
import {ThreeDots} from 'react-loader-spinner';

const AppVersionForAdmin = () => {
  const {t} = useTranslation();
  const session = useSession();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [manageAppVersion, {loading: submitLoading}] = useMutation(mutations.ManageAppVersion);

  const {loading} = useQuery(queries.GetAppVersion, {
    fetchPolicy: 'network-only',
    context: {
      headers: {
        Authorization: session?.data?.accessToken,
      },
    },
    onCompleted: data => {
      setSuccessMessage('');
      setError('');
      if (data?.getAppVersion?.response?.status === 200) {
        const versionData = data?.getAppVersion?.appVersion;
        formik.setFieldValue('androidLatestVersion', versionData?.androidLatestVersion);
        formik.setFieldValue(
          'isAndroidUpgradeMandatory',
          versionData?.isAndroidUpgradeMandatory ? 'yes' : 'no'
        );
        formik.setFieldValue('iosLatestVersion', versionData?.iosLatestVersion);
        formik.setFieldValue(
          'isIosUpgradeMandatory',
          versionData?.isIosUpgradeMandatory ? 'yes' : 'no'
        );
      } else {
        setError(data?.getAppVersion?.response?.message);
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    },
  });

  const formik = useFormik({
    initialValues: APP_VERSION_INITIAL_STATE,
    validationSchema: APP_VERSION_VALIDATION,
    onSubmit: async function (values) {
      setSuccessMessage('');
      setError('');
      await manageAppVersion({
        variables: {
          appVersionData: {
            androidLatestVersion: values?.androidLatestVersion,
            isAndroidUpgradeMandatory: values?.isAndroidUpgradeMandatory === 'yes' ? true : false,
            iosLatestVersion: values?.iosLatestVersion,
            isIosUpgradeMandatory: values?.isIosUpgradeMandatory === 'yes' ? true : false,
          },
        },
        onCompleted(data) {
          if (data?.manageAppVersion?.status === 200) {
            setSuccessMessage(data?.manageAppVersion?.message);
            setTimeout(() => {
              setSuccessMessage('');
            }, 3000);
          } else {
            setError(data?.manageAppVersion?.message);
            setTimeout(() => {
              setError('');
            }, 3000);
          }
        },
        context: {
          headers: {
            Authorization: session?.data?.accessToken,
          },
        },
      });
    },
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='flex flex-col mt-12 h-full'>
      <form onSubmit={formik.handleSubmit}>
        <div className='container'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
            <div>
              <label htmlFor='androidLatestVersion'>{t('page:android_latest_version')}</label>
              <input
                type='text'
                name='androidLatestVersion'
                id='androidLatestVersion'
                className={`block w-full rounded border py-1 px-2 ${
                  formik.touched.androidLatestVersion && formik.errors.androidLatestVersion
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.androidLatestVersion}
              />
              {formik.touched.androidLatestVersion && formik.errors.androidLatestVersion && (
                <span className='text-red-400'>{formik.errors.androidLatestVersion}</span>
              )}
            </div>
            <div>
              <label htmlFor='isAndroidUpgradeMandatory'>
                {t('page:is_android_upgrade_mandatory')}
              </label>
              <select
                name='isAndroidUpgradeMandatory'
                className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                onChange={formik.handleChange}
                value={formik.values.isAndroidUpgradeMandatory}
                onBlur={formik.handleBlur}
              >
                <option value={'no'}>{t('common:no')}</option>
                <option value={'yes'}>{t('common:yes')}</option>
              </select>
              {formik.touched.isAndroidUpgradeMandatory &&
                formik.errors.isAndroidUpgradeMandatory && (
                  <span className='text-red-400'>{formik.errors.isAndroidUpgradeMandatory}</span>
                )}
            </div>
            <div>
              <label htmlFor='iosLatestVersion'>{t('page:ios_latest_version')}</label>
              <input
                type='text'
                name='iosLatestVersion'
                id='iosLatestVersion'
                className={`block w-full rounded border py-1 px-2 ${
                  formik.touched.iosLatestVersion && formik.errors.iosLatestVersion
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.iosLatestVersion}
              />
              {formik.touched.iosLatestVersion && formik.errors.iosLatestVersion && (
                <span className='text-red-400'>{formik.errors.iosLatestVersion}</span>
              )}
            </div>
            <div>
              <label htmlFor='isIosUpgradeMandatory'>{t('page:is_ios_upgrade_mandatory')}</label>
              <select
                name='isIosUpgradeMandatory'
                className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                onChange={formik.handleChange}
                value={formik.values.isIosUpgradeMandatory}
                onBlur={formik.handleBlur}
              >
                <option value={'no'}>{t('common:no')}</option>
                <option value={'yes'}>{t('common:yes')}</option>
              </select>
              {formik.touched.isIosUpgradeMandatory && formik.errors.isIosUpgradeMandatory && (
                <span className='text-red-400'>{formik.errors.isIosUpgradeMandatory}</span>
              )}
            </div>
          </div>
          <ErrorMessage title={error} className='mt-4' />
          <InformationalMessage title={successMessage} className='mt-4' />
          <button
            className='px-6 py-3 mt-2 text-white rounded bg-mainGreen'
            disabled={submitLoading}
            type='submit'
          >
            {submitLoading ? t('common:Submitting') : t('common:submit')}
          </button>
        </div>
      </form>
      {submitLoading && (
        <div className='fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='flex flex-col items-center rounded p-4 text-center  dark:bg-black'>
            <ThreeDots
              height='56'
              width='56'
              radius='9'
              color={'green'}
              ariaLabel='three-dots-loading'
              visible={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppVersionForAdmin;
