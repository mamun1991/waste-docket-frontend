import axios from 'axios';
import {Field, Formik} from 'formik';
import {signIn} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useState} from 'react';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';

const Login = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const {url, callbackUrl} = router.query;
  const [showOtpInput, setShowOTP] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [errors, setErors] = useState('');

  const callbackUrlRedirect = url
    ? (url as string)
    : callbackUrl
    ? (callbackUrl as string)
    : (`/${router.locale}/user/myinfo` as string);

  const signInSubmitHandler = async values => {
    try {
      await axios.post('/api/otp/handleOtpSignIn', {
        email: values.email,
      });

      setCurrentEmail(values.email);
      setShowOTP(true);
      setErors('');
    } catch (err) {
      if (err.response.status === 404) {
        setErors('Email not found');
      }
    }
  };

  const otpSubmitHandler = async values => {
    await signIn('credentials', {
      email: currentEmail,
      phone: currentEmail,
      otpToken: values.otpToken,
      callbackUrl: callbackUrlRedirect,
    });
  };

  const {error} = router.query;
  return (
    <>
      <div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
          <Image
            className='mx-auto h-12 w-auto '
            src='/assets/images/logo.png'
            alt='wasteDocket'
            height={50}
            width={50}
          />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {t('page:Signin_title')}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            {t('common:or')}{' '}
            <a
              href={`/${router.locale}/auth/signup`}
              className='font-medium text-mainBlue hover:text-mainBlue'
            >
              {t('profile:sign_up')}
            </a>
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            {showOtpInput ? (
              <Formik
                initialValues={OTP_STATE}
                onSubmit={otpSubmitHandler}
                validationSchema={OTP_YUP}
              >
                {({handleSubmit, errors: formErrors}) => (
                  <>
                    <div>{t('common:otp_sent_to_email')}</div>
                    <div className='text-red-600'>{t('common:otp_expire_10_minutes')}</div>
                    <br />
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                      {formErrors && (
                        <p className='font-bold text-red-500 text-xs'>{formErrors.otpToken}</p>
                      )}
                      <Field
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                        type='text'
                        name='otpToken'
                        placeholder='OTP Token'
                      />
                      <button
                        className='buttonBase block text-center w-full rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                        type='submit'
                      >
                        Verify OTP Token
                      </button>
                    </form>
                  </>
                )}
              </Formik>
            ) : (
              <Formik initialValues={{email: ''}} onSubmit={signInSubmitHandler}>
                {({handleSubmit}) => (
                  <>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                      <Field
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                        type='email'
                        name='email'
                        required
                        placeholder='Email'
                      />
                      {errors ? (
                        <div>
                          <span className='text-red-500 mt-2 text-sm font-normal'>{errors}. </span>{' '}
                          <span className='text-mainBlue text-sm font-normal'>
                            <a href='/auth/signup/'>Please Sign Up here</a>
                          </span>
                        </div>
                      ) : null}
                      {error === 'CredentialsSignin' && (
                        <span className='text-red-500 mt-2 text-sm font-normal'>
                          {t('common:invalid_otp')}
                        </span>
                      )}
                      <button
                        className='buttonBase block text-center w-full rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                        type='submit'
                      >
                        Sign in with One Time Password
                      </button>
                    </form>
                  </>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
