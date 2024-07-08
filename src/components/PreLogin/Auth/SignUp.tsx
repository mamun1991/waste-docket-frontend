import axios from 'axios';
import {OTP_STATE, OTP_YUP} from 'constants/yup/otp';
import {SIGNUP_STATE, SINGUP_YUP} from 'constants/yup/signup';
import {Field, Formik} from 'formik';
import {signIn} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useState} from 'react';

const SignUp = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [error, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  let [response] = useState<any>({});

  const signUpSubmitHandler = async values => {
    try {
      setLoading(true);
      await axios.post('/api/otp/handleOtpSignUp', {
        email: values.email,
        name: values.name,
      });

      setCurrentEmail(values.email);
      setCurrentName(values.name);
      setShowOtpInput(true);
      setLoading(false);
      setErrors('');
    } catch (err) {
      if (err.response.status === 409) {
        setErrors('User with this email already exists');
      }
      if (err.response.status === 400) {
        setErrors(err.response.data.message);
      }
    }
  };

  const otpSubmitHandler = async values => {
    try {
      response = await signIn('credentials', {
        email: currentEmail,
        otpToken: values.otpToken,
        callbackUrl: '/user/myinfo',
        redirect: false,
      });
      if (response && response?.error === ('CredentialsSignin' as string)) {
        setErrors('Invalid OTP. Please try again');
      }
      if (response && response?.status === 200) {
        router.replace('/user/welcome');
      }
    } catch (err) {
      setErrors('Invalid OTP. Please try again');
    }
  };

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
            {t('page:Signup_title')}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            {t('common:or')}{' '}
            <a
              href={`/${router.locale}/auth/login`}
              className='font-medium text-mainBlue hover:text-mainBlue'
            >
              {t('page:Signin_title')}
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
                {({handleSubmit, errors}) => (
                  <>
                    <div>{t('common:otp_sent_to_email')}</div>
                    <div className='text-red-600'>{t('common:otp_expire_10_minutes')}</div>
                    <br />

                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                      <div className='flex flex-row'>
                        <Field
                          className='appearance-none block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          type='text'
                          name='otpToken'
                          required
                          placeholder='OTP Token'
                        />
                        <button
                          className='ml-2 buttonBase text-center px-1 w-40 rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                          type='button'
                          onClick={() =>
                            signUpSubmitHandler({email: currentEmail, name: currentName})
                          }
                        >
                          {loading ? t('common:txt_loading') : 'Re-send OTP'}
                        </button>
                      </div>
                      {errors && (
                        <p className='font-bold text-red-500 text-xs'>{errors.otpToken}</p>
                      )}
                      {error ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div>
                      ) : null}
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
              <Formik
                initialValues={SIGNUP_STATE}
                validationSchema={SINGUP_YUP}
                onSubmit={signUpSubmitHandler}
              >
                {({handleSubmit, values, errors, touched}) => (
                  <>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                      <Field
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                        type='email'
                        name='email'
                        required
                        values={values.email}
                        placeholder='Email'
                      />{' '}
                      {touched.email && errors.email ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'> {errors.email}</div>
                      ) : null}
                      <Field
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                        type='name'
                        name='name'
                        required
                        values={values.name}
                        placeholder='Full Name'
                      />{' '}
                      {touched.name && errors.name ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'> {errors.name}</div>
                      ) : null}
                      {error ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'>{error}</div>
                      ) : null}
                      <button
                        className='buttonBase block text-center w-full rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700 py-2'
                        type='submit'
                      >
                        Sign up with One Time Password
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
export default SignUp;
