import {useState} from 'react';
import {useLazyQuery} from '@apollo/client';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';
import {ThreeDots} from 'react-loader-spinner';
import queries from '@/constants/GraphQL/Fleet/queries';
import createWorksheet from '@/utils/createWorksheet';

const ExportDockets = (data: any) => {
  const {hideModal} = ModalContextProvider();
  const {t} = useTranslation();
  const [error, setError] = useState('');
  const [GetDocketsByExportFunc, {loading: GetDocketsByExportLoading}] = useLazyQuery(
    data?.isOwner ? queries.getAllDocketsByFleetId : queries.GetDocketsByFleetId,
    {
      onCompleted: d => {
        try {
          const checkStatus = data?.isOwner ? d?.getAllDocketsByFleetId : d?.getDocketsByFleetId;
          if (checkStatus?.response?.status === 200) {
            let docketData;
            if (data?.isOwner) {
              docketData = d?.getAllDocketsByFleetId?.docketData;
            } else {
              docketData = d?.getDocketsByFleetId?.docketData;
            }
            /* eslint-disable-next-line */
            const parsedDocketsData = docketData?.map(el => {
              if (el?.docketData) {
                const {
                  individualDocketNumber,
                  jobId,
                  prefix,
                  docketNumber,
                  date,
                  time,
                  vehicleRegistration,
                  generalPickupDescription,
                  isWaste,
                  wastes,
                  collectedFromWasteFacility,
                  collectionPointAddress,
                  collectionPointStreet,
                  collectionPointCity,
                  collectionPointCounty,
                  collectionPointEircode,
                  collectionPointCountry,
                  isLoadForExport,
                  portOfExport,
                  countryOfDestination,
                  facilityAtDestination,
                  tfsReferenceNumber,
                  additionalInformation,
                } = el.docketData;
                const {
                  customerName,
                  customerPhone,
                  customerAddress,
                  customerEmail,
                  customerId,
                  customerStreet,
                  customerCity,
                  customerCounty,
                  customerEircode,
                  customerCountry,
                } = el.customerContact;
                const {
                  destinationFacilityLatitude,
                  destinationFacilityLongitude,
                  destinationFacilityName,
                  destinationFacilityAuthorisationNumber,
                  destinationFacilityAddress,
                  destinationFacilityStreet,
                  destinationFacilityCity,
                  destinationFacilityCounty,
                  destinationFacilityEircode,
                  destinationFacilityCountry,
                } = el?.destinationFacility?.destinationFacilityData ?? {};
                return {
                  driverEmail: el.creatorEmail,
                  customerId,
                  customerName,
                  customerPhone,
                  customerEmail,
                  customerAddress,
                  customerStreet,
                  customerCity,
                  customerCounty,
                  customerEircode,
                  customerCountry: customerCountry || 'Ireland',
                  jobId,
                  individualDocketNumber,
                  prefix,
                  docketNumber,
                  date,
                  time,
                  vehicleRegistration,
                  generalPickupDescription,
                  isWaste,
                  wastes,
                  collectedFromWasteFacility,
                  collectionPointAddress,
                  collectionPointStreet,
                  collectionPointCity,
                  collectionPointCounty,
                  collectionPointEircode,
                  collectionPointCountry: collectionPointCountry || 'Ireland',
                  destinationFacilityLatitude,
                  destinationFacilityLongitude,
                  destinationFacilityName,
                  destinationFacilityAuthorisationNumber,
                  destinationFacilityAddress,
                  destinationFacilityStreet,
                  destinationFacilityCity,
                  destinationFacilityCounty,
                  destinationFacilityEircode,
                  destinationFacilityCountry: destinationFacilityCountry || 'Ireland',
                  isLoadForExport,
                  portOfExport,
                  countryOfDestination,
                  facilityAtDestination,
                  tfsReferenceNumber,
                  additionalInformation,
                };
              }
            });
            (async () => {
              await createWorksheet(parsedDocketsData);
            })();
          } else {
            setError(d?.getAllDocketsByFleetId?.response?.message);
          }
        } catch (error) {
          console.error('Error occurred:', error);
          setError('An error occurred while processing data.');
        }
      },
    }
  );
  return (
    <Modal title={`${t('page:export_dockets')}`} medium preventClose={GetDocketsByExportLoading}>
      {GetDocketsByExportLoading && (
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
            <p className='mt-2'>{t('common:exporting')}</p>
          </div>
        </div>
      )}
      <div>
        <p className='text-black'>{t('page:export_dockets_description')}</p>
      </div>
      <div className='flex flex-row flex-wrap sm:flex-nowrap justify-end gap-2 mt-2'>
        <button
          type='button'
          className='px-6 py-2 border rounded border-mainGreen hover:bg-mainGreen'
          onClick={() => {
            hideModal();
          }}
        >
          {t('common:cancel')}
        </button>
        <button
          onClick={async () => {
            await GetDocketsByExportFunc({
              variables: {
                fleetId: data?.fleetId,
                searchParams: data?.searchParams,
              },
              context: {
                headers: {
                  Authorization: data?.accessToken,
                },
              },
            });
            hideModal();
          }}
          className='px-6 py-2 text-white rounded bg-mainGreen'
          type='button'
        >
          {GetDocketsByExportLoading ? t('common:exporting') : t('common:export')}
        </button>
      </div>
      {error && <span className='text-red-400'>{error}</span>}
    </Modal>
  );
};
export default ExportDockets;
