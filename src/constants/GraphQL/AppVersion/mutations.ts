import {gql} from '@apollo/client';

const ManageAppVersion = gql`
  mutation ManageAppVersion($appVersionData: AppVersionInput!) {
    manageAppVersion(appVersionData: $appVersionData) {
      status
      message
    }
  }
`;

const mutations = {
  ManageAppVersion,
};

export default mutations;
