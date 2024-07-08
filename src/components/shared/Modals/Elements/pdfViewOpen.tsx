import {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {Document, Page, pdfjs} from 'react-pdf';
import Modal from '../Modal';
import Button from '../../Button';
import {useQuery} from '@apollo/client';
import queries from '@/constants/GraphQL/Fleet/queries';
import {useSession} from 'next-auth/react';
import {ThreeDots} from 'react-loader-spinner';
import axios from 'axios';
import mime from 'mime-types';
import toBase64 from '@/utils/fileToBase64';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const PdfViewOpen = data => {
  const {hideModal} = ModalContextProvider();
  const {t} = useTranslation();
  const [pdfPageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [scale, setScale] = useState(0.6);
  const {data: session} = useSession();
  const [pdfUrl, setPdfUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(true);
  const [error, setError] = useState('');
  const {loading} = useQuery(queries.GetDocumentDownloadUrl, {
    variables: {
      fleetId: data?.fleetId,
      wastePermitDocumentId: data?.wasteCollectionPermitDocumentId,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: async d => {
      if (d?.getDocumentDownloadUrl?.response?.status !== 200) {
        setPreviewLoading(false);
        return;
      }
      try {
        const s3URL: any = d.getDocumentDownloadUrl.documentUrl;

        const response = await axios.get(s3URL, {
          responseType: 'arraybuffer',
        });

        let contentType = response.headers['content-type'];
        if (contentType === 'application/octet-stream') {
          const extensionRegex = /(?:\.([^.?]+))?(?:\?.*)?$/;
          const fileExtensionMatch = extensionRegex.exec(s3URL);
          const fileExtension = fileExtensionMatch ? fileExtensionMatch[1] : '';
          const type = mime.lookup(fileExtension);
          if (type) {
            contentType = type;
          }
        }

        const fileName = s3URL.split('/').pop();
        const file = new File([response.data], fileName, {type: contentType});
        toBase64(file)
          .then((result: any) => {
            setPdfUrl(result);
          })
          .catch(err => {
            console.log(err);
            setError(err?.message);
          });
        setPreviewLoading(false);
        return;
      } catch (error) {
        setPreviewLoading(false);
        console.log(error);
        setError(error?.message);
        return;
      }
    },
  });

  const onDocumentLoadSuccess = pdf => {
    console.log('LOAD SUCCESS');
    setNumPages(pdf.numPages);
    setPageNumber(1);
  };
  const onFirstPageLoadSuccess = ({width, height}) => {
    setPageWidth(width);
    setPageHeight(height);
  };

  return (
    <Modal title={data?.wasteCollectionPermitDocumentName} medium preventClose={loading}>
      {(loading || previewLoading) && (
        <div className='fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='flex flex-col items-center  p-4 text-center '>
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
      <label className='text-sm sm:block'>
        <div className='flex flex-row items-center justify-center'>
          {t('page:Zoom')} :
          <input
            type='range'
            min='0.50'
            max='1'
            step='0.10'
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            className='flex-1 h-8 max-w-5rem'
          />
        </div>
      </label>
      <div
        className='mt-4 overflow-x-auto'
        style={{
          width: `${pageWidth}px`,
          height: `${pageHeight}px`,
          margin: '0 auto',
        }}
      >
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pdfPageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            scale={scale}
            onLoadSuccess={onFirstPageLoadSuccess}
          />
        </Document>
      </div>

      {numPages && (
        <div className='flex items-center justify-between mt-4'>
          <Button
            className='w-28 bg-primary focus:ring-mainGreen focus:border-mainGreen'
            disabled={pdfPageNumber <= 1}
            onClick={() => setPageNumber(pdfPageNumber - 1)}
          >
            {t('common:previous')}
          </Button>
          <span className='text-sm'>
            {t('common:page')} {pdfPageNumber} of {numPages}
          </span>
          <Button
            className='w-28 bg-primary focus:ring-mainGreen focus:border-mainGreen'
            disabled={pdfPageNumber >= numPages}
            onClick={() => setPageNumber(pdfPageNumber + 1)}
          >
            {t('common:next')}
          </Button>
        </div>
      )}
      {error && <p className='font-bold text-red-500 mt-2'>{error}</p>}
      <div className='flex flex-wrap gap-2 mt-5 sm:flex-nowrap'>
        <Button
          className='text-white bg-primary active:bg-primary focus:ring-mainGreen focus:border-mainGreen'
          onClick={() => hideModal()}
        >
          {t('common:close')}
        </Button>
      </div>
    </Modal>
  );
};

export default PdfViewOpen;
