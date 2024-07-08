import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/User/queries';
import Loader from '@/components/shared/Loader/Loader';
import {useRouter} from 'next/router';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from '@/constants/context/modals';

const keyFeatures = {
  basic: [
    {
      feature: true,
      text: 'Up to one driver',
    },
    {
      feature: true,
      text: 'Monthly billing cycle',
    },
    {
      feature: true,
      text: 'Onboarding training included',
    },
    {
      feature: true,
      text: 'Technical support via email',
    },
  ],
  standard: [
    {
      feature: true,
      text: 'Up to five drivers',
    },
    {
      feature: true,
      text: 'Monthly billing cycle',
    },
    {
      feature: true,
      text: 'Onboarding training included',
    },
    {
      feature: true,
      text: 'Technical support via email',
    },
  ],
  premium: [
    {
      feature: true,
      text: 'Up to fifteen drivers',
    },
    {
      feature: true,
      text: 'Monthly billing cycle',
    },
    {
      feature: true,
      text: 'Onboarding training included',
    },
    {
      feature: true,
      text: 'Technical support via email',
    },
  ],
  enterprise: [
    {
      feature: true,
      text: 'Unlimited drivers',
    },
    {
      feature: true,
      text: 'Monthly billing cycle',
    },
    {
      feature: true,
      text: 'Onboarding training included',
    },
    {
      feature: true,
      text: 'Technical support via email',
    },
    {
      feature: true,
      text: 'Technical support via phone',
    },
  ],
};

