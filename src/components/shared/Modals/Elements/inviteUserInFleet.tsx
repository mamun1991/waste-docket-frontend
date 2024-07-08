import {useContext, useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import queries from '@/constants/GraphQL/Fleet/queries';
import {FLEET_INITIAL_STATE, FLEET_VALIDATION} from '@/constants/yup/fleetInvite';
import Link from 'next/link';
import Modal from '../Modal';
import ErrorMessage from '../../ErrorMessage';
import InformationalMessage from '../../InformationalMessage';
import {useRouter} from 'next/router';
import {UserContext} from '@/context/user';

type Fleet = {
  _id: string;
  name: string;
  permitNumber: string;
  VAT: string;
  ownerEmail: string;
  membersEmail: string[];
};

const InviteUserInFleetModal = (fleet: Fleet) => {
  const {data: session} = useSession();
  const [UpgradePlanPop, setUpgradePlanPop] = useState(false);
  const router = useRouter();
  const userObject = useContext(UserContext);
  const [InviteUserInFleet, {loading: inviteLoading}] = useMutation(mutations.InviteUserInFleet, {
    refetchQueries: [
      {
        query: queries.GetFleetById,

        variables: {
          fleetId: fleet._id,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      },
    ],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const formik = useFormik({
    initialValues: FLEET_INITIAL_STATE,
    validationSchema: FLEET_VALIDATION,
    onSubmit: async function (values) {
      setSubmitting(true);
      setError('');
      setResponseMessage('');
      try {
        const response = await InviteUserInFleet({
          variables: {
            fleetInvitationData: {
              fleetId: fleet._id,
              email: values.email,
            },
          },
          context: {
            headers: {
              Authorization: session?.accessToken,
            },
          },
        });
        setSubmitting(false);
        if (response?.data?.inviteUserInFleet?.status === 403) {
          setError(response?.data?.inviteUserInFleet?.message);
          setUpgradePlanPop(true);
          return;
        }
        if (response?.data?.inviteUserInFleet?.status !== 200) {
          setError(response?.data?.inviteUserInFleet?.message);
          return;
        }
        if (response?.data?.inviteUserInFleet?.status === 200) {
          setResponseMessage(response?.data?.inviteUserInFleet?.message);
          hideModal();
          router.reload();
          return;
        }
        setError('');
        hideModal();
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <Modal
      title={UpgradePlanPop ? `Upgrade plan` : ` ${fleet.name}: ${t('common:add_driver')}`}
      medium
      preventClose={submitting || inviteLoading}
    >
      {UpgradePlanPop ? (
        <div className='w-full flex justify-center items-center flex-col gap-6'>
          <h3 className='text-green-900 text-[18px] mt-5 text-center font-medium'>{error}</h3>
          <div className='flex justify-center items-center gap-4'>
            <Link
              href={`/pricing?mode=${
                userObject?.user?.subscription?.stripeCustomerId ? 'upgrade' : 'new'
              }`}
              onClick={() => hideModal()}
              className='bg-primary rounded p-3 text-white capitalize'
            >
              {t('setting:upgrade')}
            </Link>
            <button
              type='button'
              className='bg-red-400 rounded p-3 text-white'
              disabled={submitting || inviteLoading}
              onClick={() => {
                if (submitting || inviteLoading) {
                  return;
                }
                hideModal();
              }}
            >
              {t('common:cancel')}
            </button>
          </div>
        </div>
      ) : (
        fleet && (
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div className='grid grid-cols-1 gap-x-4 w-full'>
                <div className='mb-4'>
                  <label htmlFor='email'>{t('common:email')}*</label>
                  <input
                    type='text'
                    name='email'
                    id='email'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-400'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    required
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className='text-red-400'>{formik.errors.email}</span>
                  )}
                </div>
              </div>

              <div className='text-center'>
                <button
                  className='bg-primary rounded p-3 text-white mt-5'
                  type='submit'
                  disabled={submitting || inviteLoading}
                >
                  {submitting || inviteLoading
                    ? t('common:sending_invite')
                    : t('common:send_invite')}
                </button>
                <button
                  type='button'
                  className='bg-red-400 rounded p-3 text-white ml-4'
                  disabled={submitting || inviteLoading}
                  onClick={() => {
                    if (submitting || inviteLoading) {
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
        )
      )}
    </Modal>
  );
};
export default InviteUserInFleetModal;
