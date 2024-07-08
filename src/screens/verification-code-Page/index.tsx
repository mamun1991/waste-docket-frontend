import dynamic from 'next/dynamic';
import Image from 'next/image'; // Assuming you're using Next.js
import {useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {signIn} from 'next-auth/react';
import {useRouter} from 'next/router';
import Text from '@/components/shared/Text';
import Input from '@/components/shared/Input';
import {Item} from '@/components/shared/Grid';
import {Form, Formik} from 'formik';
import Button from '@/components/shared/Button';
import axios from 'axios';
import Flex from '@/components/shared/Flex';
import Footer from '@/components/theme/common/Footer';
import sass from '../../../public/assets/images/hero/saas1.jpg';
import {VERIFICATION_STATE, VERIFICATION_YUP} from './constant/Yup';

const Navbar = dynamic(() => import('@/components/theme/layout/Navbar'));

const VerificationPage = () => {
  const {t} = useTranslation();
  const [apiError, setApiError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [verificationloading, setVerificationLoading] = useState(false);
  const router = useRouter();
  const {query} = router;
  console.log('CODE VERIFICATION PAGE', query);

  const handleSubmit = async values => {
    console.log('(auth Verification page) values:', values);
    try {
      setApiError('');
      setApiLoading(true);
      let payload;
      if (query.type === 'SIGNUP') {
        payload = {
          email: query.value,
          fullName: query.fullName,
          otpToken: values.OTP,
          redirect: false,
          accountSubType: query?.userType,
        };
        console.log('(auth Verification page) when user signs up  payload:', payload);
      } else {
        payload = {
          email: query.value,
          otpToken: values.OTP,
          redirect: false,
        };
        console.log('(auth Verification page) when user logs in payload:', payload);
      }
      const res: any = await signIn('credentials', payload);
      if (res?.ok === true) {
        router.push(`/pendingInvites?type=${query?.type}&userType=${query?.userType}`);
        setVerificationLoading(true);
        console.log('(auth Verification page) res:', res.ok);
      } else {
        console.log('(auth Verification page) Error Message inside else condition');
        setApiError('Please check your code and try again');
        setVerificationLoading(false);
      }
      setApiLoading(false);
    } catch (err) {
      console.log('(auth Verification page) Error Message inside catch block', err);
      setApiError('Please check your code and try again');
      setVerificationLoading(false);
      setApiLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      setApiError('');
      setApiLoading(true);
      if (query.type === 'SIGNUP') {
        await axios.post('/api/otp/generateSignUpOtp', {
          email: query.value,
          fullName: query.fullName,
        });
      } else {
        await axios.post('/api/otp/generateSignInOtp', {email: query.value});
      }
      setApiLoading(false);
    } catch (err) {
      setApiError('Re-sending OTP Failed');
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
                  initialValues={{...VERIFICATION_STATE}}
                  validationSchema={VERIFICATION_YUP}
                >
                  {({values}) => (
                    <div className='w-2/3 flex items-start justify-start'>
                      <Form>
                        <div className='h-full pt-4 md:p-2 flex flex-col gap-2'>
                          <p>
                            {t('page:signin_verify_otp_help')}{' '}
                            <span className='font-medium'>{query.value}</span>. Please check and
                            enter below:
                          </p>
                          <Flex flex='col' gap='4'>
                            <Input
                              value={values.OTP}
                              name='OTP'
                              type={'text'}
                              placeholder={t('common:otp')}
                            />
                          </Flex>
                          <Item row='2' col='1' className='flex flex-col gap-2 mt-5 mb-8 '>
                            <Button
                              type='submit'
                              loading={apiLoading}
                              className='bg-primary'
                              disabled={!values.OTP || verificationloading}
                            >
                              {t('common:verifyOTP')}
                            </Button>
                            <Button
                              loading={apiLoading}
                              className='bg-primary'
                              onClick={resendVerification}
                            >
                              {t('common:resendOTP')}
                            </Button>
                            <Button
                              loading={apiLoading}
                              className='bg-red-400'
                              onClick={() => router.back()}
                            >
                              {t('common:cancel')}
                            </Button>
                            {apiError && (
                              <Text className='font-bold text-red-500'>Error: {apiError}</Text>
                            )}
                          </Item>
                        </div>
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

export default VerificationPage;
