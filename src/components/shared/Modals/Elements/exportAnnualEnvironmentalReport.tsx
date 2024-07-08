import {useState} from 'react';
import {useLazyQuery} from '@apollo/client';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';
import {ThreeDots} from 'react-loader-spinner';
import queries from '@/constants/GraphQL/Fleet/queries';
import createWorkBook from '@/utils/createWorkBook';
import * as XLSX from 'xlsx';

const ExportAnnualEnvironmentalReport = (propsData: any) => {
  const {hideModal} = ModalContextProvider();
  const {t} = useTranslation();
  const [error, setError] = useState('');
  const [GetEnvironmentalReport, {loading: GetEnvironmentalReportLoading}] = useLazyQuery(
    queries.GetEnvironmentalReport,
    {
      onCompleted: data => {
        try {
          if (data?.getEnvironmentalReport?.response?.status === 200) {
            const {tab1Data, tab2Data, tab3Data} = data.getEnvironmentalReport;
            const sheet1Data = tab1Data || [];
            const sheet2Data = tab2Data || [];
            const sheet3Data = tab3Data || [];
            const formatRows = data => {
              return data.map(item => ({
                'Waste Code': item?.wasteLoWCode || '',
                'Local Authority Area': item?.localAuthorityOfOrigin || '',
                Quantity: item?.quantity || '',
                'Going To Facility': item?.goingToFacility || '',
                'Collected From Facility': item?.collectedFromFacility || '',
              }));
            };

            const sheet1Rows = sheet1Data.length ? formatRows(sheet1Data) : [{}, {}, {}];
            const sheet2Rows = sheet2Data.length ? formatRows(sheet2Data) : [{}, {}, {}];
            const sheet3Rows = sheet3Data.length ? formatRows(sheet3Data) : [{}, {}, {}];

            const workbook = createWorkBook([sheet1Rows, sheet2Rows, sheet3Rows]);
            XLSX.writeFile(workbook, `Environmental Report-${propsData?.fleetName}.xlsx`);
          } else {
            setError(data?.getEnvironmentalReport?.response?.message || '');
          }
        } catch (error) {
          console.error('Error occurred:', error);
          setError('An error occurred while processing data.');
        }
      },
    }
  );
  return (
    <Modal
      title={`${t('page:export_annual_environmental_report')}`}
      medium
      preventClose={GetEnvironmentalReportLoading}
    >
      {GetEnvironmentalReportLoading && (
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
        <p className='text-black'>{t('page:export_annual_environmental_report_description')}</p>
      </div>
      <div className='flex flex-row flex-wrap sm:flex-nowrap justify-end gap-2 mt-2'>
        <button
          type='button'
          className='px-6 py-2 border rounded border-mainGreen hover:bg-mainGreen hover:text-white'
          onClick={() => {
            hideModal();
          }}
        >
          {t('common:cancel')}
        </button>
        <button
          onClick={async () => {
            await GetEnvironmentalReport({
              variables: {
                fleetId: propsData?.fleetId,
                searchParams: propsData?.searchParams,
              },
              context: {
                headers: {
                  Authorization: propsData?.accessToken,
                },
              },
            });
            hideModal();
          }}
          className='px-6 py-2 text-white rounded bg-mainGreen'
          type='button'
        >
          {GetEnvironmentalReportLoading ? t('common:exporting') : t('common:export')}
        </button>
      </div>
      {error && <span className='text-red-400'>{error}</span>}
    </Modal>
  );
};
export default ExportAnnualEnvironmentalReport;
