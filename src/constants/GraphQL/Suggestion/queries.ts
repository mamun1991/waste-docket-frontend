import {gql} from '@apollo/client';

const GetSuggestions = gql`
  query GetSuggestions(
    $fleetId: String
    $searchParams: GeneralSearchParamsWithSorting
    $doFetchJustCount: Boolean
  ) {
    getSuggestions(
      fleetId: $fleetId
      searchParams: $searchParams
      doFetchJustCount: $doFetchJustCount
    ) {
      response {
        message
        status
      }
      suggestions {
        _id
        email
        name
        suggestion
        fleet {
          _id
          name
          ownerEmail
        }
        fleetName
        fleetOwnerEmail
        createdAt
      }
      totalCount
    }
  }
`;

const queries = {
  GetSuggestions,
};

export default queries;
