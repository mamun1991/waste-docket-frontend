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

const CreateSubscription = ({mode, currentPlan}: {mode: string; currentPlan: string}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const {data: session} = useSession();
  const [submitting, setSubmitting] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const {hideModal} = ModalContextProvider();
  const [error, setError] = useState<null | string>(null);
  const [selectedPlan, setSelectedPlan] = useState<
    null | 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE'
  >(null);

  const [mutate] = useMutation(mutations.CreateSubscription);
  const [input, setInput] = useState({
    country: '',
    state: '',
    city: '',
    postalCode: '',
  });

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const {paymentMethod, er}: any = await stripe.createPaymentMethod({
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
        if (er) return setError(er?.message);
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
            if (data?.createSubscription.status === 200) {
              router.reload();
              hideModal();
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
      }
    } catch (mainError: any) {
      setSubmitting(false);
      setError(mainError?.message);
      console.error('components/vendor/subscription/SubscriptionCard.tsx', mainError);
    }

    return null;
  };

  const availablePlans = () => {
    if (mode === 'new' || currentPlan === 'FREE')
      return ['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'];
    switch (mode) {
      case 'downgrade':
        switch (currentPlan) {
          case 'STANDARD':
            return ['BASIC'];
          case 'PREMIUM':
            return ['BASIC', 'STANDARD'];
          case 'ENTERPRISE':
            return ['BASIC', 'STANDARD', 'PREMIUM'];
          default:
            return [];
        }
      case 'upgrade':
        switch (currentPlan) {
          case 'PREMIUM':
            return ['ENTERPRISE'];
          case 'STANDARD':
            return ['PREMIUM', 'ENTERPRISE'];
          case 'BASIC':
            return ['STANDARD', 'PREMIUM', 'ENTERPRISE'];
          default:
            return [];
        }
      default:
        return ['BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'];
    }
  };

  const getMaxLimit = (plan: string) => {
    switch (plan) {
      case 'BASIC':
        return 1;
      case 'STANDARD':
        return 5;
      case 'PREMIUM':
        return 15;
      case 'ENTERPRISE':
        return 'Unlimited';
      default:
        return 1;
    }
  };

  return (
    <Modal
      title={selectedPlan ? t('setting:create_subscription') : t('setting:choose_plan')}
      medium
      preventClose={submitting}
    >
      {!selectedPlan && (
        <div className='w-full flex justify-center items-center gap-4 flex-col'>
          {availablePlans()?.length > 0 ? (
            availablePlans()?.map((item: string) => (
              <button
                key={item}
                onClick={() =>
                  setSelectedPlan(item as 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE')
                }
                className='flex items-center justify-between gap-4 w-full h-16 border border-gray-200 px-8 shadow-md rounded-md text-primary font-semibold hover:shadow-lg transition-all'
              >
                <h3>{item}</h3>
                <p className='font-normal'>{getMaxLimit(item)}</p>
              </button>
            ))
          ) : (
            <p className='mx-auto'>No plan found.</p>
          )}
          <div className='w-full flex justify-center items-center mt-6'>
            <button
              type='button'
              className='bg-red-400 rounded p-3 text-white'
              disabled={submitting}
              onClick={() => hideModal()}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {selectedPlan && (
        <form
          className='w-full flex justify-center items-center gap-4 flex-col'
          onSubmit={createSubscriptionHandler}
        >
          <div className='w-full flex justify-center items-start flex-col'>
            <label htmlFor={'CardNumberElement'} className={`block text-[14px] text-black mb-1`}>
              Country (Code)*
            </label>
            <input
              required
              value={input?.country}
              onChange={inputHandler}
              name='country'
              type='text'
              className='w-full px-3 h-[38.4px] border border-gray-300 rounded-[0.25rem] text-black placeholder:text-black/30'
              placeholder='IE'
            />
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
            <button
              className='bg-primary rounded p-3 text-white'
              type='submit'
              disabled={submitting}
            >
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
      )}
    </Modal>
  );
};
export default CreateSubscription;
