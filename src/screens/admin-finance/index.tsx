'use client';
import {Fragment, useState} from 'react';
import queries from '@/constants/GraphQL/User/queries';
import {useMutation, useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import {RiRefund2Line, RiDeleteBin5Line} from 'react-icons/ri';
import useTranslation from 'next-translate/useTranslation';
import mutations from '@/constants/GraphQL/User/mutations';
import {useRouter} from 'next/router';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import {MODAL_TYPES} from '@/constants/context/modals';

function AdminFinanceScreen() {
  const {showModal, hideModal} = ModalContextProvider();
  const router = useRouter();
  const [mutate] = useMutation(mutations.RefundAndUnsubscribe);
  const [mute] = useMutation(mutations.DeleteStripeCustomer);
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [starting_after, set_starting_after] = useState<string>('undefined');
  const [paginationMode, setPaginationMode] = useState<string>('next');
  const [error, setError] = useState<string | null>(null);
  const {data: getSubscribedStripeUsers, loading} = useQuery(queries.getSubscribedStripeUsers, {
    variables: {
      token: session?.accessToken,
      pageSize: rowsPerPage.toString(),
      pageNumber: selectedPage.toString(),
      starting_after: starting_after,
      paginationMode,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  if (loading) {
    return <Loader />;
  }

  const refundAndUnsubscribeHandler = (
    latest_invoice: string,
    customerId: string,
    email: string,
    subscriptionId: string,
    productName: string
  ) => {
    setError(null);
    try {
      mutate({
        variables: {
          latest_invoice,
          customerId,
          email,
          subscriptionId,
          productName,
        },
        onCompleted(data) {
          if (data?.refundAndUnsubscribe?.status === 200) {
            hideModal();
            router.reload();
          } else {
            hideModal();
            setError(data?.refundAndUnsubscribe?.message);
            setTimeout(() => {
              setError(null);
            }, 10000);
          }
        },
        onError(err) {
          hideModal();
          setError(err?.message);
          setTimeout(() => {
            setError(null);
          }, 10000);
          console.log('err', err);
        },
      });
    } catch (mainError: any) {
      hideModal();
      setError(mainError?.message);
      setTimeout(() => {
        setError(null);
      }, 10000);
      console.error('refundAndUnsubscribeHandler', mainError);
    }
  };

  const deleteCustomerHandler = (
    latest_invoice: string,
    customerId: string,
    email: string,
    subscriptionId: string,
    productName: string
  ) => {
    console.log({
      latest_invoice,
      customerId,
      email,
      subscriptionId,
      productName,
    });
    setError(null);
    try {
      mute({
        variables: {
          latest_invoice,
          customerId,
          email,
          subscriptionId,
          productName,
        },
        onCompleted(data) {
          if (data?.deleteStripeCustomer?.status === 200) {
            hideModal();
            router.reload();
          } else {
            hideModal();
            setError(data?.deleteStripeCustomer?.message);
            setTimeout(() => {
              setError(null);
            }, 10000);
          }
        },
        onError(err) {
          hideModal();
          setError(err?.message);
          setTimeout(() => {
            setError(null);
          }, 10000);
          console.log('err', err);
        },
      });
    } catch (mainError: any) {
      hideModal();
      setError(mainError?.message);
      setTimeout(() => {
        setError(null);
      }, 10000);
      console.error('deleteCustomerHandler', mainError);
    }
  };

  return (
    <Fragment>
      <h1 className='text-xl font-bold text-primary'>Finance</h1>
      <div className='container'>
        <div className='overflow-x-auto lg:-mx-4 pb-32 w-[95vw] lg:w-[98vw] xl:w-full mx-auto'>
          <div className='inline-block h-full min-w-full py-4 md:py-0 sm:px-4 lg:px-8'>
            <div>
              <table
                className={`min-w-full sm:min-w-full md:min-w-full text-center table-fixed md:mt-5 mt-2`}
              >
                <thead className='border-b bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%] px-2 text-sm font-bold text-black py-2 whitespace-nowrap text-left'
                    >
                      Customer
                    </th>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%] cursor-pointer text-sm font-bold text-black px-6 py-2 whitespace-nowrap text-left'
                    >
                      Plan
                    </th>
                    <th
                      scope='col'
                      className='min-w-[20%] w-[20%] max-w-[20%] cursor-pointer text-sm font-bold text-black px-2 py-2 whitespace-nowrap text-left'
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='overflow-y-scroll'>
                  {getSubscribedStripeUsers?.getSubscribedStripeUsers?.data?.map(
                    (customer: any, index: number) => {
                      return (
                        <tr key={index} className='w-20 bg-white border-b'>
                          <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm capitalize text-black px-2 py-2 text-left'>
                            {customer?.name}
                          </td>
                          <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-6 py-2 text-left'>
                            {customer?.productName ? (
                              customer?.isSubscriptionCancelled ? (
                                <Fragment>
                                  {customer?.productName}{' '}
                                  <span className='text-red-600 font-semibold'>
                                    {' '}
                                    Cancelling at{' '}
                                    {new Date(
                                      customer?.isSubscriptionCancelled * 1000
                                    ).toLocaleString()}
                                  </span>
                                </Fragment>
                              ) : (
                                <Fragment>
                                  {customer?.productName}{' '}
                                  <span className='text-green-600 font-semibold capitalize'>
                                    ({customer?.subscriptionStatus})
                                  </span>
                                </Fragment>
                              )
                            ) : (
                              `No invoice yet`
                            )}
                          </td>
                          <td className='min-w-[20%] w-[20%] max-w-[20%] text-sm flex justify-start items-center gap-2 text-black px-2 py-2'>
                            <button
                              onClick={() => {
                                if (
                                  !customer?.latest_invoice ||
                                  !customer?.productName ||
                                  !customer?.subscriptionId
                                ) {
                                  setTimeout(() => {
                                    setError(null);
                                  }, 10000);
                                  return setError(
                                    `This customer has no invoice yet, so you can't trigger action.`
                                  );
                                }
                                showModal(MODAL_TYPES.CONFIRM, {
                                  handleConfirm: () => {
                                    refundAndUnsubscribeHandler(
                                      customer?.latest_invoice,
                                      customer?.customerId,
                                      customer?.email,
                                      customer?.subscriptionId,
                                      customer?.productName
                                    );
                                  },
                                  title: 'Refund & Unsubscribe',
                                  message: 'Are you sure?',
                                  subMessage: 'Refund will take 5-10 days.',
                                });
                              }}
                              className='tooltip'
                            >
                              <RiRefund2Line size={20} />
                              <span className='tooltiptext'>Refund & Unsubscribe</span>
                            </button>
                            {customer?.isSubscriptionCancelled && (
                              <button
                                onClick={() => {
                                  if (
                                    !customer?.latest_invoice ||
                                    !customer?.productName ||
                                    !customer?.subscriptionId
                                  ) {
                                    setTimeout(() => {
                                      setError(null);
                                    }, 10000);
                                    return setError(
                                      `This customer has no invoice yet, so you can't trigger action.`
                                    );
                                  }
                                  if (!customer?.customerId) {
                                    setTimeout(() => {
                                      setError(null);
                                    }, 10000);
                                    return setError(
                                      `CUstomer Id is missing, can't feed to backend.`
                                    );
                                  }
                                  showModal(MODAL_TYPES.DELETE_CUSTOMER_CONFIRM, {
                                    handleConfirm: () => {
                                      deleteCustomerHandler(
                                        customer?.latest_invoice,
                                        customer?.customerId,
                                        customer?.email,
                                        customer?.subscriptionId,
                                        customer?.productName
                                      );
                                    },
                                    title: 'Delete customer',
                                    message: 'Are you sure?',
                                    subMessage: `This action wouldn't be reversible.`,
                                  });
                                }}
                                className='tooltip'
                              >
                                <RiDeleteBin5Line size={20} />
                                <span className='tooltiptext'>Delete User</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
              {getSubscribedStripeUsers?.getSubscribedStripeUsers?.data?.length === 0 ? (
                <div className='flex justify-center mt-5 text-2xl text-gray-500'>
                  {t('common:no_data')}
                </div>
              ) : null}
            </div>
            {error && <p className='text-red-600 mb-4 mt-6'>{error}</p>}
            <div className='w-full flex justify-between items-center mt-6'>
              <div>
                {getSubscribedStripeUsers?.getSubscribedStripeUsers?.totalCount > rowsPerPage && (
                  <div className='flex flex-col items-center gap-12 sm:flex-row sm:justify-center'>
                    <button
                      onClick={() => {
                        setSelectedPage(selectedPage - 1);
                        setPaginationMode('prev');
                        const data = getSubscribedStripeUsers?.getSubscribedStripeUsers?.data;
                        const reversed = data ? [...data].reverse() : [];
                        if (reversed.length > 0) {
                          set_starting_after(reversed[reversed.length - 1].customerId);
                        }
                      }}
                      disabled={selectedPage === 1}
                      className='flex h-4 w-4 items-center justify-center rounded-md border bg-white shadow-sm'
                    >
                      <span className='flex px-3 py-2 mx-1 text-base font-bold leading-tight text-gray-500 transition duration-150 ease-in-out bg-gray-200 rounded shadow cursor-pointer sm:block hover:bg-blue-700 hover:text-white focus:outline-none'>
                        {t('common:txt_Prev')}
                      </span>
                    </button>

                    <span className='text-mono-700'>
                      {t('page:Page')} {selectedPage} {t('page:of')}{' '}
                      {Math.ceil(
                        getSubscribedStripeUsers?.getSubscribedStripeUsers?.totalCount / rowsPerPage
                      )}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedPage(selectedPage + 1);
                        setPaginationMode('next');
                        set_starting_after(
                          getSubscribedStripeUsers?.getSubscribedStripeUsers?.data[
                            getSubscribedStripeUsers?.getSubscribedStripeUsers?.data?.length - 1
                          ].customerId
                        );
                      }}
                      disabled={
                        selectedPage ===
                        Math.ceil(
                          getSubscribedStripeUsers?.getSubscribedStripeUsers?.totalCount /
                            rowsPerPage
                        )
                      }
                      className='flex h-4 w-4 items-center justify-center rounded-md border bg-white shadow-sm'
                    >
                      <span className='flex px-3 py-2 mx-1 text-base font-bold leading-tight text-gray-500 transition duration-150 ease-in-out bg-gray-200 rounded shadow cursor-pointer sm:block hover:bg-blue-700 hover:text-white focus:outline-none'>
                        {t('common:txt_Next')}
                      </span>
                    </button>
                  </div>
                )}
              </div>
              {getSubscribedStripeUsers?.getSubscribedStripeUsers?.data?.length !== 0 && (
                <select
                  name='language'
                  className='block max-w-md py-2 pl-3 pr-10 overflow-hidden text-sm border-gray-300 rounded-md w-fit focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-base'
                  onChange={event => {
                    setRowsPerPage(Number(event.target.value));
                    setSelectedPage(1);
                    set_starting_after('undefined');
                    setPaginationMode('next');
                  }}
                >
                  <option value='10' selected={rowsPerPage === 10}>
                    10
                  </option>
                  <option value='50' selected={rowsPerPage === 50}>
                    50
                  </option>
                  <option value='100' selected={rowsPerPage === 100}>
                    100
                  </option>
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AdminFinanceScreen;
