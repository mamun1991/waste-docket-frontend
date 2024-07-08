import * as Yup from 'yup';

export const FLEET_INITIAL_STATE = {
  email: '',
};

export const FLEET_VALIDATION = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});
