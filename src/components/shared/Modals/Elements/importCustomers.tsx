import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {CSVLink} from 'react-csv';
import Modal from '../Modal';
import Button from '../../Button';
import {ThreeDots} from 'react-loader-spinner';
import ErrorMessage from '../../ErrorMessage';
import InformationalMessage from '../../InformationalMessage';

const ImportCustomersModal = el => {
  const {data: session} = useSession();
  const {hideModal} = ModalContextProvider();
  const [ImportCustomers, {loading}] = useMutation(mutations.ImportCustomers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [CSVData, setCSVData] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const handleImport = async () => {
    try {
      setSubmitting(true);
      const response = await ImportCustomers({
        variables: {
          fleetId: el?.fleetId,
          file: CSVData.target.files[0],
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      setSubmitting(false);
      if (response?.data?.importCustomersInFleet?.response?.status !== 200) {
        setError(response?.data?.importCustomersInFleet?.response?.message);
        return;
      }
      if (response?.data?.importCustomersInFleet?.response?.status === 200) {
        setError('');
        setSuccessMessage(response?.data?.importCustomersInFleet?.response?.message);
        setTimeout(() => {
          setSuccessMessage('');
          router.reload();
          hideModal();
        }, 3000);
      }
    } catch (e) {
      setSubmitting(false);
      console.log(e);
    }
  };

  return (
    <Modal title={`Import Customers`} extraSmall preventClose={submitting}>
      {loading && (
        <div className='fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='flex flex-col items-center rounded bg-white p-4 text-center shadow-md dark:bg-black'>
            <ThreeDots
              height='56'
              width='56'
              radius='9'
              color={'green'}
              ariaLabel='three-dots-loading'
              visible={true}
            />
          </div>
        </div>
      )}
      <div className='mt-2'>
        <CSVLink
          data={[
            {
              customerId: '234',
              customerName: 'test',
              customerPhone: '01 999 9999',
              customerEmail: 'test@test.com',
              customerAddress: '24',
              customerStreet: 'Oakwood Avenue',
              customerCity: 'Dublin',
              customerCounty: 'Co. Dublin',
              customerEircode: 'D12 XY34',
              customerCountry: 'Ireland',
            },
          ]}
          filename={'Import Customers.csv'}
        >
          <p className='mb-1'>Please use this to insert data.</p>
          <Button variant='Green' disabled={submitting}>
            Sample CSV
          </Button>
        </CSVLink>
      </div>
      <div className='flex justify-center mt-4 ml-3'>
        <input type='file' accept='.csv' onChange={e => setCSVData(e)} />
      </div>
      <div className='flex flex-wrap gap-2 mt-5 sm:flex-nowrap'>
        <Button variant='Primary' disabled={submitting || !CSVData} onClick={handleImport}>
          {' '}
          Import
        </Button>
      </div>
      <ErrorMessage title={error} className='mt-4' />
      <InformationalMessage title={successMessage} className='mt-4' />
    </Modal>
  );
};
export default ImportCustomersModal;
