import * as Yup from 'yup';

export const FACILITY_STATE = {
  destinationFacilityName: '',
  destinationFacilityAuthorisationNumber: '',
  destinationFacilityAddress: '',
  destinationFacilityStreet: '',
  destinationFacilityCity: '',
  destinationFacilityCounty: '',
  destinationFacilityEircode: '',
  destinationFacilityCountry: 'Ireland',
  destinationFacilityLongitude: '',
  destinationFacilityLatitude: '',
  destinationFacilityId: '',
};

export const FACILITY_VALIDATION = Yup.object().shape({
  destinationFacilityName: Yup.string().required('Required'),
  destinationFacilityAuthorisationNumber: Yup.string().required('Required'),
  destinationFacilityAddress: Yup.string().nullable(),
  destinationFacilityStreet: Yup.string().nullable(),
  destinationFacilityCity: Yup.string().nullable(),
  destinationFacilityCounty: Yup.string().nullable(),
  destinationFacilityEircode: Yup.string().nullable(),
  destinationFacilityLongitude: Yup.string().nullable(),
  destinationFacilityLatitude: Yup.string().nullable(),
  destinationFacilityId: Yup.string().required('Required').nullable(),
});
