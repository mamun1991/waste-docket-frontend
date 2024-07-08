import {useEffect, useState, createRef} from 'react';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import Select, {components} from 'react-select';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import queries from 'constants/GraphQL/Fleet/queries';
import useTranslation from 'next-translate/useTranslation';
import {useFormik} from 'formik';
import mutations from '@/constants/GraphQL/Fleet/mutations';
import {DOCKET_INITIAL_STATE, DOCKET_VALIDATION} from '@/constants/yup/docket';
import dayjs from 'dayjs';
import {TrashIcon} from '@heroicons/react/solid';
import Dropzone from 'react-dropzone';
import SignatureCanvas from 'react-signature-canvas';
import {S3_BUCKET_FILENAME} from '@/constants/enums';
import {singleDelete, singleUpload} from '@/constants/GraphQL/Shared/mutations';
import {TailSpin, ThreeDots} from 'react-loader-spinner';
import {countries} from 'countries-list';
import Modal from '../Modal';
import wasteCodesJSON from '../../../../../public/assets/wasteCodes.json';
import localAuthorityJSON from '../../../../../public/assets/localAuthority.json';
import ErrorMessage from '../../ErrorMessage';
import InformationalMessage from '../../InformationalMessage';

const AddEditDocketData = (data: any) => {
  const {data: session} = useSession();
  const [AddDocket] = useMutation(mutations.AddDocket);
  const [singleUploadS3, {loading: imageUploadLoading}] = useMutation(singleUpload);
  const [singleDeleteS3, {loading: imageDeleteLoading}] = useMutation(singleDelete);
  const [EditDocket] = useMutation(mutations.UpdateDocketById);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const router = useRouter();
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [isWasteValue, setIsWasteValue] = useState('yes');
  const [isLoadForExportValue, setIsLoadForExportValue]: any = useState('no');
  const [isCollectedFromWasteFacility, setIsCollectedFromWasteFacility] = useState('no');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [step, setStep] = useState(0);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState('');
  const wasteFacilityRepSignatureRef: any = createRef();
  const customerSignatureRef: any = createRef();
  const driverSignatureRef: any = createRef();
  const [wasteFacilityRepSignatureImage, setWasteFacilityRepSignatureImage] = useState(false);
  const [customerSignatureImage, setCustomerSignatureImage] = useState(false);
  const [driverSignatureImage, setDriverSignatureImage] = useState(false);
  const [collectionPointGps, setCollectionPointGps] = useState(false);
  const [destinationGps, setDestinationGps] = useState(false);
  const [imageUploadIndex, setImageUploadIndex] = useState(0);
  const [nonWasteImageUploadIndex, setNonWasteImageUploadIndex] = useState(0);
  const [destinationFacilityOption, setDestinationFacilityOption] = useState<any>([]);
  const [existingCustomers, setExistingCustomers] = useState<any>([]);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [addDocketStateUpdate, setAddDocketStateUpdate] = useState(false);
  const [customersPage, setCustomersPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isDFMenuOpen, setIsDFMenuOpen] = useState(true);
  const [destinationFacilityPage, setDestinationFacilityPage] = useState(1);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (inputValue && inputValue?.length > 0) {
        setCustomersPage(1);
        setExistingCustomers([]);
      }
      setDebouncedInputValue(inputValue);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchValue && searchValue?.length > 0) {
        setDestinationFacilityPage(1);
        setDestinationFacilityOption([]);
      }
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  const [GetCustomerContactByFleetIdFunc, {loading: GetCustomerContactByFleetIdLoading}] =
    useLazyQuery(queries.GetCustomerContactsByFleetIdWithSorting, {
      onCompleted: data => {
        const options = data?.getCustomerContactsByFleetIdWithSorting?.customersData?.map(item => ({
          value: item.customerName,
          label: item.customerName,
          email: item.customerEmail,
          customerId: item?.customerId,
          customerAddress: item?.customerAddress,
        }));
        const totalCount = data?.getCustomerContactsByFleetIdWithSorting?.totalCount;
        let newCustomers: any[];
        if (
          totalCount >
          existingCustomers.length +
            (data?.getCustomerContactsByFleetIdWithSorting?.customersData?.length || 0)
        ) {
          const filteredExistingCustomers = existingCustomers.filter(
            customer => customer.value !== 'see_more'
          );
          newCustomers = [
            ...filteredExistingCustomers,
            ...options,
            {value: 'see_more', label: 'See More'},
          ];
        } else {
          newCustomers = [...existingCustomers, ...options];
        }
        setExistingCustomers(newCustomers);
      },
      fetchPolicy: 'network-only',
    });

  const [GetDestinationFacilityFunc, {loading: GetDestinationFacilityLoading}] = useLazyQuery(
    queries.GetDestinationFacilityWithSorting,
    {
      onCompleted: data => {
        const options = data?.getDestinationFacilityWithSorting?.destinationFacilityData?.map(
          item => ({
            value: item.destinationFacilityName,
            label: item.destinationFacilityName,
            id: item._id,
            latitude: item.destinationFacilityLatitude,
            longitude: item.destinationFacilityLongitude,
            name: item.destinationFacilityName,
            authorisationNumber: item.destinationFacilityAuthorisationNumber,
            address: item.destinationFacilityAddress,
            street: item.destinationFacilityStreet,
            city: item.destinationFacilityCity,
            county: item.destinationFacilityCounty,
            eircode: item.destinationFacilityEircode,
            country: item.destinationFacilityCountry,
            facilityId: item.destinationFacilityId,
          })
        );
        const totalCount = data?.getDestinationFacilityWithSorting?.totalCount;
        let newDestinationFacilities: any[];
        if (
          totalCount >
          destinationFacilityOption.length +
            (data?.getDestinationFacilityWithSorting?.destinationFacilityData?.length || 0)
        ) {
          const filteredExistingDestinations = destinationFacilityOption.filter(
            destination => destination.value !== 'see_more'
          );
          newDestinationFacilities = [
            ...filteredExistingDestinations,
            ...options,
            {value: 'see_more', label: 'See More'},
          ];
        } else {
          newDestinationFacilities = [...destinationFacilityOption, ...options];
        }
        setDestinationFacilityOption(newDestinationFacilities);
      },
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (data?.fleetId) {
      GetDestinationFacilityFunc({
        variables: {
          fleetId: data.fleetId,
          facilityInput: {
            searchText: searchValue,
            sortColumn: 'destinationFacilityData.destinationFacilityName',
            sortOrder: 'asc',
            pageNumber: destinationFacilityPage,
            itemsPerPage: 20,
            searchKeyword: 'destinationFacilityData.destinationFacilityName',
          },
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
    }
  }, [debouncedSearchValue, destinationFacilityPage]);

  useEffect(() => {
    if (data?.fleetId) {
      GetCustomerContactByFleetIdFunc({
        variables: {
          fleetId: data.fleetId,
          customersInput: {
            sortColumn: 'customerName',
            sortOrder: 'asc',
            pageNumber: customersPage,
            itemsPerPage: 20,
            searchText: inputValue,
            searchKeyword: 'customerName',
          },
        },
        fetchPolicy: 'network-only',
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
    }
  }, [debouncedInputValue, customersPage]);

  const options = wasteCodesJSON.map(waste => ({
    label: `${waste.wasteCode} - ${waste.wasteDescription}`,
    value: waste.wasteCode,
  }));

  const docketNumber =
    data.FORM_TYPE === 'ADD_DOCKET'
      ? `${data?.prefix}${data.docketNumber + 1}`
      : `${data?.prefix}${data.docketNumber}`;

  const optionsLocalAuthority = localAuthorityJSON.sort((a, b) => {
    const labelA = a?.label?.toLowerCase();
    const labelB = b?.label?.toLowerCase();
    if (labelA < labelB) {
      return -1;
    }
    if (labelA > labelB) {
      return 1;
    }
    return 0;
  });

  useQuery(queries.getLastDocketForUser, {
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
    skip: data.FORM_TYPE !== 'ADD_DOCKET',
    onCompleted(data) {
      if (data?.getLastDocketForUser?.response?.status === 200) {
        const docketData = data?.getLastDocketForUser?.docketData;
        if (docketData) {
          const {vehicleRegistration, isWaste, wastes} = docketData?.docketData;
          formik.setFieldValue('vehicleRegistration', vehicleRegistration);
          formik.setFieldValue('isWaste', isWaste);
          const filteredWastes = wastes
            ?.filter(item => item?.wasteDescription)
            .map(item => ({
              wasteDescription: item?.wasteDescription,
              isHazardous: false,
              localAuthorityOfOrigin: '',
              wasteLoWCode: '',
              wasteLoadPicture: null,
              wasteQuantity: {unit: '', amount: 0},
            }));
          formik.setFieldValue('wastes', filteredWastes);
        }
      }
    },
  });

  const formik = useFormik({
    initialValues: data.FORM_TYPE === 'ADD_DOCKET' ? DOCKET_INITIAL_STATE : data,
    validationSchema: DOCKET_VALIDATION,
    onSubmit: async function (values) {
      setSubmitting(true);
      let {
        customerName,
        customerPhone,
        jobId,
        customerId,
        customerAddress,
        customerEmail,
        customerStreet,
        customerCity,
        customerCounty,
        customerEircode,
        customerCountry,
        gpsOn,
        longitude,
        latitude,
        date,
        time,
        vehicleRegistration,
        generalPickupDescription,
        nonWasteLoadPictures,
        isWaste,
        wastes,
        collectedFromWasteFacility,
        collectionPointName,
        collectionPointAddress,
        collectionPointStreet,
        collectionPointCity,
        collectionPointCounty,
        collectionPointEircode,
        collectionPointCountry,
        destinationFacilityId,
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
        driverSignature,
        wasteFacilityRepSignature,
        customerSignature,
        isLoadForExport,
        portOfExport,
        countryOfDestination,
        facilityAtDestination,
        tfsReferenceNumber,
        additionalInformation,
        doSendEmail,
      } = values;
      if (isWaste && nonWasteLoadPictures && nonWasteLoadPictures?.length > 0) {
        await Promise.all(
          nonWasteLoadPictures?.map(async image => {
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
        nonWasteLoadPictures = [];
      } else if (!isWaste && wastes && wastes?.length > 0) {
        await Promise.all(
          wastes?.map(async waste => {
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
        wastes = [];
      }
      setResponseMessage('');
      if (data.FORM_TYPE === 'ADD_DOCKET') {
        try {
          const response = await AddDocket({
            variables: {
              fleetId: data.fleetId,
              docketData: {
                customerName,
                customerPhone,
                jobId,
                customerId,
                customerAddress,
                customerEmail,
                customerStreet,
                customerCity,
                customerCounty,
                customerEircode,
                customerCountry,
                gpsOn,
                longitude,
                latitude,
                date,
                time: selectedTime.format('HH:MM'),
                vehicleRegistration,
                generalPickupDescription,
                nonWasteLoadPictures: nonWasteLoadPictures.filter(str => str.trim() !== ''),
                isWaste,
                wastes,
                collectedFromWasteFacility,
                collectionPointName,
                collectionPointAddress,
                collectionPointStreet,
                collectionPointCity,
                collectionPointCounty,
                collectionPointEircode,
                collectionPointCountry,
                destinationFacilityId,
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
                driverSignature,
                isDriverSignatureId: false,
                wasteFacilityRepSignature,
                isWasteFacilityRepSignatureId: false,
                customerSignature,
                isCustomerSignatureId: false,
                isLoadForExport,
                portOfExport,
                countryOfDestination,
                facilityAtDestination,
                tfsReferenceNumber,
                additionalInformation,
                doSendEmail,
                isMobileApp: true,
              },
            },
            context: {
              headers: {
                Authorization: session?.accessToken,
              },
            },
          });
          setSubmitting(false);
          if (response?.data?.addDocket?.response?.status !== 200) {
            setError(response?.data?.addDocket?.message);
            return;
          }
          if (response?.data?.addDocket?.response?.status === 200) {
            setResponseMessage(t('page:Docket has been added successfully'));
            setTimeout(() => {
              router.reload();
              return;
            }, 1000);
          }
        } catch (e) {
          console.log(e);
        }
        return;
      }

      if (data.FORM_TYPE === 'EDIT_DOCKET') {
        try {
          const response = await EditDocket({
            variables: {
              fleetId: data.fleetId,
              docketId: data.docketId,
              docketData: {
                customerName,
                customerPhone,
                jobId,
                customerId,
                customerAddress,
                customerEmail,
                customerStreet,
                customerCity,
                customerCounty,
                customerEircode,
                customerCountry,
                gpsOn,
                longitude,
                latitude,
                date,
                time,
                vehicleRegistration,
                generalPickupDescription,
                nonWasteLoadPictures: nonWasteLoadPictures.filter(str => str.trim() !== ''),
                isWaste,
                wastes,
                collectedFromWasteFacility,
                collectionPointName,
                collectionPointAddress,
                collectionPointStreet,
                collectionPointCity,
                collectionPointCounty,
                collectionPointEircode,
                collectionPointCountry,
                destinationFacilityId,
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
                driverSignature:
                  data?.driverSignature === driverSignature
                    ? ''
                    : driverSignature
                    ? driverSignature
                    : 'clear',
                isDriverSignatureId: false,
                wasteFacilityRepSignature:
                  data?.wasteFacilityRepSignature === wasteFacilityRepSignature
                    ? ''
                    : wasteFacilityRepSignature
                    ? wasteFacilityRepSignature
                    : 'clear',
                isWasteFacilityRepSignatureId: false,
                customerSignature:
                  data?.customerSignature === customerSignature
                    ? ''
                    : customerSignature
                    ? customerSignature
                    : 'clear',
                isCustomerSignatureId: false,
                isLoadForExport,
                portOfExport,
                countryOfDestination,
                facilityAtDestination,
                tfsReferenceNumber,
                additionalInformation,
                doSendEmail,
                isMobileApp: true,
              },
            },
            context: {
              headers: {
                Authorization: session?.accessToken,
              },
            },
          });
          setSubmitting(false);
          if (response?.data?.updateDocketById?.status !== 200) {
            setError(response?.data?.updateDocketById?.message);
            return;
          }
          if (response?.data?.updateDocketById?.status === 200) {
            setResponseMessage(t('page:Docket has been updated successfully'));
            setTimeout(() => {
              router.reload();
              return;
            }, 1000);
          }
        } catch (e) {
          console.log(e);
        }
        return;
      }

      setSubmitting(false);
    },
  });

  useEffect(() => {
    formik.setFieldValue('date', selectedDate.format('YYYY-MM-DD'));
    formik.setFieldValue('time', selectedTime.format('HH:mm'));
    if (data.FORM_TYPE === 'ADD_DOCKET' && !addDocketStateUpdate) {
      setAddDocketStateUpdate(true);
      formik.setFieldValue('isWaste', true);
      formik.setFieldValue('nonWasteLoadPictures', ['']);
      formik.setFieldValue('wastes', [
        {
          wasteDescription: '',
          wasteLoWCode: '',
          isHazardous: false,
          localAuthorityOfOrigin: '',
          wasteQuantity: {
            unit: '',
            amount: 0,
          },
        },
      ]);
    }
    formik.setFieldValue('isLoadForExport', isLoadForExportValue === 'yes' ? true : false);
    formik.setFieldValue(
      'collectedFromWasteFacility',
      isCollectedFromWasteFacility === 'yes' ? true : false
    );
  }, [
    selectedDate,
    selectedTime,
    isWasteValue,
    isLoadForExportValue,
    isCollectedFromWasteFacility,
  ]);
  useEffect(() => {
    if (data.FORM_TYPE === 'EDIT_DOCKET') {
      if (data.wasteFacilityRepSignature) {
        setWasteFacilityRepSignatureImage(true);
      }
      if (data.driverSignature) {
        setDriverSignatureImage(true);
      }
      if (data.customerSignature) {
        setCustomerSignatureImage(true);
      }
      setSelectedCustomerEmail(data?.customerEmail);
      formik.setFieldValue('doesCustomerExist', false);
      formik.setFieldValue('doSendEmail', 'no');
      if (!data?.isWaste) {
        setIsWasteValue('no');
      }
      if (data?.isLoadForExport) {
        setIsLoadForExportValue('yes');
      }
      if (data?.collectedFromWasteFacility) {
        setIsCollectedFromWasteFacility('yes');
      }
      if (data?.date) {
        formik.setFieldValue('date', data?.date);
      }
      if (data?.time) {
        formik.setFieldValue('time', data?.time);
        console.log(data?.time);
      }
      if (data?.wastes && data?.wastes?.length > 0) {
        formik.setFieldValue('wastes', data?.wastes);
      } else if (!data?.wastes || data?.wastes?.length === 0) {
        formik.setFieldValue('wastes', [
          {
            wasteDescription: '',
            wasteLoWCode: '',
            isHazardous: false,
            localAuthorityOfOrigin: '',
            wasteQuantity: {
              unit: '',
              amount: 0,
            },
          },
        ]);
      }
      if (data?.nonWasteLoadPictures && data?.nonWasteLoadPictures?.length > 0) {
        formik.setFieldValue('nonWasteLoadPictures', data?.nonWasteLoadPictures);
      } else if (!data?.nonWasteLoadPictures || data?.nonWasteLoadPictures?.length === 0) {
        formik.setFieldValue('nonWasteLoadPictures', ['']);
      }
    }
  }, [data]);
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
    {step: 2, status: 'upcoming'},
    {step: 3, status: 'upcoming'},
    {step: 4, status: 'upcoming'},
    {step: 5, status: 'upcoming'},
  ]);
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
  const handleClearSignature = (signatureRef, fieldName) => {
    signatureRef?.current?.clear();
    formik.setFieldValue(fieldName, '');
    if (fieldName === 'wasteFacilityRepSignature') {
      setWasteFacilityRepSignatureImage(false);
    } else if (fieldName === 'customerSignature') {
      setCustomerSignatureImage(false);
    } else {
      setDriverSignatureImage(false);
    }
  };
  const handleSignatureEnd = (fieldName, refName) => {
    formik.setFieldValue(fieldName, refName.current.toDataURL());
  };

  const handleGetCoordinates = fieldName => {
    const fieldPrefix = fieldName === 'collectionPoint' ? '' : 'destinationFacility';
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          formik.setFieldValue(
            `${fieldName === 'collectionPoint' ? 'latitude' : `${fieldPrefix}Latitude`}`,
            latitude.toString()
          );
          formik.setFieldValue(
            `${fieldName === 'collectionPoint' ? 'longitude' : `${fieldPrefix}Longitude`}`,
            longitude.toString()
          );
          if (fieldName === 'collectionPoint') {
            setCollectionPointGps(true);
          } else if (fieldName === 'destinationFacility') {
            setDestinationGps(true);
          }
        },
        geolocationError => {
          console.error('Error getting location:', geolocationError);
          let errorMessage = 'An unknown error occurred.';
          switch (geolocationError.code) {
            case 1:
              errorMessage = 'User denied the request for Geolocation.';
              break;
            case 2:
              errorMessage = 'Location information is unavailable.';
              break;
            case 3:
              errorMessage = 'Request for Geolocation timed out.';
              break;
            default:
              errorMessage = 'An unexpected error occurred.';
              break;
          }
          formik.setFieldError(
            `${fieldName === 'collectionPoint' ? 'latitude' : `${fieldPrefix}Latitude`}`,
            errorMessage
          );
          formik.setFieldError(
            `${fieldName === 'collectionPoint' ? 'longitude' : `${fieldPrefix}Longitude`}`,
            errorMessage
          );
        }
      );
    } else {
      console.error('Geolocation is not available in your browser.');
      formik.setFieldError(
        `${fieldName === 'collectionPoint' ? 'latitude' : `${fieldPrefix}Latitude`}`,
        'Geolocation is not available.'
      );
      formik.setFieldError(
        `${fieldName === 'collectionPoint' ? 'longitude' : `${fieldPrefix}Longitude`}`,
        'Geolocation is not available.'
      );
    }
  };
  const counties = [
    'Carlow',
    'Cavan',
    'Clare',
    'Cork',
    'Donegal',
    'Dublin',
    'Galway',
    'Kerry',
    'Kildare',
    'Kilkenny',
    'Laois',
    'Leitrim',
    'Limerick',
    'Longford',
    'Louth',
    'Mayo',
    'Meath',
    'Monaghan',
    'Offaly',
    'Roscommon',
    'Sligo',
    'Tipperary',
    'Waterford',
    'Westmeath',
    'Wexford',
    'Wicklow',
  ];
  const deletePictureHandler = async fileUrl => {
    try {
      await singleDeleteS3({
        variables: {
          fileUrl: fileUrl,
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
  };
  console.log(formik.errors);

  const uploadPictureHandler = async (file, checkOld) => {
    try {
      if (checkOld && checkOld?.length > 0) {
        try {
          await singleDeleteS3({
            variables: {
              fileUrl: checkOld,
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

      const response = await singleUploadS3({
        variables: {
          file: file,
          accessToken: session?.accessToken,
          uploadType: S3_BUCKET_FILENAME.WASTE_LOAD_PICTURE_UPLOAD,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      if (response?.data?.singleUpload?.status === 200) {
        return response?.data?.singleUpload?.message;
      }
      return null;
    } catch (e) {
      console.log('Error uploading image', e);
      return null;
    }
  };
  const CustomOption = props => {
    const {children, data, ...rest} = props;
    const isSeeMore = data.value === 'see_more';
    if (isSeeMore) {
      return (
        <components.Option {...rest}>
          <div className='text-primary underline cursor-pointer italic'>
            <span>{children}</span>
          </div>
        </components.Option>
      );
    }
    return <components.Option {...props} />;
  };
  return (
    <Modal
      title={data.FORM_TYPE === 'ADD_DOCKET' ? t('common:add_Docket') : t('common:edit_Docket')}
      large
      preventClose={submitting}
      additionalClasses='!overflow-visible'
      steps={steps}
    >
      {submitting && (
        <div className='fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50'>
          <div className='flex flex-col items-center p-3 text-center bg-white rounded shadow-md'>
            <ThreeDots
              height='50'
              width='50'
              radius='9'
              color='#007337'
              ariaLabel='three-dots-loading'
              visible={true}
            />
          </div>
        </div>
      )}
      {data?.fleetId ? (
        <div className='max-h-[400px] xl:max-h-[500px] overflow-y-auto w-full pr-2'>
          <form onSubmit={formik.handleSubmit}>
            {step === 0 && (
              <div>
                <div className='mb-2'>
                  <div className='flex flex-col px-4 py-3 border border-gray-300 rounded'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center gap-6'>
                        <div className='flex items-center gap-1'>
                          <input
                            type='radio'
                            name='doesCustomerExist'
                            id='doesCustomerExist-yes'
                            onBlur={formik.handleBlur}
                            value='yes'
                            onChange={() => {
                              formik.setFieldValue('doesCustomerExist', true);
                              formik.setFieldValue('customerName', '');
                              formik.setFieldValue('customerAddress', '');
                              formik.setFieldValue('customerStreet', '');
                              formik.setFieldValue('customerCity', '');
                              formik.setFieldValue('customerCounty', '');
                              formik.setFieldValue('customerEircode', '');
                              formik.setFieldValue('customerCountry', 'Ireland');
                              formik.setFieldValue('customerEmail', '');
                              formik.setFieldValue('jobId', '');
                              formik.setFieldValue('customerId', '');
                            }}
                            className='mt-1 focus:ring-0'
                            required
                            checked={formik.values.doesCustomerExist}
                          />
                          <label className='mt-0.5' htmlFor='isWaste-yes'>
                            Existing Customer
                          </label>
                        </div>
                        <div className='flex items-center gap-1'>
                          <input
                            type='radio'
                            name='doesCustomerExist'
                            id='doesCustomerExist-no'
                            onBlur={formik.handleBlur}
                            value='no'
                            checked={!formik.values.doesCustomerExist}
                            className='mt-1 focus:ring-0'
                            onChange={() => {
                              formik.setFieldValue('doesCustomerExist', false);
                              formik.setFieldValue('customerName', '');
                              formik.setFieldValue('jobId', '');
                              formik.setFieldValue('customerId', '');
                            }}
                            required
                          />
                          <label className='mt-0.5' htmlFor='isWaste-yes'>
                            New Customer
                          </label>
                        </div>
                      </div>
                      <a
                        target='_blank'
                        rel='noreferrer'
                        className='text-blue-500 underline'
                        href={`/allFleetCustomers`}
                      >
                        View Customers
                      </a>
                    </div>
                    {formik.values.doesCustomerExist && (
                      <div className='mb-2'>
                        <Select
                          inputValue={inputValue}
                          options={existingCustomers}
                          isClearable={true}
                          onInputChange={value => setInputValue(value)}
                          defaultMenuIsOpen={inputValue ? true : false}
                          onMenuOpen={() => setIsMenuOpen(!isMenuOpen)}
                          onMenuClose={() => setIsMenuOpen(false)}
                          menuIsOpen={isMenuOpen}
                          value={{
                            label: formik.values.customerName || 'Type Customer Name...',
                            value: formik.values.customerName,
                          }}
                          onChange={(selected: any) => {
                            if (selected?.value === 'see_more') {
                              setCustomersPage(customersPage + 1);
                              setIsMenuOpen(true);
                            } else {
                              formik.setFieldValue('customerName', selected?.value);
                              setSelectedCustomerEmail(selected?.email);
                              formik.setFieldValue('customerId', selected?.customerId || '');
                              formik.setFieldValue('customerEmail', selected?.email || '');
                              formik.setFieldValue(
                                'customerAddress',
                                selected?.customerAddress || ''
                              );
                              setIsMenuOpen(false);
                            }
                          }}
                          isLoading={GetCustomerContactByFleetIdLoading}
                          components={{
                            Option: CustomOption,
                          }}
                          placeholder={'Type Customer Name...'}
                        />
                        {formik.touched.customerName && formik.errors.customerName && (
                          <div className='text-red-400'>{formik.errors.customerName}</div>
                        )}
                        <div className='grid w-full grid-cols-2 gap-x-4'>
                          <div className='mt-2'>
                            <label htmlFor='customerId'>{t('common:customerId')}</label>
                            <input
                              type='text'
                              name='customerId'
                              id='customerId'
                              className={`block w-full rounded border py-1 px-2 ${
                                formik.touched.customerId && formik.errors.customerId
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.customerId}
                            />
                            {formik.touched.customerId && formik.errors.customerId && (
                              <span className='text-red-400'>{formik.errors.customerId}</span>
                            )}
                          </div>
                          <div className='mt-2'>
                            <label htmlFor='jobId'>{t('common:jobId')}</label>
                            <input
                              type='text'
                              name='jobId'
                              id='jobId'
                              className={`block w-full rounded border py-1 px-2 ${
                                formik.touched.jobId && formik.errors.jobId
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.jobId}
                            />
                            {formik.touched.jobId && formik.errors.jobId && (
                              <span className='text-red-400'>{formik.errors.jobId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {!formik.values.doesCustomerExist && (
                      <div>
                        <div className='grid w-full grid-cols-2 gap-x-4'>
                          <div className='mb-2'>
                            <label htmlFor='customerName'>{t('common:customerName')} *</label>
                            <input
                              type='text'
                              name='customerName'
                              id='customerName'
                              className={`block w-full rounded border py-1 px-2 ${
                                formik.touched.customerName && formik.errors.customerName
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.customerName}
                              required
                            />

                            {formik.touched.customerName && formik.errors.customerName && (
                              <span className='text-red-400'>{formik.errors.customerName}</span>
                            )}
                          </div>
                          <div className='mb-2'>
                            <label htmlFor='customerEmail'>{t('common:customerEmail')}</label>
                            <input
                              type='text'
                              name='customerEmail'
                              id='customerEmail'
                              className={`block w-full rounded border py-1 px-2 ${
                                formik.touched.customerEmail && formik.errors.customerEmail
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`}
                              onChange={e => {
                                formik.handleChange(e);
                                setSelectedCustomerEmail(e.target.value);
                                if (!formik.errors.customerEmail) {
                                  formik.setFieldError('customerEmail', '');
                                }
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.customerEmail}
                              required
                            />
                            {formik.touched.customerEmail && formik.errors.customerEmail && (
                              <span className='text-red-400'>{formik.errors.customerEmail}</span>
                            )}
                          </div>
                        </div>
                        <div className='grid w-full grid-cols-2 gap-x-4'>
                          <div className='mb-2'>
                            <label htmlFor='customerEmail'>{t('common:customerPhone')}</label>
                            <input
                              type='text'
                              name='customerPhone'
                              id='customerPhone'
                              className={`block w-full rounded border py-1 px-2 ${
                                formik.touched.customerPhone && formik.errors.customerPhone
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.customerPhone}
                              required
                            />
                            {formik.touched.customerPhone && formik.errors.customerPhone && (
                              <span className='text-red-400'>{formik.errors.customerPhone}</span>
                            )}
                          </div>
                        </div>
                        <div className='w-full mb-2'>
                          <label htmlFor='customerAddress'>{t('common:customerAddress')}</label>
                          <input
                            type='text'
                            name='customerAddress'
                            id='customerAddress'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.customerAddress && formik.errors.customerAddress
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.customerAddress}
                            placeholder={t('common:addressPlaceholder')}
                          />
                          {formik.touched.customerAddress && formik.errors.customerAddress && (
                            <span className='text-red-400'>{formik.errors.customerAddress}</span>
                          )}
                        </div>
                        <div className='mb-2'>
                          <input
                            type='text'
                            name='customerStreet'
                            id='customerStreet'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.customerStreet && formik.errors.customerStreet
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.customerStreet}
                            placeholder={t('common:streetName')}
                          />
                          {formik.touched.customerStreet && formik.errors.customerStreet && (
                            <span className='text-red-400'>{formik.errors.customerStreet}</span>
                          )}
                        </div>
                        <div className='mb-2'>
                          <label htmlFor='customerCity'>{t('common:city')}</label>
                          <input
                            type='text'
                            name='customerCity'
                            id='customerCity'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.customerCity && formik.errors.customerCity
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.customerCity}
                          />
                          {formik.touched.customerCity && formik.errors.customerCity && (
                            <span className='text-red-400'>{formik.errors.customerCity}</span>
                          )}
                        </div>
                        <div className='mb-2'>
                          <label htmlFor='customerCounty'>
                            {t('common:county')} ({t('common:if applicable')})
                          </label>
                          <select
                            name='customerCounty'
                            className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                            onChange={formik.handleChange}
                            value={formik.values.customerCounty}
                            onBlur={formik.handleBlur}
                          >
                            <option value='' disabled selected>
                              {t('common:Choose a county')}
                            </option>
                            {counties.map(item => (
                              <option
                                value={item}
                                key={item}
                                selected={
                                  data.customerCounty === item ||
                                  formik.values.customerCounty === item
                                }
                              >
                                {item}
                              </option>
                            ))}
                          </select>

                          {formik.touched.customerCounty && formik.errors.customerCounty && (
                            <span className='text-red-400'>{formik.errors.customerCounty}</span>
                          )}
                        </div>
                        <div className='mb-2'>
                          <label htmlFor='customerEircode'>{t('common:eircode')}</label>
                          <input
                            type='text'
                            name='customerEircode'
                            id='customerEircode'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.customerEircode && formik.errors.customerEircode
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.customerEircode}
                            placeholder={t('common:Enter area Eircode')}
                          />
                          {formik.touched.customerEircode && formik.errors.customerEircode && (
                            <span className='text-red-400'>{formik.errors.customerEircode}</span>
                          )}
                        </div>
                        <div className='mb-4'>
                          {t('common:Country')}
                          <select
                            name='customerCountry'
                            className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                            onChange={formik.handleChange}
                            value={formik.values.customerCountry}
                            onBlur={formik.handleBlur}
                            required
                          >
                            {Object.entries(countries)
                              .map(([, countryInfo]) => countryInfo.name)
                              .sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'base'}))
                              .map(countryName => (
                                <option
                                  value={countryName}
                                  key={countryName}
                                  selected={
                                    data.customerCountry === countryName ||
                                    formik.values.customerCountry === countryName
                                  }
                                >
                                  {countryName}
                                </option>
                              ))}
                          </select>
                          {formik.touched.customerCountry && formik.errors.customerCountry && (
                            <span className='text-red-400'>{formik.errors.customerCountry}</span>
                          )}
                        </div>
                        <div className='grid w-full grid-cols-2 gap-x-4'>
                          <div>
                            <label htmlFor='customerId'>{t('common:customerId')}</label>
                            <input
                              type='text'
                              name='customerId'
                              id='customerId'
                              className={`block w-full rounded border py-1 px-2 ${
                                formik.touched.customerId && formik.errors.customerId
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.customerId}
                            />
                            {formik.touched.customerId && formik.errors.customerId && (
                              <span className='text-red-400'>{formik.errors.customerId}</span>
                            )}
                          </div>
                          <div>
                            <label htmlFor='jobId'>{t('common:jobId')}</label>
                            <input
                              type='text'
                              name='jobId'
                              id='jobId'
                              className={`block w-full rounded border py-1 px-2 ${
                                formik.touched.jobId && formik.errors.jobId
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.jobId}
                            />
                            {formik.touched.jobId && formik.errors.jobId && (
                              <span className='text-red-400'>{formik.errors.jobId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='grid w-full grid-cols-2 gap-x-4'>
                  <div className='mb-2'>
                    {t('common:vehicleRegistration')}
                    <input
                      type='vehicleRegistration'
                      name='vehicleRegistration'
                      id='vehicleRegistration'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className='border border-gray-300 rounded w-full py-1.5 pl-2'
                      value={formik.values.vehicleRegistration}
                    />
                    {formik.touched.vehicleRegistration && formik.errors.vehicleRegistration && (
                      <span className='text-red-400'>{formik.errors.vehicleRegistration}</span>
                    )}
                  </div>
                  <div className='mb-2'>
                    {t('common:individualDocketNumber')}
                    <input
                      type='individualDocketNumber'
                      name='individualDocketNumber'
                      id='individualDocketNumber'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={docketNumber}
                      className='border border-gray-300 rounded w-full py-1.5 pl-2'
                      disabled={true}
                    />
                    {formik.touched.individualDocketNumber &&
                      formik.errors.individualDocketNumber && (
                        <span className='text-red-400'>{formik.errors.individualDocketNumber}</span>
                      )}
                  </div>
                </div>
                <div className='grid w-full grid-cols-2 gap-x-4'>
                  <div className='mb-2'>
                    {t('common:date')}
                    <input
                      type='date'
                      id='date'
                      name='date'
                      value={formik.values.date}
                      onChange={e => setSelectedDate(dayjs(e.target.value))}
                      className='border border-gray-300 rounded w-full py-1.5 pl-2'
                    />
                  </div>
                  <div className='mb-2'>
                    {t('common:time')}
                    <input
                      type='time'
                      id='time'
                      name='time'
                      value={formik.values.time}
                      onChange={e => {
                        setSelectedTime(dayjs(`${dayjs().format('YYYY-MM-DD')} ${e.target.value}`));
                      }}
                      className='border border-gray-300 rounded w-full py-1.5 pl-2'
                    />
                  </div>

                  <div className='mb-2'></div>
                </div>
              </div>
            )}

            <div>
              {step === 1 && (
                <div>
                  <div className='grid w-full grid-cols-2 gap-x-4'>
                    <div className='mb-2'>
                      {t('common:isWaste')}
                      <div className='flex items-center gap-6 p-1 pl-2 border border-gray-300 rounded'>
                        <div className='flex items-center gap-1'>
                          <label htmlFor='isWaste-yes'>Yes</label>
                          <input
                            type='radio'
                            name='isWaste'
                            id='isWaste-yes'
                            onBlur={formik.handleBlur}
                            value='yes'
                            checked={isWasteValue === 'yes'}
                            className='mt-1 focus:ring-0'
                            onChange={e => {
                              setIsWasteValue(e.target.value);
                              formik.setFieldValue('isWaste', true);
                            }}
                          />
                        </div>
                        <div className='flex items-center gap-1'>
                          <label htmlFor='isWaste-no'>No</label>
                          <input
                            type='radio'
                            name='isWaste'
                            id='isWaste-no'
                            onBlur={formik.handleBlur}
                            value='no'
                            checked={isWasteValue === 'no'}
                            className='mt-1 focus:ring-0'
                            onChange={e => {
                              setIsWasteValue(e.target.value);
                              formik.setFieldValue('isWaste', false);
                            }}
                          />
                        </div>
                      </div>
                      <div className='mb-2'></div>
                    </div>

                    <div className='mb-2'></div>
                  </div>
                  <div className='w-full'>
                    {isWasteValue === 'yes' ? (
                      <>
                        {formik.values.wastes.map((_w, index) => (
                          <div
                            className='flex flex-col p-4 mt-3 border rounded-md first:mt-0'
                            key={index}
                          >
                            <div className='flex items-center justify-between pb-2 mb-4 border-b'>
                              <h3 className='text-lg font-semibold'>Waste #{index + 1}</h3>
                              <button
                                className='flex items-center gap-x-1.5 text-sm font-medium text-red-500'
                                onClick={() => {
                                  if (formik.values.wastes.length === 1) {
                                    setIsWasteValue('no');
                                  }
                                  formik.setFieldValue(
                                    'wastes',
                                    formik.values.wastes.filter((_elem, idx) => index !== idx)
                                  );
                                }}
                              >
                                <TrashIcon className='w-4 h-4' /> Delete
                              </button>
                            </div>
                            <div className='grid w-full grid-cols-2 gap-x-4'>
                              <div className='mb-2'>
                                <label htmlFor='wasteDescription'>
                                  {t('common:wasteDescription')}
                                </label>
                                <textarea
                                  name='wasteDescription'
                                  id='wasteDescription'
                                  className={`block w-full rounded border py-1 px-2 ${
                                    formik.touched.wastes &&
                                    formik.touched.wastes[index]?.wasteDescription &&
                                    formik.errors.wastes &&
                                    formik.errors.wastes[index]?.wasteDescription
                                      ? 'border-red-400'
                                      : 'border-gray-300'
                                  }`}
                                  onBlur={() =>
                                    formik.setFieldTouched(`wastes.${index}.wasteDescription`)
                                  }
                                  rows={4}
                                  onChange={e => {
                                    formik.setFieldValue(
                                      `wastes.${index}.wasteDescription`,
                                      e.currentTarget.value
                                    );
                                    formik.setFieldTouched(`wastes.${index}.wasteDescription`);
                                  }}
                                  value={formik.values.wastes[index]?.wasteDescription}
                                />

                                {formik.touched.wastes &&
                                  formik.touched.wastes[index]?.wasteDescription &&
                                  formik.errors.wastes &&
                                  formik.errors.wastes[index]?.wasteDescription && (
                                    <span className='text-red-400'>
                                      {formik.errors.wastes[index]?.wasteDescription}
                                    </span>
                                  )}
                              </div>
                              <div>
                                <div className='mb-1'>
                                  <label htmlFor='wasteLoWCode'>{t('common:wasteLoWCode')}</label>
                                  <Select
                                    options={
                                      data?.allowedWaste?.length > 0 ? data?.allowedWaste : options
                                    }
                                    isSearchable={true}
                                    onChange={(selected: any) => {
                                      formik.setFieldTouched(`wastes.${index}.wasteLoWCode`);
                                      formik.setFieldValue(
                                        `wastes.${index}.wasteLoWCode`,
                                        selected?.value
                                      );
                                    }}
                                    onBlur={() =>
                                      formik.setFieldTouched(`wastes.${index}.wasteLoWCode`)
                                    }
                                    defaultValue={
                                      data.FORM_TYPE === 'EDIT_DOCKET' &&
                                      data?.wastes &&
                                      options?.find(
                                        el => el?.value === data?.wastes[index]?.wasteLoWCode
                                      )
                                    }
                                  />

                                  {formik.touched.wastes &&
                                    formik.touched.wastes[index]?.wasteLoWCode &&
                                    formik.errors.wastes &&
                                    formik.errors.wastes[index]?.wasteLoWCode && (
                                      <span className='text-red-400'>
                                        {formik.errors.wastes[index]?.wasteLoWCode}
                                      </span>
                                    )}
                                  <div className='mb-2'></div>
                                </div>
                                <div className='mb-2'>
                                  {t('common:isHazardous')}
                                  <div className='flex items-center gap-6 p-1 pl-2 border border-gray-300 rounded'>
                                    <div className='flex items-center gap-1'>
                                      <label htmlFor='isHazardous-yes'>Yes</label>
                                      <input
                                        type='radio'
                                        name='isHazardous'
                                        id='isHazardous-yes'
                                        onBlur={() =>
                                          formik.setFieldTouched(`wastes.${index}.isHazardous`)
                                        }
                                        onChange={() => {
                                          formik.setFieldValue(`wastes.${index}.isHazardous`, true);
                                        }}
                                        checked={formik.values.wastes[index]?.isHazardous}
                                        value='yes'
                                        className='mt-1 focus:ring-0'
                                      />
                                    </div>
                                    <div className='flex items-center gap-1'>
                                      <label htmlFor='isHazardous-no'>No</label>
                                      <input
                                        type='radio'
                                        name='isHazardous'
                                        id='isHazardous-no'
                                        onBlur={() =>
                                          formik.setFieldTouched(`wastes.${index}.isHazardous`)
                                        }
                                        onChange={() => {
                                          formik.setFieldValue(
                                            `wastes.${index}.isHazardous`,
                                            false
                                          );
                                        }}
                                        checked={!formik.values.wastes[index]?.isHazardous}
                                        value='no'
                                        className='mt-1 focus:ring-0'
                                      />
                                    </div>
                                  </div>
                                  {formik.touched.wastes &&
                                    formik.touched.wastes[index]?.isHazardous &&
                                    formik.errors.wastes &&
                                    formik.errors.wastes[index]?.isHazardous && (
                                      <span className='text-red-400'>
                                        {formik.errors.wastes[index]?.isHazardous}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className='grid w-full grid-cols-2 gap-x-4'>
                              <div className='mb-2'>
                                <label htmlFor='wasteQuantityAmount'>Waste Amount</label>
                                <input
                                  name='wasteQuantityAmount'
                                  id='wasteQuantityAmount'
                                  className={`block w-full rounded border py-1 px-2 ${
                                    formik.touched.wastes &&
                                    formik.touched.wastes[index]?.wasteQuantity?.amount &&
                                    formik.errors.wastes &&
                                    formik.errors.wastes[index]?.wasteQuantity?.amount
                                      ? 'border-red-400'
                                      : 'border-gray-300'
                                  }`}
                                  onChange={e => {
                                    const newValue = parseFloat(e.currentTarget.value);
                                    formik.setFieldValue(
                                      `wastes.${index}.wasteQuantity.amount`,
                                      Number.isNaN(newValue) ? null : newValue
                                    );
                                    formik.setFieldTouched(
                                      `wastes.${index}.wasteQuantity.amount`,
                                      true
                                    );
                                  }}
                                  onBlur={() =>
                                    formik.setFieldTouched(`wastes.${index}.wasteQuantity.amount`)
                                  }
                                  value={
                                    formik.values.wastes[index]?.wasteQuantity?.amount === null
                                      ? null
                                      : formik.values.wastes[index]?.wasteQuantity?.amount
                                  }
                                  min={0}
                                  type='number'
                                />

                                {formik.touched.wastes &&
                                  formik.touched.wastes[index]?.wasteQuantity?.amount &&
                                  formik.errors.wastes &&
                                  formik.errors.wastes[index]?.wasteQuantity?.amount && (
                                    <span className='text-red-400'>
                                      {formik.errors.wastes[index]?.wasteQuantity?.amount}
                                    </span>
                                  )}
                              </div>
                              <div className='mb-2'>
                                <label htmlFor='wasteQuantityUnit'>Waste Unit</label>
                                <Select
                                  name='wasteQuantityUnit'
                                  id='wasteQuantityUnit'
                                  options={[
                                    {label: 'KG', value: 'KG'},
                                    {label: 'Litres', value: 'Litres'},
                                    {label: 'Tonnes', value: 'Tonnes'},
                                    {label: 'Other', value: 'Other'},
                                  ]}
                                  isSearchable={true}
                                  onChange={e => {
                                    formik.setFieldValue(
                                      `wastes.${index}.wasteQuantity.unit`,
                                      e.value
                                    );
                                    formik.setFieldTouched(`wastes.${index}.wasteQuantity.unit`);
                                  }}
                                  onBlur={() =>
                                    formik.setFieldTouched(`wastes.${index}.wasteQuantity.unit`)
                                  }
                                  defaultValue={
                                    data.FORM_TYPE === 'EDIT_DOCKET' &&
                                    data?.wastes && {
                                      label: data?.wastes[index]?.wasteQuantity.unit,
                                      value: data?.wastes[index]?.wasteQuantity.unit,
                                    }
                                  }
                                />
                                {formik.touched.wastes &&
                                  formik.touched.wastes[index]?.wasteQuantity?.unit &&
                                  formik.errors.wastes &&
                                  formik.errors.wastes[index]?.wasteQuantity?.unit && (
                                    <span className='text-red-400'>
                                      {formik.errors.wastes[index]?.wasteQuantity?.unit}
                                    </span>
                                  )}
                              </div>
                            </div>
                            <div className='grid w-full grid-cols-2 gap-x-4'>
                              <div className='mt-1'>
                                <div>
                                  <label htmlFor='localAuthorityOfOrigin'>
                                    {t('common:localAuthorityOfOrigin')}
                                  </label>
                                  <Select
                                    options={optionsLocalAuthority}
                                    isSearchable={true}
                                    className='mt-2'
                                    onChange={e => {
                                      formik.setFieldValue(
                                        `wastes.${index}.localAuthorityOfOrigin`,
                                        e.value
                                      );
                                      formik.setFieldTouched(
                                        `wastes.${index}.localAuthorityOfOrigin`
                                      );
                                    }}
                                    onBlur={() =>
                                      formik.setFieldTouched(
                                        `wastes.${index}.localAuthorityOfOrigin`
                                      )
                                    }
                                    defaultValue={
                                      data.FORM_TYPE === 'EDIT_DOCKET' &&
                                      data?.wastes &&
                                      optionsLocalAuthority?.find(
                                        el =>
                                          el?.value === data?.wastes[index]?.localAuthorityOfOrigin
                                      )
                                    }
                                  />
                                  {formik.touched.wastes &&
                                    formik.touched.wastes[index]?.localAuthorityOfOrigin &&
                                    formik.errors.wastes &&
                                    formik.errors.wastes[index]?.localAuthorityOfOrigin && (
                                      <span className='text-red-400'>
                                        {formik.errors.wastes[index]?.localAuthorityOfOrigin}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                            <Dropzone
                              accept={{
                                'image/*': ['.jpeg', '.png', '.jpg'],
                              }}
                              onDrop={async acceptedFiles => {
                                if (acceptedFiles.length > 0) {
                                  const checkOld = formik.values.wastes[index]?.wasteLoadPicture;
                                  setImageUploadIndex(index);
                                  const url = await uploadPictureHandler(
                                    acceptedFiles[0],
                                    checkOld
                                  );
                                  formik.setFieldValue(`wastes.${index}.wasteLoadPicture`, url);
                                } else {
                                  formik.setFieldValue(`wastes.${index}.wasteLoadPicture`, null);
                                }
                              }}
                            >
                              {({getRootProps, getInputProps}) => (
                                <section>
                                  <div className='mb-2'>
                                    <label htmlFor='wasteLoadPicture'>
                                      {t('common:wasteLoadPicture')}
                                    </label>
                                    <div
                                      {...getRootProps()}
                                      className='flex flex-col justify-start w-full px-2 py-1 border border-gray-300 rounded cursor-pointer'
                                    >
                                      <input
                                        {...getInputProps()}
                                        name='wasteLoadPicture'
                                        id='wasteLoadPicture'
                                        onBlur={formik.handleBlur}
                                      />
                                      <p className='text-center text-gray-300 cursor-pointer'>
                                        {formik.values.wastes[index]?.wasteLoadPicture
                                          ? 'Change Picture'
                                          : 'Upload Picture'}
                                      </p>
                                      {(imageUploadLoading || imageDeleteLoading) &&
                                      imageUploadIndex === index ? (
                                        <div className='flex items-center justify-center w-full h-full mt-4'>
                                          <TailSpin
                                            height='50'
                                            width='50'
                                            color='#007337'
                                            ariaLabel='tail-spin-loading'
                                            visible={true}
                                          />
                                        </div>
                                      ) : (
                                        formik.values.wastes[index]?.wasteLoadPicture && (
                                          <div className='w-full h-20 p-1 mt-2 rounded cursor-pointer'>
                                            <img
                                              src={formik.values.wastes[index]?.wasteLoadPicture}
                                              alt='wasteLoadPicture'
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
                        ))}
                      </>
                    ) : (
                      isWasteValue === 'no' && (
                        <div className='mb-2'>
                          <div className='grid w-full grid-cols-2 flex gap-x-2 items-end'>
                            {formik?.values?.nonWasteLoadPictures?.map(
                              (_nonWasteLoadPicture, index) => (
                                <Dropzone
                                  key={index}
                                  accept={{
                                    'image/*': ['.jpeg', '.png', '.jpg'],
                                  }}
                                  onDrop={async acceptedFiles => {
                                    if (acceptedFiles.length > 0) {
                                      const checkOld = formik.values.nonWasteLoadPictures[index];
                                      setNonWasteImageUploadIndex(index);
                                      const url = await uploadPictureHandler(
                                        acceptedFiles[0],
                                        checkOld
                                      );
                                      formik.setFieldValue(`nonWasteLoadPictures.${index}`, url);
                                    } else {
                                      formik.setFieldValue(`nonWasteLoadPictures.${index}`, null);
                                    }
                                  }}
                                >
                                  {({getRootProps, getInputProps}) => (
                                    <section>
                                      <div className='mb-2'>
                                        <div className='flex justify-between'>
                                          <label htmlFor='nonWasteLoadPictures'>
                                            {t('common:nonWasteLoadPicture')}
                                          </label>
                                          <button
                                            className='flex items-center gap-x-1.5 text-sm font-medium text-red-500'
                                            onClick={async () => {
                                              if (formik.values.nonWasteLoadPictures[index]) {
                                                setNonWasteImageUploadIndex(index);
                                                await deletePictureHandler(
                                                  formik.values.nonWasteLoadPictures[index]
                                                );
                                              }
                                              formik.setFieldValue(
                                                'nonWasteLoadPictures',
                                                formik.values.nonWasteLoadPictures.filter(
                                                  (_elem, idx) => index !== idx
                                                )
                                              );
                                            }}
                                            type='button'
                                          >
                                            <TrashIcon className='w-4 h-4' /> {t('common:delete')}
                                          </button>
                                        </div>
                                        <div
                                          {...getRootProps()}
                                          className={`flex flex-col justify-start w-full pb-1  border border-gray-300 rounded  px-2 cursor-pointer ${
                                            !formik.values.nonWasteLoadPictures[index] &&
                                            'h-32 flex items-center justify-center'
                                          }`}
                                        >
                                          <input
                                            {...getInputProps()}
                                            name='nonWasteLoadPictures'
                                            id='nonWasteLoadPictures'
                                            onBlur={formik.handleBlur}
                                          />

                                          <p className='text-center text-gray-300 cursor-pointer'>
                                            {formik.values.nonWasteLoadPictures[index]
                                              ? 'Change Picture'
                                              : 'Upload Picture'}
                                          </p>
                                          {(imageUploadLoading || imageDeleteLoading) &&
                                          nonWasteImageUploadIndex === index ? (
                                            <div className='flex items-center justify-center w-full h-full mt-4'>
                                              <TailSpin
                                                height='50'
                                                width='50'
                                                color='#007337'
                                                ariaLabel='tail-spin-loading'
                                                visible={true}
                                              />
                                            </div>
                                          ) : (
                                            formik.values.nonWasteLoadPictures[index] && (
                                              <div className='w-full h-24 mt-1 rounded cursor-pointer'>
                                                <img
                                                  src={formik.values.nonWasteLoadPictures[index]}
                                                  alt='nonWasteLoadPictures'
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
                              )
                            )}
                            <button
                              onClick={() => {
                                formik.setFieldValue('nonWasteLoadPictures', [
                                  ...formik.values.nonWasteLoadPictures,
                                  '',
                                ]);
                              }}
                              className='px-2 mb-2 w-28 py-2 text-white rounded bg-mainGreen'
                              type='button'
                            >
                              {t('common:add_more')} +
                            </button>
                          </div>
                          <label htmlFor='generalPickupDescription'>
                            {t('common:generalPickupDescription')}
                          </label>
                          <textarea
                            rows={3}
                            name='generalPickupDescription'
                            id='generalPickupDescription'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.generalPickupDescription &&
                              formik.errors.generalPickupDescription
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.generalPickupDescription}
                          />

                          {formik.touched.generalPickupDescription &&
                            formik.errors.generalPickupDescription && (
                              <span className='text-red-400'>
                                {formik.errors.generalPickupDescription}
                              </span>
                            )}
                        </div>
                      )
                    )}
                    <div className='mb-2'></div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <div className='mb-2'>
                    {t('common:collectedFromWasteFacility')}
                    <div className='flex items-center gap-6 p-1 pl-2 border border-gray-300 rounded'>
                      <div className='flex items-center gap-1'>
                        <label htmlFor='collectedFromWasteFacility-yes'>Yes</label>
                        <input
                          type='radio'
                          name='collectedFromWasteFacility'
                          id='collectedFromWasteFacility-yes'
                          value='yes'
                          onBlur={formik.handleBlur}
                          className='mt-1 focus:ring-0'
                          checked={isCollectedFromWasteFacility === 'yes'}
                          onChange={e => setIsCollectedFromWasteFacility(e.target.value)}
                        />
                      </div>
                      <div className='flex items-center gap-1'>
                        <label htmlFor='collectedFromWasteFacility-no'>No</label>
                        <input
                          type='radio'
                          name='collectedFromWasteFacility'
                          id='collectedFromWasteFacility-no'
                          value='no'
                          onBlur={formik.handleBlur}
                          className='mt-1 focus:ring-0'
                          checked={isCollectedFromWasteFacility === 'no'}
                          onChange={e => setIsCollectedFromWasteFacility(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <p className='mt-4 mb-2 text-lg font-bold'>{t('common:Collection Point')}</p>
                  <div className='grid w-full grid-cols-2 mb-4 gap-x-4'>
                    <div>
                      <div className='mb-2'>
                        <label htmlFor='collectionPointAddress'>{t('common:address')}</label>
                        <input
                          type='text'
                          name='collectionPointAddress'
                          id='collectionPointAddress'
                          className={`block w-full rounded border py-1 px-2 ${
                            formik.touched.collectionPointAddress &&
                            formik.errors.collectionPointAddress
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.collectionPointAddress}
                          placeholder={t('common:addressPlaceholder')}
                        />
                        {formik.touched.collectionPointAddress &&
                          formik.errors.collectionPointAddress && (
                            <span className='text-red-400'>
                              {formik.errors.collectionPointAddress}
                            </span>
                          )}
                      </div>
                      <div className='mb-2'>
                        <input
                          type='text'
                          name='collectionPointStreet'
                          id='collectionPointStreet'
                          className={`block w-full rounded border py-1 px-2 ${
                            formik.touched.collectionPointStreet &&
                            formik.errors.collectionPointStreet
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.collectionPointStreet}
                          placeholder={t('common:streetName')}
                        />
                        {formik.touched.collectionPointStreet &&
                          formik.errors.collectionPointStreet && (
                            <span className='text-red-400'>
                              {formik.errors.collectionPointStreet}
                            </span>
                          )}
                      </div>
                      <div className='mb-2'>
                        <label htmlFor='collectionPointCity'>{t('common:city')}</label>
                        <input
                          type='text'
                          name='collectionPointCity'
                          id='collectionPointCity'
                          className={`block w-full rounded border py-1 px-2 ${
                            formik.touched.collectionPointCity && formik.errors.collectionPointCity
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.collectionPointCity}
                        />
                        {formik.touched.collectionPointCity &&
                          formik.errors.collectionPointCity && (
                            <span className='text-red-400'>
                              {formik.errors.collectionPointCity}
                            </span>
                          )}
                      </div>
                      <div className='mb-1'>
                        <label htmlFor='collectionPointCounty'>
                          {t('common:county')} ({t('common:if applicable')})
                        </label>
                        <select
                          name='collectionPointCounty'
                          className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                          onChange={formik.handleChange}
                          value={formik.values.collectionPointCounty}
                          onBlur={formik.handleBlur}
                        >
                          <option value='' disabled selected>
                            {t('common:Choose a county')}
                          </option>
                          {counties.map(item => (
                            <option
                              value={item}
                              key={item}
                              selected={
                                data.collectionPointCounty === item ||
                                formik.values.collectionPointCounty === item
                              }
                            >
                              {item}
                            </option>
                          ))}
                        </select>
                        {formik.touched.collectionPointCounty &&
                          formik.errors.collectionPointCounty && (
                            <span className='text-red-400'>
                              {formik.errors.collectionPointCounty}
                            </span>
                          )}
                      </div>
                      <div>
                        <label htmlFor='collectionPointEircode'>{t('common:eircode')}</label>
                        <input
                          type='text'
                          name='collectionPointEircode'
                          id='collectionPointEircode'
                          className={`block w-full rounded border py-1 px-2 ${
                            formik.touched.collectionPointEircode &&
                            formik.errors.collectionPointEircode
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.collectionPointEircode}
                          placeholder={t('common:Enter area Eircode')}
                        />
                        {formik.touched.collectionPointEircode &&
                          formik.errors.collectionPointEircode && (
                            <span className='text-red-400'>
                              {formik.errors.collectionPointEircode}
                            </span>
                          )}
                      </div>
                      <div>
                        {t('common:Country')}
                        <select
                          name='collectionPointCountry'
                          className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                          onChange={formik.handleChange}
                          value={formik.values.collectionPointCountry}
                          onBlur={formik.handleBlur}
                        >
                          {Object.entries(countries)
                            .map(([, countryInfo]) => countryInfo.name)
                            .sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'base'}))
                            .map(countryName => (
                              <option
                                value={countryName}
                                key={countryName}
                                selected={
                                  data.collectionPointCountry === countryName ||
                                  formik.values.collectionPointCountry === countryName
                                }
                              >
                                {countryName}
                              </option>
                            ))}
                        </select>
                        {formik.touched.collectionPointCountry &&
                          formik.errors.collectionPointCountry && (
                            <span className='text-red-400'>
                              {formik.errors.collectionPointCountry}
                            </span>
                          )}
                      </div>
                    </div>
                    <div>
                      <label>{t('common:gpsLocation')}</label>
                      <div
                        className={`flex h-[335px] flex-col border border-gray-300 ${
                          collectionPointGps
                            ? 'py-6'
                            : data.FORM_TYPE === 'EDIT_DOCKET' && !collectionPointGps
                            ? 'py-1'
                            : formik.errors.latitude
                            ? 'py-5'
                            : 'py-7'
                        } px-4 justify-center items-center`}
                      >
                        {!collectionPointGps && (
                          <button
                            type='button'
                            onClick={() => handleGetCoordinates('collectionPoint')}
                            className='px-3 py-2 font-bold text-white cursor-pointer bg-mainGreen'
                          >
                            {t('common:Pick Location')}
                          </button>
                        )}
                        {formik.values.latitude && (
                          <p>
                            {t('common:Latitude')}: {formik.values.latitude}
                          </p>
                        )}
                        {formik.values.longitude && (
                          <p>
                            {t('common:Longitude')}: {formik.values.longitude}
                          </p>
                        )}
                      </div>
                      {formik.errors.latitude && (
                        <span className='text-red-400'>{formik.errors.latitude}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <div className='mb-2'>
                    <div className='flex flex-col px-4 py-3 border border-gray-300 rounded'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-6'>
                          <div className='flex items-center gap-1'>
                            <input
                              type='radio'
                              name='doesFacilityExist'
                              id='doesFacilityExist-yes'
                              onBlur={formik.handleBlur}
                              value='yes'
                              onChange={() => {
                                formik.setFieldValue('doesFacilityExist', true);
                                formik.setFieldValue('destinationFacilityId', '');
                                formik.setFieldValue('destinationFacilityLatitude', '');
                                formik.setFieldValue('destinationFacilityLongitude', '');
                                formik.setFieldValue('destinationFacilityName', '');
                                formik.setFieldValue('destinationFacilityAuthorisationNumber', '');
                                formik.setFieldValue('destinationFacilityAddress', '');
                                formik.setFieldValue('destinationFacilityStreet', '');
                                formik.setFieldValue('destinationFacilityCity', '');
                                formik.setFieldValue('destinationFacilityCounty', '');
                                formik.setFieldValue('destinationFacilityEircode', '');
                                formik.setFieldValue('destinationFacilityCountry', 'Ireland');
                              }}
                              className='mt-1 focus:ring-0'
                              required
                              checked={formik.values.doesFacilityExist}
                            />
                            <label className='mt-0.5' htmlFor='isWaste-yes'>
                              Existing Destination Facility
                            </label>
                          </div>
                          <div className='flex items-center gap-1'>
                            <input
                              type='radio'
                              name='doesFacilityExist'
                              id='doesCustomerExist-non'
                              onBlur={formik.handleBlur}
                              value='no'
                              checked={!formik.values.doesFacilityExist}
                              className='mt-1 focus:ring-0'
                              onChange={() => {
                                formik.setFieldValue('doesFacilityExist', false);
                                formik.setFieldValue('destinationFacilityName', '');
                                formik.setFieldValue('destinationFacilityAuthorisationNumber', '');
                                formik.setFieldValue('destinationFacilityId', '');
                              }}
                              required
                            />
                            <label className='mt-0.5' htmlFor='isWaste-yes'>
                              New Destination Facility
                            </label>
                          </div>
                        </div>
                        <a
                          target='_blank'
                          rel='noreferrer'
                          className='text-blue-500 underline'
                          href={`/destinationFacility`}
                        >
                          View Destination Facility
                        </a>
                      </div>
                      {formik.values.doesFacilityExist && (
                        <div className='mb-2'>
                          <Select
                            isClearable={true}
                            maxMenuHeight={170}
                            inputValue={searchValue}
                            defaultMenuIsOpen={searchValue ? true : false}
                            onMenuOpen={() => setIsDFMenuOpen(!isDFMenuOpen)}
                            onMenuClose={() => setIsDFMenuOpen(false)}
                            menuIsOpen={isDFMenuOpen}
                            value={{
                              label:
                                formik.values.destinationFacilityName ||
                                'Type Destination Facility Name...',
                              value: formik.values.destinationFacilityName,
                            }}
                            onInputChange={value => {
                              setSearchValue(value);
                            }}
                            options={destinationFacilityOption}
                            isLoading={GetDestinationFacilityLoading}
                            onChange={(selected: any) => {
                              if (selected?.value === 'see_more') {
                                setDestinationFacilityPage(destinationFacilityPage + 1);
                                setIsDFMenuOpen(true);
                              } else {
                                formik.setFieldValue('destinationFacilityName', selected?.value);
                                formik.setFieldValue(
                                  'destinationFacilityId',
                                  selected?.facilityId || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityAuthorisationNumber',
                                  selected?.authorisationNumber || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityLatitude',
                                  selected?.latitude || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityLongitude',
                                  selected?.longitude || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityAddress',
                                  selected?.address || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityStreet',
                                  selected?.street || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityCity',
                                  selected?.city || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityCounty',
                                  selected?.county || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityEircode',
                                  selected?.eircode || ''
                                );
                                formik.setFieldValue(
                                  'destinationFacilityCountry',
                                  selected?.country || ''
                                );
                                setIsDFMenuOpen(false);
                              }
                            }}
                            components={{
                              Option: CustomOption,
                            }}
                            placeholder={'Type Destination Facility Name...'}
                          />

                          {formik.touched.destinationFacilityName &&
                            formik.errors.destinationFacilityName && (
                              <div className='text-red-400'>
                                {formik.errors.destinationFacilityName}
                              </div>
                            )}
                          <div className='grid w-full grid-cols-2 gap-x-4'>
                            <div className='mt-2'>
                              <label htmlFor='destinationFacilityId'>
                                {t('common:destinationFacilityId')}*
                              </label>
                              <input
                                type='text'
                                name='destinationFacilityId'
                                id='destinationFacilityId'
                                className={`block w-full rounded border py-1 px-2 ${
                                  formik.touched.destinationFacilityId &&
                                  formik.errors.destinationFacilityId
                                    ? 'border-red-400'
                                    : 'border-gray-300'
                                }`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.destinationFacilityId}
                              />
                              {formik.touched.destinationFacilityId &&
                                formik.errors.destinationFacilityId && (
                                  <span className='text-red-400'>
                                    {formik.errors.destinationFacilityId}
                                  </span>
                                )}
                            </div>
                            <div className='mt-2'>
                              <label htmlFor='destinationFacilityAuthorisationNumber'>
                                {t('common:destinationFacilityAuthorisationNumber')}*
                              </label>
                              <input
                                type='text'
                                name='destinationFacilityAuthorisationNumber'
                                id='destinationFacilityAuthorisationNumber'
                                className={`block w-full rounded border py-1 px-2 ${
                                  formik.touched.destinationFacilityAuthorisationNumber &&
                                  formik.errors.destinationFacilityAuthorisationNumber
                                    ? 'border-red-400'
                                    : 'border-gray-300'
                                }`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.destinationFacilityAuthorisationNumber}
                              />
                              {formik.touched.destinationFacilityAuthorisationNumber &&
                                formik.errors.destinationFacilityAuthorisationNumber && (
                                  <span className='text-red-400'>
                                    {formik.errors.destinationFacilityAuthorisationNumber}
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                      {!formik.values.doesFacilityExist && (
                        <>
                          <div className='grid w-full grid-cols-2 gap-x-4'>
                            <div className='mb-2'>
                              <label htmlFor='destinationFacilityName'>{t('common:name')}*</label>
                              <input
                                type='text'
                                name='destinationFacilityName'
                                id='destinationFacilityName'
                                className={`block w-full rounded border py-1 px-2 ${
                                  formik.touched.destinationFacilityName &&
                                  formik.errors.destinationFacilityName
                                    ? 'border-red-400'
                                    : 'border-gray-300'
                                }`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.destinationFacilityName}
                              />

                              {formik.touched.destinationFacilityName &&
                                formik.errors.destinationFacilityName && (
                                  <span className='text-red-400'>
                                    {formik.errors.destinationFacilityName}
                                  </span>
                                )}
                            </div>
                            <div className='mb-2'>
                              <label htmlFor='destinationFacilityAuthorisationNumber'>
                                {t('common:authorisationNumber')}*
                              </label>
                              <input
                                type='text'
                                name='destinationFacilityAuthorisationNumber'
                                id='destinationFacilityAuthorisationNumber'
                                className={`block w-full rounded border py-1 px-2 ${
                                  formik.touched.destinationFacilityAuthorisationNumber &&
                                  formik.errors.destinationFacilityAuthorisationNumber
                                    ? 'border-red-400'
                                    : 'border-gray-300'
                                }`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.destinationFacilityAuthorisationNumber}
                              />

                              {formik.touched.destinationFacilityAuthorisationNumber &&
                                formik.errors.destinationFacilityAuthorisationNumber && (
                                  <span className='text-red-400'>
                                    {formik.errors.destinationFacilityAuthorisationNumber}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className='grid w-full grid-cols-2 gap-x-4'>
                            <div>
                              <div className='mb-2'>
                                <label htmlFor='destinationFacilityAddress'>
                                  {t('common:address')}
                                </label>
                                <input
                                  type='text'
                                  name='destinationFacilityAddress'
                                  id='destinationFacilityAddress'
                                  className={`block w-full rounded border py-1 px-2 ${
                                    formik.touched.destinationFacilityAddress &&
                                    formik.errors.destinationFacilityAddress
                                      ? 'border-red-400'
                                      : 'border-gray-300'
                                  }`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.destinationFacilityAddress}
                                  placeholder={t('common:addressPlaceholder')}
                                />
                                {formik.touched.destinationFacilityAddress &&
                                  formik.errors.destinationFacilityAddress && (
                                    <span className='text-red-400'>
                                      {formik.errors.destinationFacilityAddress}
                                    </span>
                                  )}
                              </div>
                              <div className='mb-2'>
                                <input
                                  type='text'
                                  name='destinationFacilityStreet'
                                  id='destinationFacilityStreet'
                                  className={`block w-full rounded border py-1 px-2 ${
                                    formik.touched.destinationFacilityStreet &&
                                    formik.errors.destinationFacilityStreet
                                      ? 'border-red-400'
                                      : 'border-gray-300'
                                  }`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.destinationFacilityStreet}
                                  placeholder={t('common:streetName')}
                                />
                                {formik.touched.destinationFacilityStreet &&
                                  formik.errors.destinationFacilityStreet && (
                                    <span className='text-red-400'>
                                      {formik.errors.destinationFacilityStreet}
                                    </span>
                                  )}
                              </div>
                              <div className='mb-2'>
                                <label htmlFor='destinationFacilityCity'>{t('common:city')}</label>
                                <input
                                  type='text'
                                  name='destinationFacilityCity'
                                  id='destinationFacilityCity'
                                  className={`block w-full rounded border py-1 px-2 ${
                                    formik.touched.destinationFacilityCity &&
                                    formik.errors.destinationFacilityCity
                                      ? 'border-red-400'
                                      : 'border-gray-300'
                                  }`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.destinationFacilityCity}
                                />
                                {formik.touched.destinationFacilityCity &&
                                  formik.errors.destinationFacilityCity && (
                                    <span className='text-red-400'>
                                      {formik.errors.destinationFacilityCity}
                                    </span>
                                  )}
                              </div>
                              <div className='mb-1'>
                                <label htmlFor='destinationFacilityCounty'>
                                  {t('common:county')} ({t('common:if applicable')})
                                </label>
                                <select
                                  name='destinationFacilityCounty'
                                  className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                                  onChange={formik.handleChange}
                                  value={formik.values.destinationFacilityCounty}
                                  onBlur={formik.handleBlur}
                                >
                                  <option value='' disabled selected>
                                    {t('common:Choose a county')}
                                  </option>
                                  {counties.map(item => (
                                    <option
                                      value={item}
                                      key={item}
                                      selected={
                                        data.destinationFacilityCounty === item ||
                                        formik.values.destinationFacilityCounty === item
                                      }
                                    >
                                      {item}
                                    </option>
                                  ))}
                                </select>
                                {formik.touched.destinationFacilityCounty &&
                                  formik.errors.destinationFacilityCounty && (
                                    <span className='text-red-400'>
                                      {formik.errors.destinationFacilityCounty}
                                    </span>
                                  )}
                              </div>
                              <div>
                                <label htmlFor='destinationFacilityEircode'>
                                  {t('common:eircode')}
                                </label>
                                <input
                                  type='text'
                                  name='destinationFacilityEircode'
                                  id='destinationFacilityEircode'
                                  className={`block w-full rounded border py-1 px-2 ${
                                    formik.touched.destinationFacilityEircode &&
                                    formik.errors.destinationFacilityEircode
                                      ? 'border-red-400'
                                      : 'border-gray-300'
                                  }`}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.destinationFacilityEircode}
                                  placeholder={t('common:Enter area Eircode')}
                                />
                                {formik.touched.destinationFacilityEircode &&
                                  formik.errors.destinationFacilityEircode && (
                                    <span className='text-red-400'>
                                      {formik.errors.destinationFacilityEircode}
                                    </span>
                                  )}
                              </div>
                              <div>
                                {t('common:Country')}
                                <select
                                  name='destinationFacilityCountry'
                                  className='w-full py-1.5 block overflow-hidden border-gray-300 focus:outline-none focus:ring-mainGreen focus:border-mainGreen text-sm rounded'
                                  onChange={formik.handleChange}
                                  value={formik.values.destinationFacilityCountry}
                                  onBlur={formik.handleBlur}
                                >
                                  {Object.entries(countries)
                                    .map(([, countryInfo]) => countryInfo.name)
                                    .sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'base'}))
                                    .map(countryName => (
                                      <option
                                        value={countryName}
                                        key={countryName}
                                        selected={
                                          data.destinationFacilityCountry === countryName ||
                                          formik.values.destinationFacilityCountry === countryName
                                        }
                                      >
                                        {countryName}
                                      </option>
                                    ))}
                                </select>
                                {formik.touched.destinationFacilityCountry &&
                                  formik.errors.destinationFacilityCountry && (
                                    <span className='text-red-400'>
                                      {formik.errors.destinationFacilityCountry}
                                    </span>
                                  )}
                              </div>
                            </div>
                            <div className='mb-1'>
                              <label>{t('common:gpsLocation')}</label>
                              <div
                                className={`flex h-[335px] flex-col justify-center items-center border border-gray-300 ${
                                  destinationGps
                                    ? 'py-6'
                                    : data.FORM_TYPE === 'EDIT_DOCKET' && !destinationGps
                                    ? 'py-1'
                                    : formik.errors.destinationFacilityLatitude
                                    ? 'py-5'
                                    : 'py-7'
                                } px-4`}
                              >
                                {!destinationGps && (
                                  <button
                                    type='button'
                                    onClick={() => handleGetCoordinates('destinationFacility')}
                                    className='px-2 py-2 font-bold text-white cursor-pointer bg-mainGreen'
                                  >
                                    {t('common:Pick Location')}
                                  </button>
                                )}
                                {formik.values.destinationFacilityLatitude && (
                                  <p>
                                    {t('common:Latitude')}:{' '}
                                    {formik.values.destinationFacilityLatitude}
                                  </p>
                                )}
                                {formik.values.destinationFacilityLongitude && (
                                  <p>
                                    {t('common:Longitude')}:{' '}
                                    {formik.values.destinationFacilityLongitude}
                                  </p>
                                )}
                              </div>
                              {formik.errors.destinationFacilityLatitude && (
                                <span className='text-red-400'>
                                  {formik.errors.destinationFacilityLatitude}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className='mt-2'>
                            <label htmlFor='destinationFacilityId'>
                              {t('common:destinationFacilityId')}*
                            </label>
                            <input
                              type='text'
                              name='destinationFacilityId'
                              id='destinationFacilityId'
                              className={`block w-full rounded border py-1 px-2 ${
                                formik.touched.destinationFacilityId &&
                                formik.errors.destinationFacilityId
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.destinationFacilityId}
                            />
                            {formik.touched.destinationFacilityId &&
                              formik.errors.destinationFacilityId && (
                                <span className='text-red-400'>
                                  {formik.errors.destinationFacilityId}
                                </span>
                              )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  {isLoadForExportValue === 'no' && (
                    <div className='w-1/2'>
                      <div className='mb-5'>
                        {t('common:isLoadForExport')}
                        <div className='flex items-center gap-6 p-1 pl-2 border border-gray-300 rounded'>
                          <div className='flex items-center gap-1'>
                            <label htmlFor='isLoadForExport-yes'>Yes</label>
                            <input
                              type='radio'
                              name='isLoadForExport'
                              id='isLoadForExport-yes'
                              onBlur={formik.handleBlur}
                              value='yes'
                              checked={isLoadForExportValue === 'yes' ? true : false}
                              className='mt-1 focus:ring-0'
                              onChange={e => setIsLoadForExportValue(e.target.value)}
                            />
                          </div>
                          <div className='flex items-center gap-1'>
                            <label htmlFor='isLoadForExport-no'>No</label>
                            <input
                              type='radio'
                              name='isLoadForExport'
                              id='isLoadForExport-no'
                              onBlur={formik.handleBlur}
                              value='no'
                              checked={isLoadForExportValue === 'no' ? true : false}
                              className='mt-1 focus:ring-0'
                              onChange={e => setIsLoadForExportValue(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className='mb-2'></div>
                      </div>
                    </div>
                  )}
                  {isLoadForExportValue === 'yes' && (
                    <div className='grid w-full grid-cols-2 gap-x-4'>
                      <div className='mb-2'>
                        {t('common:isLoadForExport')}
                        <div className='flex items-center gap-6 p-1 pl-2 border border-gray-300 rounded'>
                          <div className='flex items-center gap-1'>
                            <label htmlFor='isLoadForExport-yes'>Yes</label>
                            <input
                              type='radio'
                              name='isLoadForExport'
                              id='isLoadForExport-yes'
                              onBlur={formik.handleBlur}
                              value='yes'
                              checked={isLoadForExportValue === 'yes'}
                              className='mt-1 focus:ring-0'
                              onChange={e => setIsLoadForExportValue(e.target.value)}
                            />
                          </div>
                          <div className='flex items-center gap-1'>
                            <label htmlFor='isLoadForExport-no'>No</label>
                            <input
                              type='radio'
                              name='isLoadForExport'
                              id='isLoadForExport-no'
                              onBlur={formik.handleBlur}
                              value='no'
                              checked={isLoadForExportValue === 'no'}
                              className='mt-1 focus:ring-0'
                              onChange={e => setIsLoadForExportValue(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className='mb-2'></div>
                      </div>
                    </div>
                  )}
                  <div className='grid w-full grid-cols-2 gap-x-4'>
                    {isLoadForExportValue === 'yes' && (
                      <>
                        <div className='mb-2'>
                          <label htmlFor='portOfExport'>{t('common:portOfExport')}</label>
                          <input
                            type='text'
                            name='portOfExport'
                            id='portOfExport'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.portOfExport && formik.errors.portOfExport
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.portOfExport}
                          />

                          {formik.touched.portOfExport && formik.errors.portOfExport && (
                            <span className='text-red-400'>{formik.errors.portOfExport}</span>
                          )}
                        </div>
                        <div className='mb-2'>
                          <label htmlFor='countryOfDestination'>
                            {t('common:countryOfDestination')}
                          </label>
                          <input
                            type='text'
                            name='countryOfDestination'
                            id='countryOfDestination'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.countryOfDestination &&
                              formik.errors.countryOfDestination
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.countryOfDestination}
                          />

                          {formik.touched.countryOfDestination &&
                            formik.errors.countryOfDestination && (
                              <span className='text-red-400'>
                                {formik.errors.countryOfDestination}
                              </span>
                            )}
                          <div className='mb-2'></div>
                        </div>
                        <div className='mb-2'>
                          <label htmlFor='facilityAtDestination'>
                            {t('common:facilityAtDestination')}
                          </label>
                          <input
                            type='text'
                            name='facilityAtDestination'
                            id='facilityAtDestination'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.facilityAtDestination &&
                              formik.errors.facilityAtDestination
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.facilityAtDestination}
                          />

                          {formik.touched.facilityAtDestination &&
                            formik.errors.facilityAtDestination && (
                              <span className='text-red-400'>
                                {formik.errors.facilityAtDestination}
                              </span>
                            )}
                        </div>
                        <div className='mb-2'>
                          <label htmlFor='tfsReferenceNumber'>
                            {t('common:tfsReferenceNumber')}
                          </label>
                          <input
                            type='text'
                            name='tfsReferenceNumber'
                            id='tfsReferenceNumber'
                            className={`block w-full rounded border py-1 px-2 ${
                              formik.touched.tfsReferenceNumber && formik.errors.tfsReferenceNumber
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tfsReferenceNumber}
                          />

                          {formik.touched.tfsReferenceNumber &&
                            formik.errors.tfsReferenceNumber && (
                              <span className='text-red-400'>
                                {formik.errors.tfsReferenceNumber}
                              </span>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                  <label htmlFor='customerEmail'>{t('common:customerEmail')}</label>
                  <input
                    type='text'
                    className={`block w-full rounded border py-1 px-2 border-gray-300`}
                    disabled
                    value={selectedCustomerEmail}
                  />
                  <div className='flex items-center gap-1 mt-4'>
                    <label className='mt-0.5'>
                      {t('page:Do you want to send email to customer')}
                    </label>
                    <input
                      type='radio'
                      name='doSendEmail'
                      id='doSendEmail-yes'
                      onBlur={formik.handleBlur}
                      value='yes'
                      onChange={() => {
                        formik.setFieldValue('doSendEmail', 'yes');
                      }}
                      className='mt-1 focus:ring-0'
                      checked={formik.values.doSendEmail === 'yes' ? true : false}
                    />
                    <label className='mt-0.5' htmlFor='send-email-yes'>
                      {t('page:Yes')}
                    </label>
                    <input
                      type='radio'
                      name='doSendEmail'
                      id='doSendEmail-no'
                      onBlur={formik.handleBlur}
                      value='no'
                      onChange={() => {
                        formik.setFieldValue('doSendEmail', 'no');
                      }}
                      className='mt-1 focus:ring-0'
                      checked={formik.values.doSendEmail === 'no' ? true : false}
                    />
                    <label className='mt-0.5' htmlFor='send-email-no'>
                      {t('page:No')}
                    </label>
                  </div>
                </div>
              )}
              {step === 5 && (
                <div>
                  <div className='grid w-full grid-cols-2 gap-x-4'>
                    <div className='mb-2'>
                      <div className='flex items-center justify-between mb-2'>
                        <label htmlFor='wasteFacilityRepSignature'>
                          {t('common:wasteFacilityRepSignature')}
                        </label>
                        <button
                          type='button'
                          className='px-1 py-1 text-sm text-white bg-red-400 rounded'
                          onClick={() =>
                            handleClearSignature(
                              wasteFacilityRepSignatureRef,
                              'wasteFacilityRepSignature'
                            )
                          }
                        >
                          {t('page:Clear')}
                        </button>
                      </div>
                      {wasteFacilityRepSignatureImage &&
                      formik?.values?.wasteFacilityRepSignature ? (
                        <img
                          src={formik?.values?.wasteFacilityRepSignature}
                          alt='wasteFacilityRepSignature'
                          className={`block w-full h-40 object-contain rounded border py-1 px-2 border-gray-300`}
                        />
                      ) : (
                        <>
                          <SignatureCanvas
                            ref={wasteFacilityRepSignatureRef}
                            onEnd={() =>
                              handleSignatureEnd(
                                'wasteFacilityRepSignature',
                                wasteFacilityRepSignatureRef
                              )
                            }
                            canvasProps={{
                              name: 'wasteFacilityRepSignature',
                              id: 'wasteFacilityRepSignature',
                              className: `block h-40 w-full rounded border py-1 px-2 ${
                                formik.touched.wasteFacilityRepSignature &&
                                formik.errors.wasteFacilityRepSignature
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`,
                            }}
                          />
                          {formik.touched.wasteFacilityRepSignature &&
                            formik.errors.wasteFacilityRepSignature && (
                              <span className='text-red-400'>
                                {formik.errors.wasteFacilityRepSignature}
                              </span>
                            )}
                        </>
                      )}
                    </div>
                    <div className='mb-2'>
                      <div className='flex items-center justify-between mb-2'>
                        <label htmlFor='driverSignature'>{t('common:driverSignature')}</label>
                        <button
                          type='button'
                          className='px-1 py-1 text-sm text-white bg-red-400 rounded'
                          onClick={() =>
                            handleClearSignature(driverSignatureRef, 'driverSignature')
                          }
                        >
                          {t('page:Clear')}
                        </button>
                      </div>
                      {driverSignatureImage && formik?.values?.driverSignature ? (
                        <img
                          src={formik?.values?.driverSignature}
                          alt='driverSignature'
                          className={`block w-full h-40 object-contain rounded border py-1 px-2 border-gray-300`}
                        />
                      ) : (
                        <>
                          <SignatureCanvas
                            ref={driverSignatureRef}
                            onEnd={() => handleSignatureEnd('driverSignature', driverSignatureRef)}
                            canvasProps={{
                              name: 'driverSignature',
                              id: 'driverSignature',
                              className: `block h-40 w-full rounded border py-1 px-2 ${
                                formik.touched.driverSignature && formik.errors.driverSignature
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`,
                            }}
                          />
                          {formik.touched.driverSignature && formik.errors.driverSignature && (
                            <span className='text-red-400'>{formik.errors.driverSignature}</span>
                          )}
                        </>
                      )}
                    </div>
                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <label htmlFor='customerSignature'>{t('common:customerSignature')}</label>
                        <button
                          type='button'
                          className='px-1 py-1 text-sm text-white bg-red-400 rounded'
                          onClick={() =>
                            handleClearSignature(customerSignatureRef, 'customerSignature')
                          }
                        >
                          {t('page:Clear')}
                        </button>
                      </div>
                      {customerSignatureImage && formik.values?.customerSignature ? (
                        <img
                          src={formik.values?.customerSignature}
                          alt='customerSignature'
                          className={`block w-full h-40 object-contain rounded border px-2 border-gray-300`}
                        />
                      ) : (
                        <>
                          <SignatureCanvas
                            ref={customerSignatureRef}
                            onEnd={() =>
                              handleSignatureEnd('customerSignature', customerSignatureRef)
                            }
                            canvasProps={{
                              name: 'customerSignature',
                              id: 'customerSignature',
                              className: `block h-40 w-full rounded border ${
                                formik.touched.customerSignature && formik.errors.customerSignature
                                  ? 'border-red-400'
                                  : 'border-gray-300'
                              }`,
                            }}
                          />
                          {formik.touched.customerSignature && formik.errors.customerSignature && (
                            <span className='text-red-400'>{formik.errors.customerSignature}</span>
                          )}
                        </>
                      )}
                    </div>
                    <div className='mt-1'>
                      <label htmlFor='additionalInformation'>
                        {t('common:additionalInformation')}
                      </label>
                      <textarea
                        name='additionalInformation'
                        id='additionalInformation'
                        className={`block w-full rounded border py-1 h-40 px-2 mt-2 resize-none ${
                          formik.touched.additionalInformation &&
                          formik.errors.additionalInformation
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.additionalInformation}
                      />

                      {formik.touched.additionalInformation &&
                        formik.errors.additionalInformation && (
                          <span className='text-red-400'>
                            {formik.errors.additionalInformation}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <ErrorMessage title={error} className='mt-4' />
            <InformationalMessage title={responseMessage} className='mt-4' />
            <div className='flex flex-wrap items-center justify-between'>
              {step === 5 && data?.termsAndConditions && (
                <button type='button' className='px-6 py-3 text-white rounded bg-mainGreen'>
                  <a
                    href={`/fleetTermsAndConditions/${data.fleetId}?docketNumber=${docketNumber}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {t('page:terms&Conditions')}
                  </a>
                </button>
              )}
              {step === 1 && isWasteValue === 'yes' && (
                <div>
                  <button
                    className='px-4 py-3 mt-2 mb-1 text-white rounded bg-primary'
                    type='button'
                    onClick={() => {
                      formik.setFieldValue('wastes', [
                        ...formik.values.wastes,
                        {
                          wasteDescription: '',
                          wasteLoWCode: '',
                          isHazardous: false,
                          localAuthorityOfOrigin: '',
                          wasteQuantity: {
                            unit: '',
                            amount: 0,
                          },
                        },
                      ]);
                    }}
                  >
                    Add More Waste
                  </button>
                </div>
              )}
              <div />
              <div className='mb-4'>
                <button
                  type='button'
                  className='px-6 py-3 text-white bg-red-400 rounded'
                  onClick={() => {
                    if (submitting) {
                      return;
                    }
                    hideModal();
                    setWasteFacilityRepSignatureImage(false);
                    setDriverSignatureImage(false);
                    setCustomerSignatureImage(false);
                    wasteFacilityRepSignatureRef?.current?.clear();
                    driverSignatureRef?.current?.clear();
                    customerSignatureRef?.current?.clear();
                  }}
                >
                  {t('common:cancel')}
                </button>
                <button
                  type='button'
                  className='px-6 py-3 ml-4 border rounded border-mainGreen hover:bg-mainGreen hover:text-white'
                  onClick={() => {
                    if (submitting) {
                      return;
                    }
                    moveBack();
                  }}
                  disabled={imageDeleteLoading || imageUploadLoading}
                >
                  {t('common:Back')}
                </button>

                {step === 5 ? (
                  <button
                    className='px-6 py-3 mt-5 ml-4 text-white rounded bg-mainGreen'
                    type='submit'
                  >
                    {submitting ? t('common:Submitting') : t('common:submit')}
                  </button>
                ) : (
                  <button
                    onClick={moveNext}
                    className='px-6 py-3 mt-5 ml-4 text-white rounded bg-mainGreen'
                    type='button'
                    disabled={imageDeleteLoading || imageUploadLoading}
                  >
                    {t('common:next')}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className='max-h-[400px] xl:max-h-[500px] overflow-y-auto w-full pr-2'>
          <div className='text-md'>
            You have no fleets, please create a fleet in order to add a docket.
          </div>
          <div className='text-center'>
            <button
              type='button'
              className='p-3 text-white bg-red-400 rounded'
              onClick={() => {
                hideModal();
                setWasteFacilityRepSignatureImage(false);
                setDriverSignatureImage(false);
                setCustomerSignatureImage(false);
                wasteFacilityRepSignatureRef?.current?.clear();
                driverSignatureRef?.current?.clear();
                customerSignatureRef?.current?.clear();
              }}
            >
              {t('common:cancel')}
            </button>
            <button
              className='p-3 mt-5 ml-4 text-white rounded bg-primary'
              type='button'
              onClick={() => {
                hideModal();
                router.push('/fleets');
              }}
            >
              Go To Fleets
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
export default AddEditDocketData;
