import {gql} from '@apollo/client';

const AddFleet = gql`
  mutation AddFleet($fleetData: FleetInput) {
    addFleet(fleetData: $fleetData) {
      response {
        status
        message
      }
      fleetData {
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
`;

const UpdateFleet = gql`
  mutation UpdateFleet($fleetId: String, $fleetData: FleetInput) {
    updateFleet(fleetId: $fleetId, fleetData: $fleetData) {
      response {
        status
        message
      }
      fleetData {
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
`;

const DeleteFleet = gql`
  mutation DeleteFleet($fleetId: String) {
    deleteFleet(fleetId: $fleetId) {
      status
      message
    }
  }
`;

const InviteUserInFleet = gql`
  mutation InviteUserInFleet($fleetInvitationData: fleetInvitationInput) {
    inviteUserInFleet(fleetInvitationData: $fleetInvitationData) {
      status
      message
    }
  }
`;

const InvitationAction = gql`
  mutation InvitationAction(
    $dontChangeSelectedFleet: Boolean
    $action: INVITATION_STATUS
    $fleetId: String
  ) {
    invitationAction(
      dontChangeSelectedFleet: $dontChangeSelectedFleet
      action: $action
      fleetId: $fleetId
    ) {
      status
      message
    }
  }
`;

const InvitationActionByEmail = gql`
  mutation InviteActionByEmail(
    $dontChangeSelectedFleet: Boolean
    $action: INVITATION_STATUS
    $fleetId: String
    $driverEmail: String
  ) {
    inviteActionByEmail(
      dontChangeSelectedFleet: $dontChangeSelectedFleet
      action: $action
      fleetId: $fleetId
      driverEmail: $driverEmail
    ) {
      status
      message
    }
  }
`;

const LeaveFleet = gql`
  mutation LeaveFleet($fleetId: String!) {
    leaveFleet(fleetId: $fleetId) {
      status
      message
    }
  }
`;

const RemoveUserInFleet = gql`
  mutation RemoveUserInFleet($email: String, $fleetId: String) {
    removeUserInFleet(email: $email, fleetId: $fleetId) {
      status
      message
    }
  }
`;

const ChangeSelectedFleet = gql`
  mutation ChangeSelectedFleet($fleetId: String!) {
    changeSelectedFleet(fleetId: $fleetId) {
      status
      message
    }
  }
`;

const AddIndividualAccount = gql`
  mutation AddIndividualAccount($permitNumber: String!) {
    addIndividualAccount(permitNumber: $permitNumber) {
      status
      message
    }
  }
`;

const AddDocket = gql`
  mutation AddDocket($fleetId: String!, $docketData: DocketInput!) {
    addDocket(fleetId: $fleetId, docketData: $docketData) {
      response {
        status
        message
      }
    }
  }
`;

const ForwardDocket = gql`
  mutation ForwardDocket($fleetId: String!, $docketId: String!, $email: String!) {
    forwardDocket(fleetId: $fleetId, docketId: $docketId, email: $email) {
      status
      message
    }
  }
`;

const UploadWasteFacilityRepSignature = gql`
  mutation UploadWasteFacilityRepSignature($signatureData: uploadWasteFacilityRepSignatureInput!) {
    uploadWasteFacilityRepSignature(signatureData: $signatureData) {
      _id
      response {
        status
        message
      }
    }
  }
`;

const UploadDriverSignature = gql`
  mutation UploadDriverSignature($signatureData: uploadDriverSignatureInput!) {
    uploadDriverSignature(signatureData: $signatureData) {
      _id
      response {
        status
        message
      }
    }
  }
`;

const uploadPdfUrlChunk = gql`
  mutation UploadPdfUrlChunk($pdfData: uploadPdfUrlChunkInput!) {
    uploadPdfUrlChunk(pdfData: $pdfData) {
      _id
      response {
        status
        message
      }
    }
  }
`;

const DeleteDocketById = gql`
  mutation DeleteDocketById($docketId: String!, $fleetId: String!) {
    deleteDocketById(docketId: $docketId, fleetId: $fleetId) {
      status
      message
    }
  }
`;

const DeletePendingInvitation = gql`
  mutation DeletePendingInvitation($invitationId: String!) {
    deletePendingInvitation(invitationId: $invitationId) {
      status
      message
    }
  }
`;

const UpdateDocketById = gql`
  mutation UpdateDocketById($docketId: String!, $fleetId: String!, $docketData: DocketInput!) {
    updateDocketById(docketId: $docketId, fleetId: $fleetId, docketData: $docketData) {
      status
      message
    }
  }
`;

