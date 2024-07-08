import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Button from '@/components/shared/Button';
import Image from 'next/image';
import PreLoginFooter from '@/components/shared/PreLoginFooter';
import {AccountSubTypes} from '@/constants/enums';
import {MODAL_TYPES} from '@/constants/context/modals';
import {ModalContextProvider} from '@/store/Modal/Modal.context';

const SignupAsDriverOrBusinessConfirmationPage = ({invitations}) => {
  const router = useRouter();
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  console.log('Signup As Driver or Business component', router?.query);

  return (
    <div className='flex align-center flex-wrap h-screen'>
      <div className='w-1/2 bg-right bg-center bg-[url("/assets/images/bg_mobile.jpg")] sm:bg-[url("/assets/images/bg.jpg")] h-screen hidden lg:flex bg-cover'>
        <div className='max-w-xs flex items-center align-center block m-auto h-full'></div>
      </div>
      <div className='flex items-center justify-center align-center h-screen w-screen lg:w-1/2'>
        <div className='w-full flex justify-center items-center align-center flex-col h-full pl-4 pr-4'>
          <div className='max-w-md float-left'>
            <Image
              src='/assets/images/logo.png'
              alt='hero'
              height={131}
              width={224}
              className='m-auto'
            />
          </div>
          <div>
            <div className='h-fit w-full pt-4 flex justify-center items-center align-center flex-col mx-8 sm:mx-auto bg-white sm:border-0 sm:h-full md:px-4'>
              <div className='bg-white rounded-md px-2 pb-2 h-fit md:h-auto w-full flex flex-col gap-3 md:gap-0 justify-between'>
                <div className='flex flex-col gap-4 items-center justify-center py-4'>
                  <div className='w-full'>
                    {invitations && invitations?.length > 0 ? (
                      <p className='text-center'>
                        {invitations?.length > 1
                          ? `${invitations?.length} ${t('page:businesses')}`
                          : t('page:business')}{' '}
                        {invitations
                          ?.map(obj => obj.fleetId?.name)
                          .filter(Boolean)
                          .join(',')}{' '}
                        {t('page:invited_you_to_join_as_a_driver')}{' '}
                        {t('page:do_you_want_to_signup_as_a_business_or_as_driver')}
                      </p>
                    ) : (
                      <p>
                        {t('page:do_you_want_to_continue_signup_as_business_or_signup_as_driver')}
                      </p>
                    )}
                  </div>
                </div>
                <div className='w-full flex gap-x-4 lg:mt-4'>
                  <Button
                    onClick={() => router.push('/auth/signin')}
                    className='max-w-md bg-mainRed'
                  >
                    {t('common:cancel')}
                  </Button>
                  <Button
                    onClick={() => {
                      showModal(MODAL_TYPES.SIGNUP_AS_BUSINESS_OR_DRIVER_CONFIRMATION_MODAL, {
                        subRoleType: 'Driver',
                        signupType: AccountSubTypes.DRIVER,
                        redirect: router.push(
                          `/pendingInvites?type=${router?.query?.type}&userType=${AccountSubTypes.DRIVER}`
                        ),
                      });
                    }}
                    variant='Primary'
                  >
                    {t('common:driver')}
                  </Button>
                  <Button
                    onClick={() => {
                      showModal(MODAL_TYPES.SIGNUP_AS_BUSINESS_OR_DRIVER_CONFIRMATION_MODAL, {
                        subRoleType: 'Business',
                        signupType: AccountSubTypes.BUSINESS_ADMIN,
                        redirect: router.push(
                          `/signupDetails?type=${router?.query?.type}&userType=${AccountSubTypes.BUSINESS_ADMIN}`
                        ),
                      });
                    }}
                    variant='Primary'
                  >
                    {t('page:business')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PreLoginFooter />
    </div>
  );
};

export default SignupAsDriverOrBusinessConfirmationPage;
