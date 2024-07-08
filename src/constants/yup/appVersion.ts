import * as Yup from 'yup';

export const APP_VERSION_INITIAL_STATE = {
  androidLatestVersion: '',
  isAndroidUpgradeMandatory: 'no',
  iosLatestVersion: '',
  isIosUpgradeMandatory: 'no',
};

export const APP_VERSION_VALIDATION = Yup.object().shape({
  androidLatestVersion: Yup.string().nullable(),
  isAndroidUpgradeMandatory: Yup.string().nullable(),
  iosLatestVersion: Yup.string().nullable(),
  isIosUpgradeMandatory: Yup.string().nullable(),
});
