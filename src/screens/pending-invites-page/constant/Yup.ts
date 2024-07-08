import * as Yup from 'yup';

export const SIGNIN_STATE = {
  email: '',
};

export const SIGNIN_STATE_YUP = Yup.object().shape({
  email: Yup.string().required('Required'),
});
