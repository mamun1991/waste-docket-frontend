import {useState} from 'react';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {S3_BUCKET_FILENAME} from '@/constants/enums';
import {singleDelete} from '@/constants/GraphQL/Shared/mutations';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';
import Button from '../../Button';

const DeleteModal = el => {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteDocket] = useMutation(mutations.DeleteDocketById);
  const [singleDeleteS3] = useMutation(singleDelete);
  const {data: session} = useSession();
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  return (
    <Modal title={`${t('common:delete_docket')}`} extraSmall>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <Button
          type='button'
          variant='Red'
          onClick={async () => {
            try {
              setSubmitting(true);
              const response = await deleteDocket({
                variables: {
                  fleetId: el.fleetId,
                  docketId: el.docketId,
                },
                context: {
                  headers: {
                    Authorization: session?.accessToken,
                  },
                },
              });
              setSubmitting(false);
              if (response?.data?.deleteDocketById?.status !== 200) {
                setError(response?.data?.deleteDocketById?.message);
                return;
              }
              if (el?.isWaste) {
                await Promise.all(
                  el?.wastes?.map(async waste => {
                    if (waste?.wasteLoadPicture) {
                      try {
                        await singleDeleteS3({
                          variables: {
                            fileUrl: waste?.wasteLoadPicture,
                            accessToken: session?.accessToken,
                            fileType: S3_BUCKET_FILENAME.WASTE_LOAD_PICTURE_UPLOAD,
                          },
                          context: {
                            headers: {
                              Authorization: session?.accessToken,
                            },
                          },
                        });
                      } catch (e) {
                        console.log('Error deleting image', e);
                      }
                    }
                  })
                );
              } else if (
                !el?.isWaste &&
                el?.nonWasteLoadPictures &&
                el?.nonWasteLoadPictures?.length > 0
              ) {
                await Promise.all(
                  el?.nonWasteLoadPictures?.map(async image => {
                    if (image) {
                      try {
                        await singleDeleteS3({
                          variables: {
                            fileUrl: image,
                            accessToken: session?.accessToken,
                            fileType: S3_BUCKET_FILENAME.WASTE_LOAD_PICTURE_UPLOAD,
                          },
                          context: {
                            headers: {
                              Authorization: session?.accessToken,
                            },
                          },
                        });
                        console.log('deleted file ', image);
                      } catch (e) {
                        console.log('Error deleting image', e);
                      }
                    }
                  })
                );
              }
              setError('');
              router.reload();
              hideModal();
            } catch (e) {
              console.log(e);
            }
          }}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {submitting ? t('common:deleting') : t('common:delete')}
        </Button>
        <Button
          type='button'
          variant='Primary'
          onClick={hideModal}
          className='shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:No')}
        </Button>
      </div>
      <span className='text-red-400'>{error}</span>
    </Modal>
  );
};
export default DeleteModal;
