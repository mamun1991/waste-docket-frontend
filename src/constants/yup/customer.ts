import * as Yup from 'yup';

export const CUSTOMER_STATE = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  customerAddress: '',
  customerStreet: '',
  customerCity: '',
  customerCounty: '',
  customerEircode: '',
  customerCountry: 'Ireland',
  customerId: '',
};

export const CUSTOMER_VALIDATION = Yup.object().shape({
  customerName: Yup.string().required('Required'),
  customerPhone: Yup.string().nullable(),
  customerEmail: Yup.string().email('Invalid email').nullable(),
  customerAddress: Yup.string().nullable(),
  customerStreet: Yup.string().nullable(),
  customerCity: Yup.string().nullable(),
  customerCounty: Yup.string().nullable(),
  customerEircode: Yup.string().nullable(),
  customerCountry: Yup.string().nullable(),
  customerId: Yup.string().nullable(),
});