const UpdateDocketSignatures = gql`
  mutation updateDocketSignatures(
    $docketId: String!
    $fleetId: String!
    $docketData: DocketInput!
  ) {
    updateDocketSignatures(docketId: $docketId, fleetId: $fleetId, docketData: $docketData) {
      status
      message
    }
  }
`;

const DeleteFleetByAdmin = gql`
  mutation DeleteFleetByAdmin($fleetId: String) {
    deleteFleetByAdmin(fleetId: $fleetId) {
      status
      message
    }
  }
`;

const DeleteDocketByAdmin = gql`
  mutation DeleteDocketByAdmin($docketId: String) {
    deleteDocketByAdmin(docketId: $docketId) {
      status
      message
    }
  }
`;

const DeleteCollectionsDataByAdmin = gql`
  mutation DeleteCollectionsDataByAdmin($collection: String!) {
    deleteCollectionsDataByAdmin(collection: $collection) {
      status
      message
    }
  }
`;

const AddCustomerInFleet = gql`
  mutation AddCustomerInFleet($fleetId: String!, $customerData: CustomerContactInput!) {
    addCustomerInFleet(fleetId: $fleetId, customerData: $customerData) {
      customerContact {
        fleetOwnerEmail
        contactProviderEmail
        customerName
        customerPhone
        customerAddress
        customerStreet
        customerCity
        customerCounty
        customerEircode
        customerCountry
        customerEmail
        customerId
        isAutomatedGenerated
      }
      response {
        status
        message
      }
    }
  }
`;

const EditCustomerInFleet = gql`
  mutation EditCustomerInFleet(
    $customerId: String!
    $fleetId: String!
    $customerData: CustomerContactInput!
  ) {
    editCustomerInFleet(customerId: $customerId, fleetId: $fleetId, customerData: $customerData) {
      customerContact {
        fleetOwnerEmail
        contactProviderEmail
        customerName
        customerPhone
        customerAddress
        customerStreet
        customerCity
        customerCounty
        customerEircode
        customerCountry
        customerEmail
        customerId
        isAutomatedGenerated
      }
      response {
        status
        message
      }
    }
  }
`;

const DeleteCustomerInFleet = gql`
  mutation DeleteCustomerInFleet($customerId: String!, $fleetId: String!) {
    deleteCustomerInFleet(customerId: $customerId, fleetId: $fleetId) {
      response {
        status
        message
      }
    }
  }
`;

const ImportCustomers = gql`
  mutation ImportCustomersInFleet($fleetId: String!, $file: Upload!) {
    importCustomersInFleet(fleetId: $fleetId, file: $file) {
      response {
        status
        message
      }
    }
  }
`;

const DeleteFacilityInFleet = gql`
  mutation DeleteFacilityInFleet($facilityId: String!, $fleetId: String!) {
    deleteFacilityInFleet(facilityId: $facilityId, fleetId: $fleetId) {
      response {
        message
        status
      }
    }
  }
`;

const AddFacilityInFleet = gql`
  mutation AddFacilityInFleet($fleetId: String!, $facilityData: DestinationFacilityInput!) {
    addFacilityInFleet(fleetId: $fleetId, facilityData: $facilityData) {
      response {
        message
        status
      }
      destinationFacilities {
        _id
        fleet {
          _id
          isIndividual
          name
          VAT
          permitNumber
          ownerEmail
          permitHolderName
          permitHolderAddress
          termsAndConditions
          permitHolderContactDetails
          permitHolderEmail
          permitHolderLogo
          prefix
          docketNumber
          individualDocketNumber
          membersEmails
          invitations {
            _id
            inviteeEmail
            fleetName
            status
            fleetId {
              _id
              isIndividual
              name
              VAT
              permitNumber
              ownerEmail
              permitHolderName
              permitHolderAddress
              termsAndConditions
              permitHolderContactDetails
              permitHolderEmail
              permitHolderLogo
              prefix
              docketNumber
              individualDocketNumber
              membersEmails
              createdAt
            }
            userId {
              _id
              accountType
              isSignUpComplete
              createdAt
            }
            createdAt
          }
          allowedWaste {
            label
            value
          }
          createdAt
        }
        user {
          _id
          personalDetails {
            name
            email
          }
          accountType
          isSignUpComplete
          fleets {
            _id
            isIndividual
            name
            VAT
            permitNumber
            ownerEmail
            permitHolderName
            permitHolderAddress
            termsAndConditions
            permitHolderContactDetails
            permitHolderEmail
            permitHolderLogo
            prefix
            docketNumber
            individualDocketNumber
            membersEmails
            createdAt
          }
          createdAt
        }
        destinationFacilityName
        destinationFacilityAuthorisationNumber
        destinationFacilityAddress
        destinationFacilityStreet
        destinationFacilityCity
        destinationFacilityCounty
        destinationFacilityEircode
        destinationFacilityCountry
        destinationFacilityLatitude
        destinationFacilityLongitude
        destinationFacilityId
      }
    }
  }
`;

