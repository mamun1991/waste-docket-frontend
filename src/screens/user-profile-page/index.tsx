import {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import queries from 'constants/GraphQL/User/queries';
import Loader from '@/components/shared/Loader/Loader';
import Button from '@/components/shared/Button';
import {TrashIcon} from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import dayjs from 'dayjs';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import mutations from '@/constants/GraphQL/User/mutations';
import {useRouter} from 'next/router';
import Link from 'next/link';

const UserProfileScreen = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {data: session} = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [subData, setSubData] = useState<any>(null);
  const {showModal, hideModal} = ModalContextProvider();
  const [error, setError] = useState('');
  const {t} = useTranslation();
  const [mutate] = useMutation(mutations.CancelSubscription);
  const {data: GetUserById, loading} = useQuery(queries.getUserById, {
    variables: {
      token: session?.accessToken,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  useEffect(() => {
    console.log(GetUserById?.getUserById);

    setUserData(GetUserById?.getUserById?.userData);
    setSubData(GetUserById?.getUserById?.subscription);
  }, [GetUserById]);

  if (loading) {
    return <Loader />;
  }

  const cancelSubscriptionHandler = async (subscriptionId: string) => {
    if (!subscriptionId) return;
    setSubmitting(true);
    mutate({
      variables: {subscriptionId: subscriptionId},
      onCompleted(data) {
        if (data?.cancelSubscription.status !== 200) {
          setTimeout(() => {
            setSubmitting(false);
            setError('');
          }, 5000);
          return setError(data?.cancelSubscription.message);
        }
        return router.reload();
      },
      onError(err) {
        setTimeout(() => {
          setSubmitting(false);
          setError('');
        }, 5000);
        return setError(err?.message);
      },
    });
  };

  function formatDate(inputDateString: string): string {
    // Convert the string to a Date object
    const dateObject: Date = new Date(inputDateString);

    // Format the Date object as a string in the desired format
    const formattedDate: string = dateObject.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formattedDate;
  }

  function calculateNumericLimit() {
    const maxLimit = +(subData?.maxLimit ?? 0);
    const currentLimit = +(subData?.limit ?? 0);

    if (maxLimit - currentLimit < 0) {
      return 0;
    }
    return maxLimit - currentLimit;
  }

  function calculateLimit() {
    // Check if the plan is either 'FREE' or 'ENTERPRISE'
    return subData?.plan === 'FREE' || subData?.plan === 'ENTERPRISE'
      ? 'Unlimited'
      : calculateNumericLimit();
  }

  function hasDatePassed(inputDateString: string): boolean {
    const inputDate: Date = new Date(inputDateString);
    const currentDate: Date = new Date();

    // Compare the input date with the current date
    return inputDate.getTime() < currentDate.getTime();
  }

  function calculateRemainingLimit() {
    if (subData?.plan === 'FREE') {
      return hasDatePassed(subData?.trialEndsAt) ? 0 : calculateLimit();
    }
    return calculateLimit();
  }

  return (
    <div className='mx-auto mt-10'>
      <div className='mt-5 pb-14 grid md:grid-cols-2 gap-8'>
        <fieldset className='w-full border border-solid border-gray-300 px-6 pt-4 pb-10 flex flex-col gap-6 rounded-sm'>
          <legend className='px-2 py-4 text-primary text-xl font-bold'>
            {t('common:account_information')}
          </legend>
          <div className='flex items-center gap-4 w-full h-16 border border-gray-200 px-8 shadow-md rounded-md text-primary font-semibold hover:shadow-lg transition-all'>
            <span className='w-fit'>
              <img alt='dashboard_image' src='/assets/images/user-name.svg' className='w-6 h-6' />
            </span>
            <p>{userData?.personalDetails?.name}</p>
          </div>
          <div className='flex items-center gap-4 w-full h-16 border border-gray-200 px-8 shadow-md rounded-md text-primary font-semibold hover:shadow-lg transition-all'>
            <span className='w-fit'>
              <img alt='dashboard_image' src='/assets/images/user-email.svg' className='w-6 h-6' />
            </span>
            <p>{userData?.personalDetails?.email}</p>
          </div>
          <div className='flex items-center gap-4 w-full h-16 border border-gray-200 px-8 shadow-md rounded-md text-primary font-semibold hover:shadow-lg transition-all'>
            <span className='w-fit'>
              <img
                alt='dashboard_image'
                src='/assets/images/user-created.svg'
                className='w-6 h-6'
              />
            </span>
            {userData && <p>{dayjs(userData.createdAt).format(' DD MMMM YYYY')}</p>}
          </div>

          <div className='w-full'>
            <Button
              round='md'
              text='Delete My Account'
              variant='Red'
              className='flex items-center justify-center w-full gap-2 group bg-red-500 hover:bg-red-600 transition-all px-2 mt-6'
              icon={<TrashIcon className='w-5 h-5 text-white ' />}
              onClick={() => {
                showModal(MODAL_TYPES.DELETE_MY_ACCOUNT);
              }}
            />
          </div>
        </fieldset>
        {userData?.selectedFleet?.ownerEmail === session?.userDetails?.personalDetails?.email && (
          <fieldset className='w-full border border-solid border-gray-300 px-6 pt-4 pb-10 flex flex-col gap-6 rounded-sm'>
            <legend className='px-2 py-4 text-primary text-xl font-bold'>
              {t('setting:billing_information')}
            </legend>
            <div
              className={`flex items-center gap-4 w-full h-16 border border-gray-200 px-8 shadow-md rounded-md ${
                hasDatePassed(subData?.trialEndsAt) ? 'text-red-500' : 'text-primary'
              }  font-semibold hover:shadow-lg transition-all`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='#5D6A94'
                className='w-6 h-6'
              >
                <path d='M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z' />
                <path
                  fill-rule='evenodd'
                  d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z'
                  clip-rule='evenodd'
                />
              </svg>
              <p>
                {subData?.plan === 'FREE'
                  ? hasDatePassed(subData?.trialEndsAt)
                    ? 'Subscription required'
                    : 'Trial Period'
                  : subData?.plan}
                {subData?.plan === 'FREE' && !hasDatePassed(subData?.trialEndsAt) && (
                  <span className='text-[14px] ml-1'>
                    (Ends on {formatDate(subData?.trialEndsAt)})
                  </span>
                )}
              </p>
            </div>
            <div className='flex items-center gap-4 w-full h-16 border border-gray-200 px-8 shadow-md rounded-md text-primary font-semibold hover:shadow-lg transition-all'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='#5D6A94'
                className='w-6 h-6'
              >
                <path
                  fill-rule='evenodd'
                  d='M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
                  clip-rule='evenodd'
                />
              </svg>

              <p>
                {t('setting:seats_used')}{' '}
                {subData?.plan === 'FREE'
                  ? hasDatePassed(subData?.trialEndsAt)
                    ? 0
                    : subData?.limit
                  : subData?.limit}
              </p>
            </div>
            <div className='flex items-center gap-4 w-full h-16 border border-gray-200 px-8 shadow-md rounded-md text-primary font-semibold hover:shadow-lg transition-all'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='#5D6A94'
                className='w-6 h-6'
              >
                <path
                  fill-rule='evenodd'
                  d='M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z'
                  clip-rule='evenodd'
                />
              </svg>
              <p>
                <span>{t('setting:seats_available')} </span>
                {calculateRemainingLimit()}
              </p>
            </div>
            {error && <p className='text-center'>{error}</p>}
            <div className='w-full flex justify-start items-center gap-4 mt-6'>
              <Link
                href={`/pricing?mode=${subData?.stripeCustomerId ? 'upgrade' : 'new'}`}
                className='w-full'
              >
                <Button
                  disabled={submitting}
                  round='md'
                  text={t('setting:upgrade')}
                  variant='Green'
                  className='flex items-center justify-center w-full gap-2 group transition-all px-2'
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='white'
                      className='w-6 h-6'
                    >
                      <path d='M9.97.97a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72v3.44h-1.5V3.31L8.03 5.03a.75.75 0 01-1.06-1.06l3-3zM9.75 6.75v6a.75.75 0 001.5 0v-6h3a3 3 0 013 3v7.5a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3h3z' />
                      <path d='M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z' />
                    </svg>
                  }
                />
              </Link>
              {subData?.stripeSubscriptionId && subData?.plan !== 'FREE' && (
                <Link href={`/pricing?mode=downgrade`} className='w-full'>
                  <Button
                    disabled={submitting}
                    round='full'
                    text={t('setting:downgrade')}
                    variant='Gray'
                    className='flex items-center justify-center w-full gap-2 group transition-all px-2'
                    icon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='White'
                        className='w-6 h-6'
                      >
                        <path
                          fill-rule='evenodd'
                          d='M9.75 6.75h-3a3 3 0 00-3 3v7.5a3 3 0 003 3h7.5a3 3 0 003-3v-7.5a3 3 0 00-3-3h-3V1.5a.75.75 0 00-1.5 0v5.25zm0 0h1.5v5.69l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V6.75z'
                          clip-rule='evenodd'
                        />
                        <path d='M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z' />
                      </svg>
                    }
                  />
                </Link>
              )}

              {subData?.stripeSubscriptionId && subData?.plan !== 'FREE' && (
                <Button
                  onClick={() => {
                    showModal(MODAL_TYPES.CANCEL_SUBSCRIPTION_CONFIRM, {
                      handleConfirm: () => {
                        hideModal();
                        cancelSubscriptionHandler(subData?.stripeSubscriptionId);
                      },
                    });
                  }}
                  disabled={submitting}
                  round='full'
                  text={submitting ? 'Unsubscribing' : 'Unsubscribe'}
                  variant='Red'
                  className='flex items-center justify-center w-full gap-2 group bg-red-500 hover:bg-red-600 transition-all px-2'
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='white'
                      className='w-6 h-6'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
                        clip-rule='evenodd'
                      />
                    </svg>
                  }
                />
              )}
            </div>
          </fieldset>
        )}
      </div>
    </div>
  );
};

export default UserProfileScreen;
