import {gql} from '@apollo/client';

const getEnvironmentVairables = gql`
  query GetEnvironmentVairables {
    getEnvironmentVairables {
      environmentVariables
      response {
        status
        message
      }
    }
  }
`;

const queries = {
  getEnvironmentVairables,
};

export default queries;
