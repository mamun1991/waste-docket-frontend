import {FormEvent, useState} from 'react';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import mutations from '@/constants/GraphQL/User/mutations';
import {useRouter} from 'next/router';
import Modal from '../Modal';
import {countries} from 'countries-list';

const Subscribe = ({mode, selectedPlan}: {mode: string; selectedPlan: string}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const {data: session} = useSession();
  const [submitting, setSubmitting] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const {hideModal} = ModalContextProvider();
  const [error, setError] = useState<null | string>(null);

  const [mutate] = useMutation(mutations.CreateSubscription);
  const [input, setInput] = useState({
    country: 'IE',
    state: '',
    city: '',
    postalCode: '',
  });

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name} = e.target;
    const {value} = e.target;
    setInput({...input, [name]: value});
  };

  const createSubscriptionHandler = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    if (!stripe || !elements)
      return setError('Missing stripe/elements, please refresh page. Thanks');
    try {
      const cardElement = elements.getElement(CardNumberElement);
      const cvcElement = elements.getElement(CardCvcElement);
      const expiryElement = elements.getElement(CardExpiryElement);

      if (!cardElement || !cvcElement || !expiryElement) return setError('Invalid card details');
      if (mode === 'new') {
        const {paymentMethod, error}: any = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: session?.userDetails?.personalDetails?.name,
            email: session?.userDetails?.personalDetails?.email,
            address: {
              country: input?.country,
              state: input?.state,
              city: input?.city,
              postal_code: input?.postalCode,
            },
          },
        });
        if (error) {
          setSubmitting(false);
          return setError(error?.message);
        }
        mutate({
          variables: {
            paymentMethodId: paymentMethod?.id,
            plan: selectedPlan,
            user: session?.userDetails?._id,
            mode,
          },
          onCompleted(data) {
            if (data?.createSubscription.status === 200) {
              // hideModal();
              router.reload();
            } else {
              setError(data?.createSubscription.message);
              setSubmitting(false);
            }
          },
          onError(err) {
            setError(err?.message);
            setSubmitting(false);
          },
        });
      } else {
        mutate({
          variables: {
            paymentMethodId: '',
            plan: selectedPlan,
            user: session?.userDetails?._id,
            mode,
          },
          onCompleted(data) {
            if (data?.createSubscription?.status === 200) {
              router.reload();
              hideModal();
            } else {
              setError(data?.createSubscription?.message);
              setSubmitting(false);
            }
          },
          onError(err) {
            setError(err?.message);
            setSubmitting(false);
          },
        });
      }
    } catch (mainError: any) {
      setSubmitting(false);
      setError(mainError?.message);
      console.error('components/vendor/subscription/SubscriptionCard.tsx', mainError);
    }

    return null;
  };

  return (
    <Modal title={t('setting:create_subscription')} medium preventClose={submitting}>
      <form
        className='w-full flex justify-center items-center gap-4 flex-col'
        onSubmit={createSubscriptionHandler}
      >
        <div className='w-full flex justify-center items-start flex-col'>
          <label htmlFor={'CardNumberElement'} className={`block text-[14px] text-black mb-1`}>
            {t('common:Country')}*
          </label>
          <select
            required
            name='country'
            className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
            onChange={inputHandler}
            value={input.country}
          >
            {Object.entries(countries).map(([code, countryInfo]) => (
              <option key={code} value={code}>
                {countryInfo.name}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex justify-center items-start flex-col'>
          <label htmlFor={'CardNumberElement'} className={`block text-[14px] text-black mb-1`}>
            State*
          </label>
          <input
            required
            value={input?.state}
            onChange={inputHandler}
            name='state'
            type='text'
            className='w-full px-3 h-[38.4px] border border-gray-300 rounded-[0.25rem] text-black placeholder:text-black/30'
            placeholder='Ulster'
          />
        </div>
        <div className='w-full flex justify-center items-start flex-col'>
          <label htmlFor={'CardNumberElement'} className={`block text-[14px] text-black mb-1`}>
            City*
          </label>
          <input
            required
            value={input?.city}
            onChange={inputHandler}
            name='city'
            type='text'
            className='w-full px-3 h-[38.4px] border border-gray-300 rounded-[0.25rem] text-black placeholder:text-black/30'
            placeholder='Londonderry'
          />
        </div>
        <div className='w-full flex justify-center items-start flex-col'>
          <label htmlFor={'CardNumberElement'} className={`block text-[14px] text-black mb-1`}>
            Postal code*
          </label>
          <input
            required
            value={input?.postalCode}
            onChange={inputHandler}
            name='postalCode'
            type='text'
            className='w-full px-3 h-[38.4px] leading-[28px] border border-gray-300 rounded-[0.25rem] text-black placeholder:text-black/30'
            placeholder='Postal code'
          />
        </div>
        <div className='w-full flex justify-center items-start flex-col'>
          <label htmlFor={'CardNumberElement'} className={`block text-[14px] text-black mb-1`}>
            Card number*
          </label>
          <CardNumberElement
            onFocus={() => setError(null)}
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-[0.25rem] text-black`}
            options={{
              style: {
                base: {
                  '::placeholder': {
                    color: '#0000004d',
                  },
                },
              },
            }}
          />
        </div>
        <div className='w-full flex justify-center items-start flex-col'>
          <label htmlFor={'CardNumberElement'} className={`block text-[14px] text-black mb-1 `}>
            CVC*
          </label>
          <CardCvcElement
            onFocus={() => setError(null)}
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-[0.25rem] text-black`}
            options={{
              style: {
                base: {
                  '::placeholder': {
                    color: '#0000004d',
                  },
                },
              },
            }}
          />
        </div>
        <div className='w-full flex justify-center items-start flex-col'>
          <label htmlFor={'CardNumberElement'} className={`block text-[14px] text-black mb-1`}>
            Expiry date*
          </label>
          <CardExpiryElement
            onFocus={() => setError(null)}
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-[0.25rem] text-black`}
            options={{
              style: {
                base: {
                  '::placeholder': {
                    color: '#0000004d',
                  },
                },
              },
            }}
          />
        </div>
        {error && <p className='text-[14px] text-red-800'>{error}</p>}
        <div className='flex justify-center items-center gap-4'>
          <button className='bg-primary rounded p-3 text-white' type='submit' disabled={submitting}>
            {submitting ? t('setting:subscribing') : t('setting:subscribe')}
          </button>
          <button
            type='button'
            className='bg-red-400 rounded p-3 text-white'
            disabled={submitting}
            onClick={() => hideModal()}
          >
            {t('setting:cancel')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default Subscribe;
