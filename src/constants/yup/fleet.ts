import * as Yup from 'yup';

export const FLEET_INITIAL_STATE = {
  name: '',
  VAT: '',
  permitHolderName: '',
  permitNumber: '',
  permitHolderAddress: '',
  termsAndConditions: '',
  permitHolderContactDetails: '',
  permitHolderLogo: '',
  prefix: 'WD',
  docketNumber: 0,
};

export const FLEET_VALIDATION = Yup.object().shape({
  name: Yup.string().required('Required'),
  VAT: Yup.string().required('Required'),
  permitHolderName: Yup.string().required('Required'),
  permitNumber: Yup.string().required('Required'),
  permitHolderAddress: Yup.string().required('Required'),
  termsAndConditions: Yup.string().nullable(),
  permitHolderContactDetails: Yup.string().required('Required'),
  permitHolderLogo: Yup.string().nullable(), // allow null value
  prefix: Yup.string(),
  docketNumber: Yup.number().required('Required'),
});
