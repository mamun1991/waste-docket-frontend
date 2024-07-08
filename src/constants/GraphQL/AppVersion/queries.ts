import {gql} from '@apollo/client';

const GetAppVersion = gql`
  query GetAppVersion {
    getAppVersion {
      response {
        status
        message
      }
      appVersion {
        androidLatestVersion
        isAndroidUpgradeMandatory
        iosLatestVersion
        isIosUpgradeMandatory
      }
    }
  }
`;

const queries = {
  GetAppVersion,
};

export default queries;
