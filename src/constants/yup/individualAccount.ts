import * as Yup from 'yup';

export const INDIVIDUAL_ACCOUNT_INITIAL_STATE = {
  permitNumber: '',
};

export const INDIVIDUAL_ACCOUNT_VALIDATION = Yup.object().shape({
  permitNumber: Yup.string().required('Required'),
});
