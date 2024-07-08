import * as Yup from 'yup';

export const DOCKET_INITIAL_STATE = {
  doesCustomerExist: true,
  doesFacilityExist: true,
  customerName: '',
  customerPhone: '',
  customerStreet: '',
  customerCity: '',
  customerCounty: '',
  customerEircode: '',
  customerCountry: 'Ireland',
  customerAddress: '',
  customerEmail: '',
  jobId: '',
  customerId: '',
  permitNumber: '',
  permitHolderAddress: '',
  permitHolderContactDetails: '',
  permitHolderLogo: '',
  permitHolderEmail: '',
  individualDocketNumber: '',
  gpsOn: false,
  date: '',
  longitude: '',
  latitude: '',
  time: '',
  vehicleRegistration: '',
  generalPickupDescription: '',
  nonWasteLoadPictures: [''],
  isWaste: false,
  wastes: [],
  collectedFromWasteFacility: false,
  collectionPointName: '',
  collectionPointAddress: '',
  collectionPointStreet: '',
  collectionPointCity: '',
  collectionPointCounty: '',
  collectionPointEircode: '',
  collectionPointCountry: 'Ireland',
  destinationFacility: '',
  destinationFacilityLatitude: '',
  destinationFacilityLongitude: '',
  destinationFacilityName: '',
  destinationFacilityAuthorisationNumber: '',
  destinationFacilityAddress: '',
  destinationFacilityStreet: '',
  destinationFacilityCity: '',
  destinationFacilityCounty: '',
  destinationFacilityEircode: '',
  destinationFacilityCountry: 'Ireland',
  destinationFacilityId: '',
  driverSignature: '',
  wasteFacilityRepSignature: '',
  customerSignature: '',
  isLoadForExport: false,
  portOfExport: '',
  countryOfDestination: '',
  facilityAtDestination: '',
  tfsReferenceNumber: '',
  additionalInformation: '',
  doSendEmail: 'no',
};

export const DOCKET_VALIDATION = Yup.object({
  doesCustomerExist: Yup.boolean(),
  doesFacilityExist: Yup.boolean(),
  customerName: Yup.string().required('Required'),
  customerPhone: Yup.string().nullable(),
  jobId: Yup.string().nullable(),
  customerId: Yup.string().nullable(),
  customerAddress: Yup.string().nullable(),
  customerStreet: Yup.string().nullable(),
  customerCity: Yup.string().nullable(),
  customerCounty: Yup.string().nullable(),
  customerEircode: Yup.string().nullable(),
  customerCountry: Yup.string().nullable(),
  customerEmail: Yup.string().email('Invalid email address').nullable(),
  individualDocketNumber: Yup.string(),
  gpsOn: Yup.boolean(),
  longitude: Yup.string().nullable(),
  latitude: Yup.string().nullable(),
  date: Yup.date(),
  time: Yup.string(),
  vehicleRegistration: Yup.string().nullable(),
  isWaste: Yup.boolean(),
  wastes: Yup.array().when('isWaste', {
    is: true,
    then: Yup.array().of(
      Yup.object({
        wasteDescription: Yup.string().nullable(),
        wasteLoWCode: Yup.string().nullable(),
        isHazardous: Yup.boolean().nullable(),
        localAuthorityOfOrigin: Yup.string().nullable(),
        wasteQuantity: Yup.object().shape({
          unit: Yup.string().nullable(),
          amount: Yup.number().default(0).nullable(),
        }),
        wasteLoadPicture: Yup.mixed().nullable(),
      })
    ),
  }),
  generalPickupDescription: Yup.string().when('isWaste', {
    is: false,
    then: Yup.string(),
    otherwise: Yup.string(),
  }),
  nonWasteLoadPictures: Yup.array()
    .of(Yup.string())
    .when('isWaste', {
      is: false,
      then: Yup.array().of(Yup.string()).nullable(),
      otherwise: Yup.array().of(Yup.string()).nullable(),
    })
    .nullable(),
  collectedFromWasteFacility: Yup.boolean(),
  collectionPointName: Yup.string().nullable(),
  collectionPointAddress: Yup.string(),
  collectionPointEircode: Yup.string(),
  collectionPointStreet: Yup.string(),
  collectionPointCity: Yup.string(),
  collectionPointCounty: Yup.string(),
  collectionPointCountry: Yup.string(),
  destinationFacilityId: Yup.string().nullable(),
  destinationFacilityLatitude: Yup.string().nullable(),
  destinationFacilityLongitude: Yup.string().nullable(),
  destinationFacilityName: Yup.string().nullable(),
  destinationFacilityAuthorisationNumber: Yup.string().nullable(),
  destinationFacilityAddress: Yup.string().nullable(),
  destinationFacilityStreet: Yup.string().nullable(),
  destinationFacilityCity: Yup.string().nullable(),
  destinationFacilityCounty: Yup.string().nullable(),
  destinationFacilityEircode: Yup.string().nullable(),
  destinationFacilityCountry: Yup.string().nullable(),
  driverSignature: Yup.string(),
  wasteFacilityRepSignature: Yup.string(),
  customerSignature: Yup.string().nullable(),
  isLoadForExport: Yup.boolean(),
  portOfExport: Yup.string().when('isLoadForExport', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string(),
  }),
  countryOfDestination: Yup.string().when('isLoadForExport', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string(),
  }),
  facilityAtDestination: Yup.string().when('isLoadForExport', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string(),
  }),
  tfsReferenceNumber: Yup.string().when('isLoadForExport', {
    is: true,
    then: Yup.string(),
    otherwise: Yup.string(),
  }),
  additionalInformation: Yup.string(),
  doSendEmail: Yup.string(),
});