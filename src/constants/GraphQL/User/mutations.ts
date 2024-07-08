import {gql} from '@apollo/client';

const createUser = gql`
  mutation Mutation($userData: UserInput) {
    addNewUser(userData: $userData) {
      message
      status
    }
  }
`;

const editUser = gql`
  mutation UpdateUserById($userId: String, $userData: UserUpdateInput) {
    updateUserById(userId: $userId, userData: $userData) {
      status
      message
    }
  }
`;

const deleteUser = gql`
  mutation DeleteUserById($userId: String) {
    deleteUserById(userId: $userId) {
      status
      message
    }
  }
`;

const completeSignUp = gql`
  mutation CompleteSignUp(
    $isIndividual: Boolean
    $isBusiness: Boolean
    $name: String
    $vat: String
    $permitNumber: String
    $permitHolderName: String
    $permitHolderAddress: String
    $permitHolderContactDetails: String
    $prefix: String
  ) {
    completeSignUp(
      isIndividual: $isIndividual
      isBusiness: $isBusiness
      name: $name
      VAT: $vat
      permitNumber: $permitNumber
      permitHolderName: $permitHolderName
      permitHolderAddress: $permitHolderAddress
      permitHolderContactDetails: $permitHolderContactDetails
      prefix: $prefix
    ) {
      response {
        status
        message
      }
      pendingInvites
      fleets {
        isIndividual
        name
        VAT
        permitNumber
        ownerEmail
        membersEmails
      }
    }
  }
`;

const DeleteUserByAdmin = gql`
  mutation DeleteUserByAdmin($userId: String) {
    deleteUserByAdmin(userId: $userId) {
      status
      message
    }
  }
`;

const DeleteMyAccount = gql`
  mutation DeleteMyAccount {
    deleteMyAccount {
      status
      message
    }
  }
`;

const changeRole = gql`
  mutation ChangeRole($userId: String!, $role: String!) {
    changeRole(userId: $userId, role: $role) {
      message
      status
    }
  }
`;

const changeSubRole = gql`
  mutation ChangeSubRole($userId: String!, $subRole: String!) {
    changeSubRole(userId: $userId, subRole: $subRole) {
      message
      status
    }
  }
`;

const updateSubRoleByUser = gql`
  mutation UpdateSubRoleByUser($subRole: String!) {
    updateSubRoleByUser(subRole: $subRole) {
      message
      status
    }
  }
`;

const CreateSubscription = gql`
  mutation CreateSubscription(
    $paymentMethodId: String!
    $plan: String!
    $user: String!
    $mode: String!
  ) {
    createSubscription(paymentMethodId: $paymentMethodId, plan: $plan, user: $user, mode: $mode) {
      message
      status
    }
  }
`;

const CancelSubscription = gql`
  mutation CancelSubscription($subscriptionId: String!) {
    cancelSubscription(subscriptionId: $subscriptionId) {
      message
      status
    }
  }
`;

const RefundAndUnsubscribe = gql`
  mutation RefundAndUnsubscribe(
    $latest_invoice: String!
    $customerId: String!
    $email: String!
    $subscriptionId: String!
    $productName: String!
  ) {
    refundAndUnsubscribe(
      latest_invoice: $latest_invoice
      customerId: $customerId
      email: $email
      subscriptionId: $subscriptionId
      productName: $productName
    ) {
      message
      status
    }
  }
`;

const DeleteStripeCustomer = gql`
  mutation deleteStripeCustomer(
    $latest_invoice: String!
    $customerId: String!
    $email: String!
    $subscriptionId: String!
    $productName: String!
  ) {
    deleteStripeCustomer(
      latest_invoice: $latest_invoice
      customerId: $customerId
      email: $email
      subscriptionId: $subscriptionId
      productName: $productName
    ) {
      message
      status
    }
  }
`;

const mutations = {
  createUser,
  editUser,
  deleteUser,
  completeSignUp,
  DeleteUserByAdmin,
  DeleteMyAccount,
  changeRole,
  changeSubRole,
  updateSubRoleByUser,
  CreateSubscription,
  CancelSubscription,
  RefundAndUnsubscribe,
  DeleteStripeCustomer,
};

export default mutations;
