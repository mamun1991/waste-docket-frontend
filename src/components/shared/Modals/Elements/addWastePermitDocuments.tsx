import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {FileRejection, FileWithPath, useDropzone} from 'react-dropzone';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import router from 'next/router';
import Modal from '../Modal';
import Button from '../../Button';
import InformationalMessage from '../../InformationalMessage';
import {ThreeDots} from 'react-loader-spinner';

const AddWastePermitDocuments = (data: any) => {
  const {data: session} = useSession();
  const {hideModal} = ModalContextProvider();
  const [UploadWastePermitDocument] = useMutation(mutations.UploadWastePermitDocument);
  const {t} = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [dropRejected, setDropRejected] = useState(false);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDropRejected: () => setDropRejected(true),
    onDrop: () => setDropRejected(false),
    multiple: false,
    maxSize: 104857600,
    accept: {'application/pdf': ['.pdf']},
  });

  const acceptedFilesOutput = acceptedFiles.map((file: FileWithPath) => (
    <div key={file.path} className={'border px-2 py-1'}>
      {file.path} - {(file.size / (1024 * 1024)).toFixed(2)} MB
    </div>
  ));

  const rejectedFilesOutput = fileRejections.map((file: FileRejection) =>
    file.errors.map((error, index) => (
      <div key={`${index}-${error}`} className={'border px-2 py-1'}>
        {error.code === 'file-too-large' && (
          <>
            {file.file.name} - {t('page:file_is_larger_than_100_MB')}
          </>
        )}
        {error.code !== 'file-too-large' && (
          <>
            {file.file.name} - {error.message}
          </>
        )}
      </div>
    ))
  );

  const handlePdf = async () => {
    setSubmitting(true);
    try {
      const response = await UploadWastePermitDocument({
        variables: {
          fleetId: data.fleetId,
          documentData: acceptedFiles[0],
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      setSubmitting(false);
      if (response?.data?.uploadWastePermitDocument?.response?.status !== 200) {
        setError(response?.data?.uploadWastePermitDocument?.response?.message);
        return;
      }

      if (response?.data?.uploadWastePermitDocument?.response?.status === 200) {
        setResponseMessage(response?.data?.uploadWastePermitDocument?.response?.message);
        router.reload();
        return;
      }

      setError('');
      hideModal();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`${t('common:upload_documents')}`} medium preventClose={submitting}>
      {submitting && (
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
            <p className='mt-2'>{t('common:uploading')}</p>
          </div>
        </div>
      )}
      <div className='mt-4'>
        <div
          className={`border- cursor-pointer border-4 border-dashed border-black border-opacity-70 px-4 py-2 text-center text-lg font-bold text-black text-opacity-70 dark:border-white dark:border-opacity-70 dark:text-opacity-70 ${
            dropRejected ? 'border-red-500 text-red-500' : 'text-black'
          }`}
        >
          <div {...getRootProps({isFocused, isDragAccept, isDragReject})}>
            <input {...getInputProps()} />
            <p className='text-black text-opacity-70 dark:text-opacity-70'>
              {dropRejected
                ? `${t('page:File selection failed, please try again')}.`
                : t('page:Drag and drop file here, or click to select file')}
            </p>

            <p className={'text-sm text-black text-opacity-70 dark:text-opacity-70'}>
              ({t('page:Accepts Only PDF')})
            </p>
          </div>
        </div>
        <div className={'flex flex-col gap-2 text-black text-opacity-70 dark:text-opacity-70'}>
          {acceptedFiles && acceptedFiles?.length > 0 ? (
            <div className={'flex flex-col gap-2'}>
              <span>
                ({acceptedFiles.length}) {t('page:Selected File')}:
              </span>
              {acceptedFilesOutput}
            </div>
          ) : null}
          {fileRejections.length ? (
            <div className={'flex flex-col text-black text-opacity-70 dark:text-opacity-70'}>
              <span>
                ({fileRejections.length}) {t('page:Rejected File')}:
              </span>
              {rejectedFilesOutput}
            </div>
          ) : null}
        </div>
      </div>
      <div className='flex flex-wrap gap-2 mt-5 sm:flex-nowrap'>
        <Button
          variant='Primary'
          disabled={submitting || !acceptedFiles || acceptedFiles?.length === 0}
          onClick={handlePdf}
        >
          {t('common:upload')}
        </Button>
      </div>
      {error && <span className='text-red-400'>{error}</span>}
      <InformationalMessage title={responseMessage} className='mt-4' />
    </Modal>
  );
};
export default AddWastePermitDocuments;
