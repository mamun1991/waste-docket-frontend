import * as Yup from 'yup';

export const SITE_INITIAL_STATE = {
  name: '',
  address: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  operator: '',
  plantManagerName: '',
  buildingSquareFootage: '',
  plantModel: '',
  plantImages: [],
};

export const SITE_VALIDATION = Yup.object().shape({
  name: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
  contactName: Yup.string().required('Required'),
  contactEmail: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
  contactPhone: Yup.string().required('Required'),
  operator: Yup.string().required('Required'),
  plantManagerName: Yup.string().nullable(),
  buildingSquareFootage: Yup.string().nullable(),
  plantModel: Yup.string().nullable(),
  plantImages: Yup.array().of(Yup.string()),
});