const PricePage = () => {
  const router = useRouter();
  const {query} = router;
  const {mode} = query;
  const [subMode, setSubMode] = useState<any>(null);
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const [subData, setSubData] = useState<any>(null);
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
    if (!session) return;
    if (mode && (mode === 'new' || mode === 'upgrade' || mode === 'downgrade')) {
      setSubMode(mode);
    }
    setSubData(GetUserById?.getUserById?.subscription);
  }, [GetUserById]);

  if (loading) {
    return <Loader />;
  }

  const {basic, enterprise, standard, premium} = keyFeatures;

  return (
    <section className='mt-8 w-full sm:min-h-screen mx-auto flex justify-center items-center flex-col py-16 px-4'>
      <h1 className='font-bold text-gray-900 text-2xl'>Choose a plan</h1>
      <div className='w-full grid lg:grid-cols-4 grid-cols-2 gap-6 mt-12'>
        {/* BASIC */}
        <div className='w-full shadow-pricingCard px-4 py-10 flex justify-center items-center flex-col relative after:h-[5px] after:w-full after:absolute after:top-[-5px] after:bg-mainGreen after:rounded-t-md rounded-b-md'>
          <h2 className='uppercase md:text-[16px] text-[14px] font-semibold text-gray-600 tracking-wide'>
            Basic
          </h2>
          <div className='flex gap-1 text-gray-600 mt-2'>
            <span className='mt-2'>€</span>
            <h3 className='text-2xl text-black'>89 + VAT</h3>
            <span className='mt-8'>/month</span>
          </div>
          {/* <div className='border-[1px] border-gray-600 w-[100px] my-4' /> */}
          <div className='w-full flex justify-center items-start flex-col gap-2 min-h-[250px]'>
            {basic?.map((item: any, index: number) => (
              <aside
                key={index}
                className={`flex justify-center items-center gap-2 ${
                  item?.feature ? 'text-gray-900' : 'text-gray-400'
                } `}
              >
                {item?.feature ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M4.5 12.75l6 6 9-13.5'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                )}

                <p className='md:text-[16px] text-[14px] mb-1'>{item.text}</p>
              </aside>
            ))}
          </div>
          <button
            onClick={() => {
              if (!mode) return;
              showModal(MODAL_TYPES.SUBSCRIBE, {
                mode: subMode,
                selectedPlan: 'BASIC',
              });
            }}
            disabled={!session || subData?.plan === 'BASIC' || !subMode}
            type='button'
            className={`w-full rounded-full h-[40px] ${
              subData?.plan === 'BASIC' ? 'bg-gray-700' : 'bg-mainGreen hover:bg-mainGreen/90'
            } tracking-wide mt-8 md:text-[16px] text-[14px] uppercase text-white`}
          >
            {subData?.plan === 'BASIC' ? 'Chosen' : 'Choose BASIC'}
          </button>
        </div>
        {/* STANDARD */}
        <div className='w-full shadow-pricingCard px-4 py-10 flex justify-center items-center flex-col relative after:h-[5px] after:w-full after:absolute after:top-[-5px] after:bg-mainGreen after:rounded-t-md rounded-b-md'>
          <h2 className='uppercase md:text-[16px] text-[14px] font-semibold text-gray-600 tracking-wide'>
            STANDARD
          </h2>
          <div className='flex gap-1 text-gray-600 mt-2'>
            <span className='mt-2'>€</span>
            <h3 className='text-2xl text-black'>149 + VAT</h3>
            <span className='mt-8'>/month</span>
          </div>
          {/* <div className='border-[1px] border-gray-600 w-[100px] my-4' /> */}
          <div className='w-full flex justify-center items-start flex-col gap-2 min-h-[250px]'>
            {standard?.map((item: any, index: number) => (
              <aside
                key={index}
                className={`flex justify-center items-center gap-2 ${
                  item?.feature ? 'text-gray-900' : 'text-gray-400'
                } `}
              >
                {item?.feature ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M4.5 12.75l6 6 9-13.5'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                )}

                <p className='md:text-[16px] text-[14px] mb-1'>{item.text}</p>
              </aside>
            ))}
          </div>
          <button
            onClick={() => {
              if (!mode) return;
              showModal(MODAL_TYPES.SUBSCRIBE, {
                mode: subMode,
                selectedPlan: 'STANDARD',
              });
            }}
            disabled={!session || subData?.plan === 'STANDARD' || !subMode}
            type='button'
            className={`w-full rounded-full h-[40px] ${
              subData?.plan === 'STANDARD' ? 'bg-gray-700' : 'bg-mainGreen hover:bg-mainGreen/90'
            } tracking-wide mt-8 md:text-[16px] text-[14px] uppercase text-white`}
          >
            {subData?.plan === 'STANDARD' ? 'Chosen' : 'Choose STANDARD'}
          </button>

          {/* popular Label */}
          <aside className='absolute -top-[10px] -left-[6px] w-[100px] h-[100px] pointer-events-none'>
            <Image
              src={'/assets/images/label.png'}
              alt='popular subscription plan'
              fill
              className='object-fill pointer-events-none'
            />
            <p className='text-white text-[14px] uppercase -rotate-45 absolute top-[27%] left-[4%] font-bold tracking-wide'>
              Popular
            </p>
          </aside>
        </div>
        {/* PREMIUM */}
        <div className='w-full shadow-pricingCard px-4 py-10 flex justify-center items-center flex-col relative after:h-[5px] after:w-full after:absolute after:top-[-5px] after:bg-mainGreen after:rounded-t-md rounded-b-md'>
          <h2 className='uppercase md:text-[16px] text-[14px] font-semibold text-gray-600 tracking-wide'>
            PREMIUM
          </h2>
          <div className='flex gap-1 text-gray-600 mt-2'>
            <span className='mt-2'>€</span>
            <h3 className='text-2xl text-black'>199 + VAT</h3>
            <span className='mt-8'>/month</span>
          </div>
          {/* <div className='border-[1px] border-gray-600 w-[100px] my-4' /> */}
          <div className='w-full flex justify-center items-start flex-col gap-2 min-h-[250px]'>
            {premium?.map((item: any, index: number) => (
              <aside
                key={index}
                className={`flex justify-center items-center gap-2 ${
                  item?.feature ? 'text-gray-900' : 'text-gray-400'
                } `}
              >
                {item?.feature ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M4.5 12.75l6 6 9-13.5'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                )}

                <p className='md:text-[16px] text-[14px] mb-1'>{item.text}</p>
              </aside>
            ))}
          </div>
          <button
            onClick={() => {
              if (!mode) return;
              showModal(MODAL_TYPES.SUBSCRIBE, {
                mode: subMode,
                selectedPlan: 'PREMIUM',
              });
            }}
            disabled={!session || subData?.plan === 'PREMIUM' || !subMode}
            type='button'
            className={`w-full rounded-full h-[40px] ${
              subData?.plan === 'PREMIUM' ? 'bg-gray-700' : 'bg-mainGreen hover:bg-mainGreen/90'
            } tracking-wide mt-8 md:text-[16px] text-[14px] uppercase text-white`}
          >
            {subData?.plan === 'PREMIUM' ? 'Chosen' : 'Choose PREMIUM'}
          </button>
        </div>
        {/* ENTERPRISE */}
        <div className='w-full shadow-pricingCard px-4 py-10 flex justify-center items-center flex-col relative after:h-[5px] after:w-full after:absolute after:top-[-5px] after:bg-mainGreen after:rounded-t-md rounded-b-md'>
          <h2 className='uppercase md:text-[16px] text-[14px] font-semibold text-gray-600 tracking-wide'>
            ENTERPRISE
          </h2>
          <div className='flex gap-1 text-gray-600 mt-2'>
            <span className='mt-2'>€</span>
            <h3 className='text-2xl text-black'>499 + VAT</h3>
            <span className='mt-8'>/month</span>
          </div>
          {/* <div className='border-[1px] border-gray-600 w-[100px] my-4' /> */}
          <div className='w-full flex justify-center items-start flex-col gap-2 min-h-[250px]'>
            {enterprise?.map((item: any, index: number) => (
              <aside
                key={index}
                className={`flex justify-center items-center gap-2 ${
                  item?.feature ? 'text-gray-900' : 'text-gray-400'
                } `}
              >
                {item?.feature ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M4.5 12.75l6 6 9-13.5'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                )}

                <p className='md:text-[16px] text-[14px] mb-1'>{item.text}</p>
              </aside>
            ))}
          </div>
          <button
            onClick={() => {
              if (!mode) return;
              showModal(MODAL_TYPES.SUBSCRIBE, {
                mode: subMode,
                selectedPlan: 'ENTERPRISE',
              });
            }}
            disabled={!session || subData?.plan === 'ENTERPRISE' || !subMode}
            type='button'
            className={`w-full rounded-full h-[40px] ${
              subData?.plan === 'ENTERPRISE' ? 'bg-gray-700' : 'bg-mainGreen hover:bg-mainGreen/90'
            } tracking-wide mt-8 md:text-[16px] text-[14px] uppercase text-white`}
          >
            {subData?.plan === 'ENTERPRISE' ? 'Chosen' : 'Choose ENTERPRISE'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricePage;
