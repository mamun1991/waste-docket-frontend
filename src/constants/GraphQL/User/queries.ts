import {gql} from '@apollo/client';

const getUserById = gql`
  query GetUserById($token: String) {
    getUserById(token: $token) {
      userData {
        _id
        personalDetails {
          name
          email
        }
        accountType
        accountSubType
        isSignUpComplete
        createdAt
        fleets {
          _id
          isIndividual
          name
          VAT
          permitHolderName
          permitNumber
          permitHolderAddress
          termsAndConditions
          permitHolderContactDetails
          permitHolderEmail
          permitHolderLogo
          prefix
          docketNumber
          individualDocketNumber
          createdAt
          ownerEmail
          membersEmails
          allowedWaste {
            label
            value
          }
        }
        invitations {
          _id
          inviteeEmail
          fleetName
          status
          createdAt
        }
        selectedFleet {
          _id
          isIndividual
          name
          VAT
          permitHolderName
          permitNumber
          permitHolderAddress
          termsAndConditions
          permitHolderContactDetails
          permitHolderEmail
          permitHolderLogo
          prefix
          docketNumber
          individualDocketNumber
          createdAt
          ownerEmail
          membersEmails
          allowedWaste {
            label
            value
          }
        }
      }
      subscription {
        _id
        plan
        oldPlan
        status
        trialEndsAt
        startAt
        endsAt
        stripeSubscriptionId
        stripeCustomerId
        stripeProductId
        stripePriceId
        createdAt
        updatedAt
        maxLimit
        limit
      }
    }
  }
`;

const GetUsers = gql`
  query GetUsers($usersInput: SearchInput) {
    getUsers(usersInput: $usersInput) {
      response {
        status
        message
      }
      totalCount
      usersData {
        accountType
        _id
        personalDetails {
          name
          email
        }
      }
    }
  }
`;

const GetPendingInvitationsByEmail = gql`
  query GetPendingInvitations {
    getPendingInvitations {
      response {
        status
        message
      }
      invitations {
        _id
        inviteeEmail
        fleetName
        status
        createdAt
        fleetId {
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

const GetPendingInvitationsByDriverEmail = gql`
  query GetPendingInvitationsByEmail($driverEmail: String) {
    getPendingInvitationsByEmail(driverEmail: $driverEmail) {
      response {
        status
        message
      }
      invitations {
        _id
        inviteeEmail
        fleetName
        status
        createdAt
        fleetId {
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

const GetAllUsersForAdmin = gql`
  query GetAllUsersForAdmin($searchParams: GeneralSearchParams) {
    getAllUsersForAdmin(searchParams: $searchParams) {
      totalCount
      userData {
        _id
        personalDetails {
          name
          email
        }
        accountType
        accountSubType
        isSignUpComplete
        createdAt
      }
      response {
        status
        message
      }
    }
  }
`;

const GetAllUsersForAdminWithSorting = gql`
  query GetAllUsersForAdminWithSorting($searchParams: GeneralSearchParamsWithSorting) {
    getAllUsersForAdminWithSorting(searchParams: $searchParams) {
      totalCount
      userData {
        _id
        personalDetails {
          name
          email
        }
        accountType
        accountSubType
        isSignUpComplete
        createdAt
      }
      response {
        status
        message
      }
    }
  }
`;

const getSubscribedStripeUsers = gql`
  query GetSubscribedStripeUsers(
    $token: String
    $pageNumber: String
    $pageSize: String
    $starting_after: String
    $paginationMode: String
  ) {
    getSubscribedStripeUsers(
      token: $token
      pageNumber: $pageNumber
      pageSize: $pageSize
      starting_after: $starting_after
      paginationMode: $paginationMode
    ) {
      data {
        customerId
        email
        default_payment_method
        name
        phone
        subscriptionId
        collection_method
        currency
        latest_invoice
        subscriptionStatus
        productName
        isSubscriptionCancelled
      }
      totalCount
      response {
        status
        message
      }
    }
  }
`;

const queries = {
  getUserById,
  GetUsers,
  GetPendingInvitationsByEmail,
  GetPendingInvitationsByDriverEmail,
  GetAllUsersForAdmin,
  GetAllUsersForAdminWithSorting,
  getSubscribedStripeUsers,
};

export default queries;
