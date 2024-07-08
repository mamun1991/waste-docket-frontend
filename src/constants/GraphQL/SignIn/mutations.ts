import {gql} from '@apollo/client';

const handleSignIn = gql`
  mutation Mutation($email: String!, $fName: String, $lName: String, $phone: String) {
    handleSignIn(email: $email, fName: $fName, lName: $lName, phone: $phone) {
      message
      status
    }
  }
`;

const generateSignUpOtp = gql`
  mutation GenerateSignUpOtp($email: String!, $fullName: String!) {
    generateSignUpOtp(email: $email, fullName: $fullName) {
      status
      message
    }
  }
`;

const generateSignInOtp = gql`
  mutation GenerateSignInOtp($email: String) {
    generateSignInOtp(email: $email) {
      message
      status
    }
  }
`;

const validateOtp = gql`
  mutation ValidateOtp(
    $otpToken: String!
    $email: String
    $fullName: String
    $accountSubType: String
  ) {
    validateOtp(
      otpToken: $otpToken
      email: $email
      fullName: $fullName
      accountSubType: $accountSubType
    ) {
      email
      token
      response {
        status
        message
      }
      user {
        _id
        accountType
        accountSubType
        isSignUpComplete
        personalDetails {
          name
          email
        }
        invitations {
          _id
          inviteeEmail
          status
          fleetId {
            _id
            name
          }
          createdAt
        }
        fleets {
          _id
          isIndividual
          name
          VAT
          permitNumber
          ownerEmail
          membersEmails
        }
      }
    }
  }
`;

const mutations = {
  handleSignIn,
  generateSignUpOtp,
  validateOtp,
  generateSignInOtp,
};

export default mutations;
