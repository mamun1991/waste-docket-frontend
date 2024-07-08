import * as Yup from 'yup';

export const SIGNUP_DETAILS_STATE = {
  name: '',
  VAT: '',
  permitNumber: '',
  isIndividual: false,
  isBusiness: false,
  permitHolderName: '',
  permitHolderAddress: '',
  permitHolderContactDetails: '',
};

export const SIGNUP_DETAILS_STATE_YUP = Yup.object().shape({
  isIndividual: Yup.boolean(),
  isBusiness: Yup.boolean(),
  name: Yup.string().when('isBusiness', {
    is: true,
    then: Yup.string().required('Rrequired'),
  }),
  VAT: Yup.string().when('isBusiness', {
    is: true,
    then: Yup.string().required('Required'),
  }),
  permitHolderName: Yup.string().when('isBusiness', {
    is: true,
    then: Yup.string().required('Required'),
  }),
  permitHolderAddress: Yup.string().when('isBusiness', {
    is: true,
    then: Yup.string().required('Required'),
  }),
  permitHolderContactDetails: Yup.string().when('isBusiness', {
    is: true,
    then: Yup.string().required('Required'),
  }),
  permitNumber: Yup.string().required('Required'),
});
