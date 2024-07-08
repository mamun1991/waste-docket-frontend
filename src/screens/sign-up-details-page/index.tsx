import dynamic from 'next/dynamic';
import {useState} from 'react';
import {signOut, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useMutation} from '@apollo/client';
import {Formik, Form} from 'formik';
import mutations from '@/constants/GraphQL/User/mutations';
import Text from '@/components/shared/Text';
import {Item} from '@/components/shared/Grid';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Flex from '@/components/shared/Flex';
import Footer from '@/components/theme/common/Footer';
import {SIGNUP_DETAILS_STATE, SIGNUP_DETAILS_STATE_YUP} from './constant/Yup';
import {AccountSubTypes} from '@/constants/enums';

const Navbar = dynamic(() => import('@/components/theme/layout/Navbar'));

const SignInPage = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const {query} = useRouter();
  const signUpAsBusiness =
    query?.userType === AccountSubTypes.BUSINESS_ADMIN || query?.userType === 'any' ? true : false;
  const [completeSignUp] = useMutation(mutations.completeSignUp);
  const [deleteMyAccount] = useMutation(mutations.DeleteMyAccount);
  const {data: session}: {data: any} = useSession();

  const handleSubmit = async values => {
    try {
      const {
        name,
        VAT,
        permitNumber,
        permitHolderName,
        permitHolderAddress,
        permitHolderContactDetails,
      } = values;

      const response = await completeSignUp({
        variables: {
          isIndividual: false,
          isBusiness: signUpAsBusiness ? true : false,
          name: name,
          vat: VAT,
          permitNumber: permitNumber,
          permitHolderName: permitHolderName,
          permitHolderAddress: permitHolderAddress,
          permitHolderContactDetails: permitHolderContactDetails,
          prefix: '',
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });

      if (response?.data?.completeSignUp?.response?.status === 200) {
        router.push('/dashboard');
      } else {
        response?.data?.completeSignUp?.response?.message
          ? setApiError(`${response?.data?.completeSignUp?.response?.message}`)
          : setApiError('Error Creating Account.');
      }
      setApiLoading(false);
    } catch (err) {
      setApiError(err.response.data.message);
      setApiLoading(false);
    }
  };

  const signupDetailsOverride = {
    ...SIGNUP_DETAILS_STATE,
    isBusiness: true,
  };
  return (
    <>
      <Navbar />
      <Formik
        onSubmit={values => handleSubmit(values)}
        initialValues={signupDetailsOverride}
        validationSchema={SIGNUP_DETAILS_STATE_YUP}
      >
        {({values, isSubmitting, errors, touched}) => (
          <div>
            <Form>
              <div className='flex flex-wrap h-screen'>
                <div className='w-1/2 bg-center bg-[url("/assets/images/bg_mobile.jpg")] sm:bg-[url("/assets/images/bg.jpg")] h-screen hidden lg:flex bg-cover'>
                  <div className='flex items-center h-full max-w-xs m-auto align-center'></div>
                </div>
                <div className='flex items-center justify-center align-center h-screen w-screen lg:w-fit bg-center bg-[url("/assets/images/bg_mobile.jpg")] sm:bg-none bg-cover'>
                  <div className='w-full sm:w-[500px] flex justify-center items-center align-center flex-col  border-2 mx-8 sm:mx-auto bg-white sm:border-0 pb-8 sm:h-full sm:px-4'>
                    <div className='flex items-center float-left w-full max-w-md gap-2 pr-2 sm:pr-0'></div>
                    <div className='w-full mt-3 text-center sm:px-12'>
                      <h1 className='order-2 mb-3 ml-2 text-xl font-bold text-mainGreen'>
                        {signUpAsBusiness && t('common:signingup_as_business')}
                      </h1>
                      {signUpAsBusiness && (
                        <div className='flex flex-col w-full'>
                          <Input
                            value={values.name}
                            name='name'
                            type='name'
                            placeholder={t('common:business_name')}
                            className='block w-full h-12 max-w-md px-3 py-2 mt-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          />
                          {touched.name && errors.name && (
                            <p className='mt-1 text-sm text-left text-mainRed'>{errors.name}</p>
                          )}
                          <Input
                            value={values.VAT}
                            name='VAT'
                            type='VAT'
                            placeholder={t('common:VAT')}
                            className='block w-full h-12 max-w-md px-3 py-2 mt-4 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          />
                          {touched.VAT && errors.VAT && (
                            <p className='mt-1 text-sm text-left text-mainRed'>{errors.VAT}</p>
                          )}
                          <Input
                            value={values.permitNumber}
                            name='permitNumber'
                            type='permitNumber'
                            placeholder={t('common:permitNumber')}
                            className='block w-full h-12 max-w-md px-3 py-2 mt-4 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          />
                          {touched.permitNumber && errors.permitNumber && (
                            <p className='mt-1 text-sm text-left text-mainRed'>
                              {errors.permitNumber}
                            </p>
                          )}
                          <Input
                            value={values.permitHolderName}
                            name='permitHolderName'
                            type='permitHolderName'
                            placeholder={t('common:permitHolderName')}
                            className='block w-full h-12 max-w-md px-3 py-2 mt-4 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          />
                          {touched.permitHolderName && errors.permitHolderName && (
                            <p className='mt-1 text-sm text-left text-mainRed'>
                              {errors.permitHolderName}
                            </p>
                          )}
                          <Input
                            as='textarea'
                            value={values.permitHolderAddress}
                            name='permitHolderAddress'
                            type='permitHolderAddress'
                            placeholder={t('common:permitHolderAddress')}
                            className='block w-full h-16 max-w-md px-3 py-2 mt-4 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          />
                          {touched.permitHolderAddress && errors.permitHolderAddress && (
                            <p className='mt-1 text-sm text-left text-mainRed'>
                              {errors.permitHolderAddress}
                            </p>
                          )}
                          <Input
                            value={values.permitHolderContactDetails}
                            name='permitHolderContactDetails'
                            type='permitHolderContactDetails'
                            placeholder={t('common:permitHolderContactDetails')}
                            className='block w-full h-12 max-w-md px-3 py-2 mt-4 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-mainBlue focus:border-mainBlue sm:text-sm'
                          />
                          {touched.permitHolderContactDetails &&
                            errors.permitHolderContactDetails && (
                              <p className='mt-1 text-sm text-left text-mainRed'>
                                {errors.permitHolderContactDetails}
                              </p>
                            )}
                        </div>
                      )}

                      {signUpAsBusiness && (
                        <div className='flex justify-between gap-x-6'>
                          <Button
                            type='button'
                            className='max-w-md mt-4 bg-mainRed'
                            onClick={async () => {
                              await deleteMyAccount({
                                context: {
                                  headers: {
                                    Authorization: session?.accessToken,
                                  },
                                },
                              });
                              const path = await signOut({
                                callbackUrl: `/${router.locale}/`,
                                redirect: false,
                              });
                              router.push(path.url);
                            }}
                          >
                            {t('common:cancel')}
                          </Button>
                          <Button
                            type='submit'
                            loading={apiLoading}
                            className='max-w-md mt-4 bg-primary'
                            disabled={isSubmitting}
                          >
                            {t('common:finish_sign_up')}
                          </Button>
                        </div>
                      )}

                      <Flex>
                        <Item>
                          {apiError ? (
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
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>
      <Footer />
    </>
  );
};

export default SignInPage;
