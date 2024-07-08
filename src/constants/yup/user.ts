import {ACCOUNT_TYPES} from '@/constants/enums';
import * as Yup from 'yup';

const accountTypes = [ACCOUNT_TYPES.ADMIN, ACCOUNT_TYPES.USER];
export const USER_INITIAL_STATE = {
  name: '',
  email: '',
  accountType: accountTypes[0],
  phone: '',
  operator: '',
};

export const USER_VALIDATION_NEW = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
  accountType: Yup.string().required('Required'),
  phone: Yup.string(),
});
export const USER_VALIDATION_EDIT = Yup.object().shape({
  name: Yup.string().required('Required'),
  accountType: Yup.string().required('Required'),
});
