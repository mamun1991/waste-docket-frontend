import {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {XIcon} from '@heroicons/react/solid';
import {MultiSelect, Option} from 'react-multi-select-component';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import Dropzone from 'react-dropzone';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import {S3_BUCKET_FILENAME} from '@/constants/enums';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {FLEET_INITIAL_STATE, FLEET_VALIDATION} from '@/constants/yup/fleet';
import {PreviewType} from '@uiw/react-md-editor';
import Modal from '../Modal';
import wasteCodesJSON from '../../../../../public/assets/wasteCodes.json';
import queries from '@/constants/GraphQL/Fleet/queries';
import {ThreeDots} from 'react-loader-spinner';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {ssr: false});
const customCommands = [
  'bold',
  'italic',
  'link',
  'unordered-list',
  'ordered-list',
  'edit',
  'live',
  'preview',
  'fullscreen',
];

function customCommandsFilter(command) {
  if (customCommands.includes(command.name)) {
    return command;
  }
  return false;
}

const AddEditFleetModal = (fleet: any) => {
  const {data: session} = useSession();
  const [addFleet] = useMutation(mutations.AddFleet);
  const [updateFleet] = useMutation(mutations.UpdateFleet);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const [singleUploadS3] = useMutation(singleUpload);
  const [permitHolderLogoFile, setPermitHolderLogoFile] = useState<null | File>(null);
  const [selectedWaste, setSelectedWaste] = useState<{label: string; value: string}[]>(
    Object.keys(fleet).length === 0 ? [] : fleet?.allowedWaste
  );
  const options = wasteCodesJSON.map(waste => ({
    label: `${waste.wasteCode} - ${waste.wasteDescription}`,
    value: waste.wasteCode,
  }));
  const [mdEditorMode, setMDEditorMode] = useState<PreviewType | undefined>('edit');

  const handleChange = (selectedOptions: {label: string; value: string}[]) => {
    setSelectedWaste(selectedOptions);
  };

  const handleRemove = (optionToRemove: {label: string; value: string}) => {
    const newSelected = selectedWaste.filter(option => option.value !== optionToRemove.value);
    setSelectedWaste(newSelected);
  };

  const {data: GetDocketsData, loading} = useQuery(queries.getAllDocketsByFleetId, {
    variables: {
      fleetId: fleet?.id,
      searchParams: {
        searchText: '',
        resultsPerPage: 1,
        pageNumber: 1,
      },
    },
    skip: !fleet?.id,
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
  });

  const formik = useFormik({
    initialValues:
      Object.keys(fleet).length === 0
        ? FLEET_INITIAL_STATE
        : {
            name: fleet?.CardHeading,
            VAT: fleet?.VAT,
            permitHolderName: fleet?.permitHolderName,
            permitNumber: fleet?.permitNumber,
            permitHolderAddress: fleet?.permitHolderAddress,
            termsAndConditions: fleet?.termsAndConditions,
            permitHolderContactDetails: fleet?.permitHolderContactDetails,
            permitHolderLogo: fleet?.permitHolderLogo,
            prefix: fleet?.prefix || '',
            docketNumber: Number.isNaN(parseInt(fleet?.docketNumber, 10))
              ? 0
              : parseInt(fleet?.docketNumber, 10),
          },
    validationSchema: FLEET_VALIDATION,
    onSubmit: async function (values) {
      setSubmitting(true);
      let uploadedPermitHolderLogo = '';
      if (permitHolderLogoFile) {
        try {
          const response = await singleUploadS3({
            variables: {
              file: permitHolderLogoFile,
              accessToken: session?.accessToken,
              uploadType: S3_BUCKET_FILENAME.CUSTOMER_LOGO_UPLOAD,
            },
            context: {
              headers: {
                Authorization: session?.accessToken,
              },
            },
          });
          if (response?.data?.singleUpload?.status === 200) {
            uploadedPermitHolderLogo = response?.data?.singleUpload?.message;
          }
        } catch (e) {
          console.log('e', e);
        }
      }

      if (Object.keys(fleet).length === 0) {
        try {
          const response = await addFleet({
            variables: {
              fleetData: {
                name: values.name,
                VAT: values?.VAT,
                permitHolderName: values?.permitHolderName,
                permitNumber: values?.permitNumber,
                permitHolderAddress: values?.permitHolderAddress,
                termsAndConditions: values?.termsAndConditions,
                permitHolderContactDetails: values?.permitHolderContactDetails,
                prefix: values?.prefix || '',
                docketNumber: values?.docketNumber,
                permitHolderLogo: uploadedPermitHolderLogo,
                allowedWaste: selectedWaste,
              },
            },
            context: {
              headers: {
                Authorization: session?.accessToken,
              },
            },
          });
          setSubmitting(false);
          if (response?.data?.addFleet?.response?.status !== 200) {
            setError(response?.data?.addFleet?.message);
            return;
          }
          if (response?.data?.addFleet?.response?.status !== 200) {
            setError(response?.data?.addFleet?.message);
            return;
          }
          setError('');
          router.reload();
          hideModal();
        } catch (e) {
          console.log(e);
        }
        return;
      }
      try {
        const response = await updateFleet({
          variables: {
            fleetId: fleet.id,
            fleetData: {
              name: values?.name,
              VAT: values?.VAT,
              permitHolderName: values?.permitHolderName,
              permitNumber: values?.permitNumber,
              permitHolderAddress: values?.permitHolderAddress,
              termsAndConditions: values?.termsAndConditions,
              permitHolderContactDetails: values?.permitHolderContactDetails,
              prefix: values?.prefix || '',
              docketNumber: values?.docketNumber,
              permitHolderLogo: uploadedPermitHolderLogo
                ? uploadedPermitHolderLogo
                : values?.permitHolderLogo,
              allowedWaste: selectedWaste,
            },
          },
          context: {
            headers: {
              Authorization: session?.accessToken,
            },
          },
        });
        setSubmitting(false);
        if (response?.data?.updateFleet?.response?.status !== 200) {
          setError(response?.data?.updateFleet?.response?.message);
          return;
        }
        setError('');
        router.reload();
        hideModal();
      } catch (e) {
        console.log(e);
      }
      setSubmitting(false);
    },
  });

  const filterOptions = async (optionsArgument: Option[], filter: string): Promise<Option[]> => {
    const searchRegex = new RegExp(filter.replace(/\s/g, ''), 'i');
    const filteredOptions = optionsArgument.filter(option => {
      const labelWithoutSpaces = option.label.replace(/\s/g, '');
      const valueWithoutSpaces = option.value.replace(/\s/g, '');
      return searchRegex.test(labelWithoutSpaces) || searchRegex.test(valueWithoutSpaces);
    });
    return filteredOptions;
  };
  const validateForm = async () => {
    const errors = await formik.validateForm();
    const touched = {};

    Object.keys(errors).forEach(field => {
      touched[field] = true;
    });

    formik.setErrors(errors);
    formik.setTouched(touched);
    return errors;
  };
  const [steps, setSteps] = useState([
    {step: 0, status: 'current'},
    {step: 1, status: 'upcoming'},
  ]);
  const [step, setStep] = useState(0);
  const moveNext = async e => {
    e.preventDefault();
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
    }
    const newSteps = steps?.map(item => {
      if (item.step < step + 1) {
        return {...item, status: 'complete'};
      }
      if (item?.step === step + 1) {
        return {...item, status: 'current'};
      }
      return item;
    });
    setSteps(newSteps);
  };
  const moveBack = () => {
    if (step !== 0) {
      const newSteps = steps.map(item => {
        if (item.step === step) {
          return {...item, status: 'upcoming'};
        }
        if (item.step === step - 1) {
          return {...item, status: 'current'};
        }
        return item;
      });
      setSteps(newSteps);
      setStep(step - 1);
    }
  };

  return (
    <Modal
      title={Object.keys(fleet).length === 0 ? t('common:add_fleet') : t('common:edit')}
      large
      preventClose={submitting}
      steps={steps}
    >
      {loading && (
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
      <div className='max-h-[600px] xl:max-h-[600px] w-full pr-2'>
        <form onSubmit={formik.handleSubmit}>
          {step === 0 && (
            <div>
              <div className='grid w-full grid-cols-2 gap-x-4'>
                <div className='mb-4'>
                  <label htmlFor='name'>{t('common:name')}*</label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.name && formik.errors.name
                        ? 'border-2 border-red-700'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    required
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span className='text-red-400'>{formik.errors.name}</span>
                  )}
                </div>
                <div className='mb-4'>
                  <label htmlFor='VAT'>{t('common:VAT')}*</label>
                  <input
                    type='text'
                    name='VAT'
                    id='VAT'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.VAT && formik.errors.VAT
                        ? 'border-2 border-red-400'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.VAT}
                    required
                  />
                  {formik.touched.VAT && formik.errors.VAT && (
                    <span className='text-red-400'>{formik.errors.VAT}</span>
                  )}
                </div>
              </div>
              <div className='grid w-full grid-cols-2 gap-x-4'>
                <div className='mb-4'>
                  <label htmlFor='permitHolderName'>{t('common:permitHolderName')}*</label>
                  <input
                    type='text'
                    name='permitHolderName'
                    id='permitHolderName'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.permitHolderName && formik.errors.permitHolderName
                        ? 'border-2 border-red-400'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.permitHolderName}
                    required
                  />
                  {formik.touched.permitHolderName &&
                    formik.errors.permitHolderName &&
                    formik.values.permitHolderName &&
                    formik.values.permitHolderName.toString() && (
                      <span className='text-red-400'>{formik.errors.permitHolderName}</span>
                    )}
                  {formik.touched.permitHolderName && !formik.values.permitHolderName && (
                    <span className='text-red-400'>Field can not be empty</span>
                  )}
                </div>
                <div className='mb-4'>
                  <label htmlFor='permitNumber'>{t('common:permitNumber')}*</label>
                  <input
                    type='text'
                    name='permitNumber'
                    id='permitNumber'
                    className={`block w-full rounded border py-1 px-2 ${
                      formik.touched.permitNumber && formik.errors.permitNumber
                        ? 'border-2 border-red-400'
                        : 'border-gray-300'
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.permitNumber}
                    required
                  />
                  {formik.touched.permitNumber && formik.errors.permitNumber && (
                    <span className='text-red-400'>{formik.errors.permitNumber}</span>
                  )}
                </div>
              </div>
              <div className='grid w-full grid-cols-2 gap-x-4'>
                <div className=''>
                  <label htmlFor='permitHolderAddress'>{t('common:permitHolderAddress')}*</label>
                  <textarea
                    name='permitHolderAddress'
                    id='permitHolderAddress'
                    className={`block w-full rounded border py-3 px-2 ${
                      formik.touched.permitHolderAddress && formik.errors.permitHolderAddress
                        ? 'border-2 border-red-400'
                        : 'border-gray-300'
                    }`}
                    rows={3}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.permitHolderAddress}
                    required
                  />
                  {formik.touched.permitHolderAddress &&
                    formik.errors.permitHolderAddress &&
                    formik.values.permitHolderAddress &&
                    formik.values.permitHolderAddress.toString() && (
                      <span className='text-red-400'>{formik.errors.permitHolderAddress}</span>
                    )}
                  {formik.touched.permitHolderAddress && !formik.values.permitHolderAddress && (
                    <span className='text-red-400'>Field can not be empty</span>
                  )}
                </div>
                <div>
                  <div className='mb-2'>
                    <label htmlFor='permitHolderContactDetails'>{t('common:PhoneNumber')}*</label>
                    <input
                      type='text'
                      name='permitHolderContactDetails'
                      id='permitHolderContactDetails'
                      className={`block w-full rounded border py-1 px-2 ${
                        formik.touched.permitHolderContactDetails &&
                        formik.errors.permitHolderContactDetails
                          ? 'border-2 border-red-400'
                          : 'border-gray-300'
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.permitHolderContactDetails}
                      required
                    />
                    {formik.touched.permitHolderContactDetails &&
                      formik.errors.permitHolderContactDetails &&
                      formik.values.permitHolderContactDetails &&
                      formik.values.permitHolderContactDetails.toString() && (
                        <span className='text-red-400'>
                          {formik.errors.permitHolderContactDetails}
                        </span>
                      )}
                    {formik.touched.permitHolderContactDetails &&
                      !formik.values.permitHolderContactDetails && (
                        <span className='text-red-400'>Field can not be empty</span>
                      )}
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='prefix'>{t('common:prefix')}</label>
                    <input
                      type='text'
                      name='prefix'
                      id='prefix'
                      className={`block w-full rounded border py-1 px-2 ${
                        formik.touched.prefix && formik.errors.prefix
                          ? 'border-2 border-red-400'
                          : 'border-gray-300'
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.prefix}
                    />
                    {formik.touched.prefix &&
                      formik.errors.prefix &&
                      formik.values.prefix &&
                      formik.values.prefix.toString() && (
                        <span className='text-red-400'>{formik.errors.prefix}</span>
                      )}
                  </div>
                </div>
              </div>
              <Dropzone
                onDrop={acceptedFiles => {
                  if (acceptedFiles.length > 0) {
                    setPermitHolderLogoFile(acceptedFiles[0]);
                  } else {
                    setPermitHolderLogoFile(null);
                  }
                }}
              >
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div className='mb-2'>
                      <label htmlFor='permitHolderLogo'>{t('common:permitHolderLogo')}</label>
                      <div
                        {...getRootProps()}
                        className='flex flex-col justify-start w-full px-2 py-1 border border-gray-300 rounded cursor-pointer'
                      >
                        <input
                          {...getInputProps()}
                          name='permitHolderLogo'
                          id='permitHolderLogo'
                          onBlur={formik.handleBlur}
                        />
                        <p className='text-center text-gray-300 cursor-pointer'>
                          {permitHolderLogoFile
                            ? 'Change Logo'
                            : formik?.values?.permitHolderLogo
                            ? 'Change Logo'
                            : 'Upload Logo'}
                        </p>
                        {Object.keys(fleet).length !== 0 &&
                        !permitHolderLogoFile &&
                        formik?.values?.permitHolderLogo ? (
                          <div className='w-full h-20 p-1 mt-2 rounded cursor-pointer'>
                            <img
                              src={formik?.values?.permitHolderLogo}
                              alt='permitHolderLogo'
                              className='object-contain w-full h-full'
                            />
                          </div>
                        ) : (
                          permitHolderLogoFile && (
                            <div className='w-full h-20 p-1 mt-2 rounded'>
                              <img
                                src={URL.createObjectURL(permitHolderLogoFile)}
                                alt='permitHolderLogo'
                                className='object-contain w-full h-full'
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          )}
          {step === 1 && (
            <div>
              <MultiSelect
                options={options}
                value={selectedWaste}
                onChange={handleChange}
                labelledBy='Select'
                hasSelectAll={false}
                disableSearch={false}
                overrideStrings={{
                  selectSomeItems: 'Select waste codes',
                  allItemsAreSelected: 'All items are selected',
                }}
                filterOptions={filterOptions}
              />
              <div className='flex flex-wrap gap-2 mt-2'>
                {selectedWaste.map(option => (
                  <div
                    key={option.value}
                    className='relative flex px-2 py-1 text-white rounded-full bg-primary'
                  >
                    <span className='justify-start pr-2 text-left'>
                      {option?.label?.split('-')[0]}
                    </span>
                    <button
                      className='top-0 right-0 px-2 py-1 justify-right'
                      onClick={() => handleRemove(option)}
                    >
                      <XIcon className='float-right w-4 h-4 text-right' />
                    </button>
                  </div>
                ))}
                <div className='grid w-full gap-x-4'>
                  <div className='mb-4'>
                    <label htmlFor='docketNumber'>{t('common:docketNumber')}*</label>
                    <input
                      type='text'
                      name='docketNumber'
                      id='docketNumber'
                      className={`block w-full rounded border py-1 px-2 ${
                        formik.touched.docketNumber && formik.errors.docketNumber
                          ? 'border-2 border-red-400'
                          : 'border-gray-300'
                      }`}
                      onChange={e => {
                        const inputValue = e.target.value;
                        const numericValue = parseInt(inputValue, 10);
                        const newValue = Number.isNaN(numericValue) ? null : numericValue;
                        formik.setFieldValue('docketNumber', newValue);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.docketNumber}
                      disabled={GetDocketsData?.getAllDocketsByFleetId?.totalCount > 0}
                      required
                    />
                    {formik.touched.docketNumber && formik.errors.docketNumber && (
                      <span className='text-red-400'>{formik.errors.docketNumber}</span>
                    )}
                  </div>
                </div>
              </div>
              {Object.keys(fleet).length > 0 && (
                <div className='w-full mb-4 gap-x-4'>
                  <label htmlFor='termsAndConditions'>{t('page:termsAndConditions')}</label>
                  <div className='flex flex-row gap-4 py-2'>
                    <button
                      className='px-6 py-3 text-white rounded bg-mainGreen'
                      type='button'
                      onClick={() => setMDEditorMode('edit')}
                    >
                      {t('page:Editor')}
                    </button>
                    <button
                      className='px-6 py-3 text-white rounded bg-mainGreen'
                      type='button'
                      onClick={() => setMDEditorMode('preview')}
                    >
                      {t('page:Preview')}
                    </button>
                    <button
                      className='px-6 py-3 text-white rounded bg-mainGreen'
                      type='button'
                      onClick={() => setMDEditorMode('live')}
                    >
                      {t('page:Split View')}
                    </button>
                  </div>
                  <MDEditor
                    preview={mdEditorMode}
                    value={formik.values.termsAndConditions}
                    onChange={value => {
                      formik.setFieldValue('termsAndConditions', value);
                    }}
                    commandsFilter={customCommandsFilter}
                  />
                  {/* <MDEditor
                    value={formik.values.termsAndConditions}
                    onChange={value => {
                      formik.setFieldValue('termsAndConditions', value);
                    }}
                    commandsFilter={customCommandsFilter}
                  /> */}
                </div>
              )}
            </div>
          )}
          <div className='flex flex-wrap items-center justify-end'>
            <button
              type='button'
              className='px-6 py-3 mr-4 text-white bg-red-400 rounded'
              onClick={() => {
                if (submitting) {
                  return;
                }
                hideModal();
              }}
            >
              {t('common:cancel')}
            </button>
            <button
              type='button'
              className='px-6 py-3 mr-4 border rounded border-mainGreen hover:bg-mainGreen hover:text-white'
              onClick={() => {
                if (submitting) {
                  return;
                }
                moveBack();
              }}
            >
              {t('common:Back')}
            </button>
            {step === 1 ? (
              <button className='px-6 py-3 text-white rounded bg-mainGreen' type='submit'>
                {submitting ? t('common:Submitting') : t('common:submit')}
              </button>
            ) : (
              <button
                onClick={moveNext}
                className='px-6 py-3 text-white rounded bg-mainGreen'
                type='button'
              >
                {t('common:next')}
              </button>
            )}
          </div>
          <span className='text-red-400'>{error}</span>
        </form>
      </div>
    </Modal>
  );
};
export default AddEditFleetModal;
