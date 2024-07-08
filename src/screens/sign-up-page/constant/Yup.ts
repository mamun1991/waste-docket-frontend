import * as Yup from 'yup';

export const SIGNUP_STATE = {
  fullName: '',
  email: '',
  isAgree: false,
};

export const SIGNUP_STATE_YUP = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().required('Email is required'),
  isAgree: Yup.boolean().oneOf([true], 'Please agree to terms and conditions'),
});
