import Image from 'next/image';
import dynamic from 'next/dynamic';
const SassModernSwiper = dynamic(() => import('./SassModernSwiper'));
import Text from '@/components/shared/Text';
import Input from '@/components/shared/Input';
import {Item} from '@/components/shared/Grid';
import {Formik, Form} from 'formik';
import {useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import {useRouter} from 'next/router';
import axios from 'axios';
import Flex from '@/components/shared/Flex';
import {SIGNUP_STATE, SIGNUP_STATE_YUP} from '../../../screens/sign-up-page/constant/Yup';

import whiteWave from '../../../../public/assets/images/shapes/white-wave.svg';
import {AccountSubTypes} from '@/constants/enums';

const checkSvg = (
  <svg
    className='stroke-green-500 stroke-2 w-5 h-5'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
  >
    <polyline points='20 6 9 17 4 12'></polyline>
  </svg>
);

const Hero = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [signUpAsBusiness, setSignUpAsBusiness] = useState(false);
  const {query} = useRouter();

  const handleSubmit = async values => {
    try {
      setApiLoading(true);
      await axios.post('/api/otp/generateSignUpOtp', {
        fullName: values.fullName,
        email: values.email,
      });
      await router.push(
        `/auth/verificationCode?&value=${values.email}&fullName=${values.fullName}&type=SIGNUP&userType=${AccountSubTypes.BUSINESS_ADMIN}`
      );
      setApiLoading(false);
    } catch (err) {
      setApiError(err.response.data.message);
      setApiLoading(false);
    }
  };

  const initialValues = query.email
    ? {
        fullName: query.fullName || '',
        email: query.email,
        isAgree: false,
      }
    : SIGNUP_STATE;
  return (
    <div>
      <section className='bg-gradient-to-t from-slate-500/10 relative'>
        <section className='relative pt-44 pb-36'>
          <div className='container mx-auto'>
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-16 items-center'>
              <div className='order-2 lg:order-1'>
                <div className='text-left sm:text-start'>
                  <h1 className='text-3xl leading-tight sm:text-4xl lg:text-4xl font-semibold mb-2'>
                    Green
                    <span className='pl-2 text-primary'>Journeys</span>
                  </h1>
                  <p className='sm:text-lg text-gray-500'>
                    Maximize Efficiency with Digital Dockets Tailored for Modern Fleets
                  </p>
                  <div className='flex gap-3  mt-6'>
                    <Formik
                      onSubmit={values => handleSubmit(values)}
                      initialValues={initialValues}
                      validationSchema={SIGNUP_STATE_YUP}
                    >
                      {({values, setFieldValue, errors, touched}) => (
                        <div>
                          <Form>
                            {!showFields ? (
                              <>
                                <div className='flex flex-col items-start justify-center gap-5'>
                                  <div className='flex flex-col'>
                                    <div className='flex gap-x-4 flex-wrap gap-y-4'>
                                      <div
                                        className='flex flex-col bg-red-400 sm:w-auto w-full items-center justify-center px-14 rounded-lg cursor-pointer bg-mainGreen py-2 hover:shadow-lg'
                                        onClick={() => {
                                          setSignUpAsBusiness(false);
                                          setShowFields(true);
                                        }}
                                      >
                                        <span></span>
                                        <p className='text-center text-white'>
                                          {t('common:signup_as_driver')}
                                        </p>
                                      </div>
                                      <div
                                        className='flex flex-col items-center w-full sm:w-auto justify-center px-5 rounded-lg cursor-pointer bg-mainGreen py-2 hover:shadow-lg'
                                        onClick={() => {
                                          setSignUpAsBusiness(true);
                                          setShowFields(true);
                                        }}
                                      >
                                        <span></span>
                                        <p className='text-center text-white'>
                                          {t('common:signup_your_business_now')}
                                        </p>
                                      </div>
                                    </div>
                                    <div className='flex flex-wrap items-center gap-5 mt-5'>
                                      <div className='flex items-center gap-2'>
                                        {checkSvg}
                                        <p className='text-sm text-gray-700'>Free 30-day Trial</p>
                                      </div>
                                      <div className='flex items-center gap-2'>
                                        {checkSvg}
                                        <p className='text-sm text-gray-700'>
                                          No credit card needed
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {query.redirectedFrom === 'SIGNIN' ? (
                                    ''
                                  ) : (
                                    <div className='text-left flex flex-row items-center justify-center'>
                                      <div className='pr-2'>
                                        {t('common:already_have_an_account')}
                                      </div>
                                      <a
                                        className='cursor-pointer inline-block bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark'
                                        onClick={() => router.push('/auth/signin')}
                                      >
                                        {t('common:Login')}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <h2 className='text-xl font-bold text-left text-mainGreen'>
                                  {signUpAsBusiness
                                    ? 'Sign up Your Business Now'
                                    : 'Sign up as Driver'}
                                </h2>
                                {}
                                <p className='text-left'>
                                  {' '}
                                  {query.redirectedFrom === 'SIGNIN'
                                    ? t('common:account_does_not_exist_please_signup')
                                    : t('page:signup_help')}
                                </p>
                                <div className='w-full sm:w-[500px] flex flex-col items-start justify-start'>
                                  <div className='flex flex-col items-start justify-start w-full'>
                                    <Input
                                      value={values.fullName}
                                      name='fullName'
                                      type='fullName'
                                      placeholder={t('common:fullName')}
                                      className='block w-full h-12 max-w-md px-3 py-2 mt-4 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                                    />
                                    {errors.fullName && touched.fullName && (
                                      <p className='w-full text-red-400 sm:ml-14'>
                                        {errors.fullName}
                                      </p>
                                    )}
                                  </div>
                                  <div className='flex flex-col items-start justify-start w-full'>
                                    <Input
                                      defaultValue={query.email || values.email}
                                      name='email'
                                      type='email'
                                      placeholder={t('common:email')}
                                      className='block w-full h-12 max-w-md px-3 py-2 mt-4 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                                    />
                                    {errors.email && touched.email && (
                                      <p className='w-full text-red-400 sm:ml-14'>{errors.email}</p>
                                    )}
                                  </div>
                                  <div className='flex flex-col items-start justify-start w-full'>
                                    <div className='flex w-full gap-3 mt-2 text-sm lg:justify-left lg:align-left md:text-base'>
                                      <input
                                        value={values.fullName}
                                        name='isAgree'
                                        type='checkbox'
                                        className='mt-1'
                                        onChange={() => {
                                          if (values.isAgree) {
                                            setFieldValue('isAgree', false);
                                          } else {
                                            setFieldValue('isAgree', true);
                                          }
                                        }}
                                      />
                                      <label>
                                        I accept{' '}
                                        <a
                                          className='font-bold text-primary'
                                          href='/tos'
                                          target='_blank'
                                        >
                                          Terms of Services
                                        </a>{' '}
                                        and{' '}
                                        <a
                                          className='font-bold text-primary'
                                          href='/privacyPolicy'
                                          target='_blank'
                                        >
                                          Privacy Policy
                                        </a>
                                      </label>
                                    </div>
                                    {errors.isAgree && touched.isAgree && (
                                      <p className='w-full text-red-400 sm:ml-14'>
                                        {errors.isAgree}
                                      </p>
                                    )}
                                  </div>
                                  <div className='flex flex-col items-start justify-start w-full'>
                                    <Button
                                      type='submit'
                                      loading={apiLoading}
                                      className='max-w-md mt-4 bg-primary'
                                      // disabled={!values.fullName || !values.email || !values.isAgree}
                                    >
                                      {t('common:signup_using_otp')}
                                    </Button>
                                    <p className='text-lg mt-2'>
                                      We will send one time password (OTP) to your email account.
                                    </p>
                                    <Button
                                      loading={apiLoading}
                                      className='max-w-md mt-2 bg-transparent text-black text-left font-thin'
                                      onClick={() => router.push('/auth/signin')}
                                      type='button'
                                    >
                                      Already have an account? Sign In
                                    </Button>
                                  </div>
                                </div>
                                <Flex>
                                  <Item>
                                    {apiError ? (
                                      <Text className='font-bold text-red-500'>
                                        {' '}
                                        Error: {apiError}
                                      </Text>
                                    ) : (
                                      query?.error === 'CredentialsSignin' && (
                                        <Text className='font-bold text-red-500'>
                                          Error: {t('common:invalid_otp')}
                                        </Text>
                                      )
                                    )}
                                  </Item>
                                </Flex>
                              </>
                            )}
                          </Form>
                        </div>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>

              <div className='order-1 lg:order-2'>
                <div className='relative'>
                  <div className='hidden sm:block'>
                    <div className="before:w-24 before:h-24 before:absolute before:-bottom-8 before:-start-8 before:bg-[url('/assets/images/pattern/dot2.svg')]"></div>
                    <div className="after:w-24 after:h-24 after:absolute after:-top-10 after:end-10 2xl:after:end-0 after:rotate-45 after:bg-[url('/assets/images/pattern/dot5.svg')]"></div>
                  </div>

                  <SassModernSwiper />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className='absolute bottom-0 inset-x-0 hidden sm:block'>
          <Image
            width={1905}
            height={150}
            src={whiteWave}
            alt='white-wave-svg'
            className='w-full -scale-x-100 -scale-y-100'
          />
        </div>
      </section>
    </div>
  );
};

export default Hero;
