/* eslint-disable react/no-unescaped-entities */
import dynamic from 'next/dynamic';
import Image from 'next/image'; // Assuming you're using Next.js
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
import Footer from '@/components/theme/common/Footer';
import sass from '../../../public/assets/images/hero/saas1.jpg';
import {SIGNIN_STATE, SIGNIN_STATE_YUP} from './constant/Yup';

const Navbar = dynamic(() => import('@/components/theme/layout/Navbar'));

const SignInPage = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [isAccount, setIsAccount] = useState(true);
  const {query} = useRouter();

  const handleSubmit = async values => {
    setApiError('');
    setAccountError('');
    setIsAccount(true);
    try {
      setApiLoading(true);
      const response = await axios.post('/api/otp/generateSignInOtp', {email: values.email});
      if (response?.status === 200) {
        await router.push(`/auth/verificationCode?&value=${values.email}&type=SIGNIN&userType=any`);
      } else {
        setApiError(response.data.message);
        if (response.status === 404) {
          setIsAccount(false);
          setAccountError('404');
        }
      }
      setApiLoading(false);
    } catch (err) {
      setApiError(err.response.data.message);
      setApiLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='mt-24'>
        <section className='relative pt-12 sm:pt-44 sm:pb-36'>
          <div className='container mx-auto'>
            <div className='w-full flex flex-col sm:flex-row items-center jsutify-center'>
              <div className='hidden sm:flex order-2 lg:order-1 items-end mr-4'>
                <div className='relative flex items-end justify-end'>
                  <div className='hidden sm:block'>
                    <div className="before:w-24 before:h-24 before:absolute before:-bottom-8 before:-start-8 before:bg-[url('/assets/images/pattern/dot2.svg')]"></div>
                    <div className="after:w-24 after:h-24 after:absolute after:-top-10 after:end-10 2xl:after:end-0 after:rotate-45 after:bg-[url('/assets/images/pattern/dot5.svg')]"></div>
                  </div>
                  <Image src={sass} alt='svg' className='w-2/3 -scale-x-100' />
                </div>
              </div>
              <div className='order-1 lg:order-2 items-start'>
                <Formik
                  onSubmit={values => handleSubmit(values)}
                  initialValues={SIGNIN_STATE}
                  validationSchema={SIGNIN_STATE_YUP}
                >
                  {({values}) => (
                    <div>
                      <Form>
                        <p className='text-3xl text-primary font-bold'>{t('common:Login')}</p>
                        <p>{t('page:signin_help')}</p>
                        <div>
                          <Input
                            value={values.email}
                            name='email'
                            type='email'
                            placeholder={t('common:email')}
                            className='block w-full h-12 max-w-md px-3 py-2 mt-4 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          />
                          {apiError && !isAccount && (
                            <div className='flex items-center justify-center px-3 py-2 mt-2 border border-red-500 rounded gap-x-2'>
                              <span className='text-red-500'>No account was found.</span>
                              <span
                                onClick={() =>
                                  router.push(
                                    `/auth/signup?&email=${values.email}&redirectedFrom=SIGNIN`
                                  )
                                }
                                className='font-medium cursor-pointer text-mainGreen'
                              >
                                Sign Up
                              </span>
                            </div>
                          )}
                          <div>
                            <Button
                              type='submit'
                              loading={apiLoading}
                              className='max-w-md mt-4 bg-primary'
                              disabled={!values.email}
                            >
                              {t('common:login_using_OTP')}
                            </Button>
                            <p className='text-sm mt-2'>
                              We will send one time password (OTP) to your email account.
                            </p>
                            <Button
                              loading={apiLoading}
                              className='max-w-md mt-4 bg-mainGreen'
                              onClick={() => router.push('/auth/signup')}
                            >
                              No Account? Sign Up
                            </Button>
                          </div>
                        </div>
                        <Flex>
                          <Item>
                            {apiError && accountError !== '404' ? (
                              <Text className='font-bold text-red-500'> Error: {apiError}</Text>
                            ) : (
                              query?.error === 'CredentialsSignin' && (
                                <Text className='font-bold text-red-500'>
                                  Error: {t('common:invalid_otp')}
                                </Text>
                              )
                            )}
                          </Item>
                        </Flex>
                      </Form>
                    </div>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SignInPage;
