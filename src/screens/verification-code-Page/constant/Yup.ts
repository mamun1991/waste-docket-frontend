import * as Yup from 'yup';

export const VERIFICATION_STATE = {
  OTP: '',
};

export const VERIFICATION_YUP = Yup.object().shape({
  OTP: Yup.string().required('Invalid OTP'),
});
