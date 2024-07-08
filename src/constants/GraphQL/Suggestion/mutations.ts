import {gql} from '@apollo/client';

const AddSuggestion = gql`
  mutation AddSuggestion($suggestionData: SuggestionInput!) {
    addSuggestion(suggestionData: $suggestionData) {
      status
      message
    }
  }
`;

const DeleteSuggestion = gql`
  mutation DeleteSuggestion($suggestionId: String, $doDeleteAll: Boolean) {
    deleteSuggestion(suggestionId: $suggestionId, doDeleteAll: $doDeleteAll) {
      status
      message
    }
  }
`;

const mutations = {
  AddSuggestion,
  DeleteSuggestion,
};

export default mutations;