const EditFacilityInFleet = gql`
  mutation EditFacilityInFleet(
    $fleetId: String!
    $facilityData: DestinationFacilityInput!
    $facilityId: String!
  ) {
    editFacilityInFleet(fleetId: $fleetId, facilityData: $facilityData, facilityId: $facilityId) {
      response {
        message
        status
      }
      destinationFacilities {
        _id
        fleet {
          _id
          isIndividual
          name
          VAT
          permitNumber
          ownerEmail
          permitHolderName
          permitHolderAddress
          termsAndConditions
          permitHolderContactDetails
          permitHolderEmail
          permitHolderLogo
          prefix
          docketNumber
          individualDocketNumber
          membersEmails
          invitations {
            _id
            inviteeEmail
            fleetName
            status
            fleetId {
              _id
              isIndividual
              name
              VAT
              permitNumber
              ownerEmail
              permitHolderName
              permitHolderAddress
              termsAndConditions
              permitHolderContactDetails
              permitHolderEmail
              permitHolderLogo
              prefix
              docketNumber
              individualDocketNumber
              membersEmails
              createdAt
            }
            userId {
              _id
              accountType
              isSignUpComplete
              createdAt
            }
            createdAt
          }
          allowedWaste {
            label
            value
          }
          createdAt
        }
        user {
          _id
          personalDetails {
            name
            email
          }
          accountType
          isSignUpComplete
          fleets {
            _id
            isIndividual
            name
            VAT
            permitNumber
            ownerEmail
            permitHolderName
            permitHolderAddress
            termsAndConditions
            permitHolderContactDetails
            permitHolderEmail
            permitHolderLogo
            prefix
            docketNumber
            individualDocketNumber
            membersEmails
            createdAt
          }
          createdAt
        }
        destinationFacilityName
        destinationFacilityAuthorisationNumber
        destinationFacilityAddress
        destinationFacilityStreet
        destinationFacilityCity
        destinationFacilityCounty
        destinationFacilityEircode
        destinationFacilityCountry
        destinationFacilityLatitude
        destinationFacilityLongitude
        destinationFacilityId
      }
    }
  }
`;

const UploadWastePermitDocument = gql`
  mutation UploadWastePermitDocument($fleetId: String!, $documentData: Upload!) {
    uploadWastePermitDocument(fleetId: $fleetId, documentData: $documentData) {
      response {
        message
        status
      }
    }
  }
`;

const DeleteWastePermitDocument = gql`
  mutation DeleteWastePermitDocument($fleetId: String!, $wasteCollectionPermitDocumentId: String!) {
    deleteWastePermitDocument(
      fleetId: $fleetId
      wasteCollectionPermitDocumentId: $wasteCollectionPermitDocumentId
    ) {
      response {
        message
        status
      }
    }
  }
`;

const mutations = {
  AddFleet,
  UpdateFleet,
  DeleteFleet,
  InviteUserInFleet,
  InvitationAction,
  InvitationActionByEmail,
  LeaveFleet,
  RemoveUserInFleet,
  ChangeSelectedFleet,
  AddIndividualAccount,
  AddDocket,
  ForwardDocket,
  UploadWasteFacilityRepSignature,
  UploadDriverSignature,
  uploadPdfUrlChunk,
  DeleteDocketById,
  UpdateDocketById,
  UpdateDocketSignatures,
  DeleteFleetByAdmin,
  DeleteDocketByAdmin,
  DeleteCollectionsDataByAdmin,
  DeletePendingInvitation,
  AddCustomerInFleet,
  EditCustomerInFleet,
  DeleteCustomerInFleet,
  ImportCustomers,
  DeleteFacilityInFleet,
  AddFacilityInFleet,
  EditFacilityInFleet,
  UploadWastePermitDocument,
  DeleteWastePermitDocument,
};

export default mutations;
