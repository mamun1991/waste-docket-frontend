import {gql} from '@apollo/client';

const GetFleets = gql`
  query GetFleets($fleetsInput: SearchInput) {
    getFleets(fleetsInput: $fleetsInput) {
      response {
        status
        message
      }
      totalCount
      selectedFleet
      fleetData {
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
        createdAt
        ownerEmail
        membersEmails
        allowedWaste {
          label
          value
        }
      }
      UserPendingInvitations {
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

const GetFleetById = gql`
  query GetFleetById($fleetId: String!, $pageNumber: Int, $resultsPerPage: Int) {
    getFleetById(fleetId: $fleetId, pageNumber: $pageNumber, resultsPerPage: $resultsPerPage) {
      response {
        status
        message
      }
      membersCount
      pendingFleetInvitationsCount
      fleetData {
        _id
        isIndividual
        name
        VAT
        permitNumber
        ownerEmail
        membersEmails
      }
      membersData {
        _id
        personalDetails {
          name
          email
        }
        accountType
        isSignUpComplete
      }
      pendingFleetInvitations {
        _id
        inviteeEmail
        fleetName
        status
        createdAt
      }
    }
  }
`;

const GetFleetMemebersByIdWithSorting = gql`
  query GetFleetMembersByIdWithSorting($fleetId: String!, $memberInputParams: MemberInputParams) {
    getFleetMembersByIdWithSorting(fleetId: $fleetId, memberInputParams: $memberInputParams) {
      response {
        status
        message
      }
      membersCount
      pendingFleetInvitationsCount
      fleetData {
        _id
        isIndividual
        name
        VAT
        permitNumber
        ownerEmail
        membersEmails
      }
      membersData {
        _id
        personalDetails {
          name
          email
        }
        accountType
        isSignUpComplete
      }
      pendingFleetInvitations {
        _id
        inviteeEmail
        fleetName
        status
        createdAt
      }
    }
  }
`;

const GetCustomerContactByFleetId = gql`
  query GetCustomerContactByFleetId($customersInput: SearchInput, $fleetId: String) {
    getCustomerContactByFleetId(customersInput: $customersInput, fleetId: $fleetId) {
      totalCount
      customersData {
        _id
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

const GetCustomerContactsByFleetIdWithSorting = gql`
  query GetCustomerContactsByFleetIdWithSorting(
    $customersInput: SearchInputWithSorting
    $fleetId: String
  ) {
    getCustomerContactsByFleetIdWithSorting(customersInput: $customersInput, fleetId: $fleetId) {
      totalCount
      customersData {
        _id
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

const GetDocketsByFleetId = gql`
  query GetDocketsByFleetId($fleetId: String!, $searchParams: GeneralSearchParams) {
    getDocketsByFleetId(fleetId: $fleetId, searchParams: $searchParams) {
      response {
        message
        status
      }
      docketData {
        _id
        fleet
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
            allowedWaste {
              label
              value
            }
            createdAt
          }
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
          createdAt
        }
        creatorEmail
        fleetOwnerEmail
        docketData {
          individualDocketNumber
          docketNumber
          jobId
          prefix
          gpsOn
          longitude
          latitude
          date
          time
          vehicleRegistration
          generalPickupDescription
          nonWasteLoadPictures
          isWaste
          wastes {
            wasteDescription
            wasteLoWCode
            isHazardous
            localAuthorityOfOrigin
            wasteQuantity {
              unit
              amount
            }
            wasteLoadPicture
          }
          collectedFromWasteFacility
          collectionPointName
          collectionPointAddress
          collectionPointStreet
          collectionPointCity
          collectionPointCounty
          collectionPointEircode
          collectionPointCountry
          driverSignature
          wasteFacilityRepSignature
          customerSignature
          isCustomerSignatureId
          isLoadForExport
          portOfExport
          countryOfDestination
          facilityAtDestination
          tfsReferenceNumber
          additionalInformation
        }
        customerContact {
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
            createdAt
          }
          contactProvider {
            _id
            accountType
            isSignUpComplete
            createdAt
          }
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
          customerId
          customerEmail
          isAutomatedGenerated
        }
        destinationFacility {
          _id
          destinationFacilityData {
            _id
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
      fleet {
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
        createdAt
        ownerEmail
        membersEmails
      }
      totalCount
    }
  }
`;

const GetDocketsByFleetIdWithSorting = gql`
  query GetDocketsByFleetIdWithSorting(
    $fleetId: String!
    $searchParams: GeneralSearchParamsWithSorting
  ) {
    getDocketsByFleetIdWithSorting(fleetId: $fleetId, searchParams: $searchParams) {
      response {
        message
        status
      }
      docketData {
        _id
        fleet
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
            allowedWaste {
              label
              value
            }
            createdAt
          }
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
          createdAt
        }
        creatorEmail
        fleetOwnerEmail
        docketData {
          individualDocketNumber
          docketNumber
          jobId
          prefix
          gpsOn
          longitude
          latitude
          date
          time
          vehicleRegistration
          generalPickupDescription
          nonWasteLoadPictures
          isWaste
          wastes {
            wasteDescription
            wasteLoWCode
            isHazardous
            localAuthorityOfOrigin
            wasteQuantity {
              unit
              amount
            }
            wasteLoadPicture
          }
          collectedFromWasteFacility
          collectionPointName
          collectionPointAddress
          collectionPointStreet
          collectionPointCity
          collectionPointCounty
          collectionPointEircode
          collectionPointCountry
          driverSignature
          wasteFacilityRepSignature
          customerSignature
          isCustomerSignatureId
          isLoadForExport
          portOfExport
          countryOfDestination
          facilityAtDestination
          tfsReferenceNumber
          additionalInformation
        }
        customerContact {
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
            createdAt
          }
          contactProvider {
            _id
            accountType
            isSignUpComplete
            createdAt
          }
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
          customerId
          customerEmail
          isAutomatedGenerated
        }
        destinationFacility {
          _id
          destinationFacilityData {
            _id
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
        createdAt
      }
      fleet {
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
        createdAt
        ownerEmail
        membersEmails
      }
      totalCount
    }
  }
`;

const getAllDocketsByFleetId = gql`
  query GetAllDocketsByFleetId($fleetId: String!, $searchParams: GeneralSearchParams) {
    getAllDocketsByFleetId(fleetId: $fleetId, searchParams: $searchParams) {
      response {
        message
        status
      }
      docketData {
        _id
        fleet
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
            allowedWaste {
              label
              value
            }
            createdAt
          }
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
          createdAt
        }
        creatorEmail
        fleetOwnerEmail
        docketData {
          individualDocketNumber
          docketNumber
          jobId
          prefix
          gpsOn
          longitude
          latitude
          date
          time
          vehicleRegistration
          generalPickupDescription
          nonWasteLoadPictures
          isWaste
          wastes {
            wasteDescription
            wasteLoWCode
            isHazardous
            localAuthorityOfOrigin
            wasteQuantity {
              unit
              amount
            }
            wasteLoadPicture
          }
          collectedFromWasteFacility
          collectionPointName
          collectionPointAddress
          collectionPointStreet
          collectionPointCity
          collectionPointCounty
          collectionPointEircode
          collectionPointCountry
          driverSignature
          wasteFacilityRepSignature
          customerSignature
          isCustomerSignatureId
          isLoadForExport
          portOfExport
          countryOfDestination
          facilityAtDestination
          tfsReferenceNumber
          additionalInformation
        }
        customerContact {
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
            createdAt
          }
          contactProvider {
            _id
            accountType
            isSignUpComplete
            createdAt
          }
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
          customerId
          customerEmail
          isAutomatedGenerated
        }
        destinationFacility {
          _id
          destinationFacilityData {
            _id
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
      fleet {
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
        createdAt
        ownerEmail
        membersEmails
      }
      totalCount
    }
  }
`;

const getAllDocketsByFleetIdWithPagination = gql`
  query GetAllDocketsByFleetIdWithSorting(
    $fleetId: String!
    $searchParams: GeneralSearchParamsWithSorting
  ) {
    getAllDocketsByFleetIdWithSorting(fleetId: $fleetId, searchParams: $searchParams) {
      response {
        message
        status
      }
      docketData {
        _id
        fleet
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
            allowedWaste {
              label
              value
            }
            createdAt
          }
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
          createdAt
        }
        creatorEmail
        fleetOwnerEmail
        docketData {
          individualDocketNumber
          docketNumber
          jobId
          prefix
          gpsOn
          longitude
          latitude
          date
          time
          vehicleRegistration
          generalPickupDescription
          nonWasteLoadPictures
          isWaste
          wastes {
            wasteDescription
            wasteLoWCode
            isHazardous
            localAuthorityOfOrigin
            wasteQuantity {
              unit
              amount
            }
            wasteLoadPicture
          }
          collectedFromWasteFacility
          collectionPointName
          collectionPointAddress
          collectionPointStreet
          collectionPointCity
          collectionPointCounty
          collectionPointEircode
          collectionPointCountry
          driverSignature
          wasteFacilityRepSignature
          customerSignature
          isCustomerSignatureId
          isLoadForExport
          portOfExport
          countryOfDestination
          facilityAtDestination
          tfsReferenceNumber
          additionalInformation
        }
        customerContact {
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
            createdAt
          }
          contactProvider {
            _id
            accountType
            isSignUpComplete
            createdAt
          }
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
          customerId
          customerEmail
          isAutomatedGenerated
        }
        destinationFacility {
          _id
          destinationFacilityData {
            _id
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
        createdAt
      }
      fleet {
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
        createdAt
        ownerEmail
        membersEmails
      }
      totalCount
    }
  }
`;

const GetAllFleetsForAdmin = gql`
  query GetAllFleetsForAdmin($fleetsInput: SearchInput) {
    getAllFleetsForAdmin(fleetsInput: $fleetsInput) {
      totalCount
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
        createdAt
      }
    }
  }
`;

const GetAllBusinessesForAdminWithSorting = gql`
  query GetAllBusinessesForAdminWithSorting($fleetsInput: SearchInputWithSorting) {
    getAllBusinessesForAdminWithSorting(fleetsInput: $fleetsInput) {
      totalCount
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
        createdAt
      }
    }
  }
`;

const GetAllDocketsByAdmin = gql`
  query GetAllDocketsForAdmin($searchParams: GeneralSearchParams) {
    getAllDocketsForAdmin(searchParams: $searchParams) {
      response {
        message
        status
      }
      docketData {
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
        creatorEmail
        fleetOwnerEmail
        docketData {
          individualDocketNumber
          docketNumber
          jobId
          prefix
          gpsOn
          longitude
          latitude
          date
          time
          vehicleRegistration
          generalPickupDescription
          nonWasteLoadPictures
          isWaste
          wastes {
            wasteDescription
            wasteLoWCode
            isHazardous
            localAuthorityOfOrigin
            wasteQuantity {
              unit
              amount
            }
            wasteLoadPicture
          }
          collectedFromWasteFacility
          collectionPointName
          collectionPointAddress
          collectionPointStreet
          collectionPointCity
          collectionPointCounty
          collectionPointEircode
          collectionPointCountry
          driverSignature
          wasteFacilityRepSignature
          customerSignature
          isCustomerSignatureId
          isLoadForExport
          portOfExport
          countryOfDestination
          facilityAtDestination
          tfsReferenceNumber
          additionalInformation
        }
        customerContact {
          _id
          contactProvider {
            _id
            accountType
            isSignUpComplete
            createdAt
          }
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
          customerId
          customerEmail
          isAutomatedGenerated
        }
        destinationFacility {
          _id
          destinationFacilityData {
            _id
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
      totalCount
    }
  }
`;

const GetAllDocketsForAdminWithSorting = gql`
  query GetAllDocketsForAdminWithSorting($searchParams: GeneralSearchParamsWithSorting) {
    getAllDocketsForAdminWithSorting(searchParams: $searchParams) {
      response {
        message
        status
      }
      docketData {
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
        creatorEmail
        fleetOwnerEmail
        docketData {
          individualDocketNumber
          docketNumber
          jobId
          prefix
          gpsOn
          longitude
          latitude
          date
          time
          vehicleRegistration
          generalPickupDescription
          nonWasteLoadPictures
          isWaste
          wastes {
            wasteDescription
            wasteLoWCode
            isHazardous
            localAuthorityOfOrigin
            wasteQuantity {
              unit
              amount
            }
            wasteLoadPicture
          }
          collectedFromWasteFacility
          collectionPointName
          collectionPointAddress
          collectionPointStreet
          collectionPointCity
          collectionPointCounty
          collectionPointEircode
          collectionPointCountry
          driverSignature
          wasteFacilityRepSignature
          customerSignature
          isCustomerSignatureId
          isLoadForExport
          portOfExport
          countryOfDestination
          facilityAtDestination
          tfsReferenceNumber
          additionalInformation
        }
        customerContact {
          _id
          contactProvider {
            _id
            accountType
            isSignUpComplete
            createdAt
          }
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
          customerId
          customerEmail
          isAutomatedGenerated
        }
        destinationFacility {
          _id
          destinationFacilityData {
            _id
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
      totalCount
    }
  }
`;

const GetMultipleCollectionsTotalCountsForAdmin = gql`
  query GetMultipleCollectionsTotalCountsForAdmin {
    getMultipleCollectionsTotalCountsForAdmin {
      customersCount
      destinationFacilitiesCount
      wastePermitDocumentsCount
      invitesCount
      subscriptions
      response {
        status
        message
      }
    }
  }
`;

const GetTermsAndConditionsByFleetId = gql`
  query GetTermsAndConditionsByFleetId($fleetId: String!) {
    getTermsAndConditionsByFleetId(fleetId: $fleetId) {
      fleet {
        name
        termsAndConditions
      }
      response {
        message
        status
      }
    }
  }
`;

const GetEnvironmentalReport = gql`
  query GetEnvironmentalReport($fleetId: String!, $searchParams: GeneralSearchParams) {
    getEnvironmentalReport(fleetId: $fleetId, searchParams: $searchParams) {
      response {
        status
        message
      }
      tab1Data {
        wasteLoWCode
        localAuthorityOfOrigin
        quantity
        goingToFacility
      }
      tab2Data {
        wasteLoWCode
        localAuthorityOfOrigin
        quantity
        goingToFacility
        collectedFromFacility
      }
      tab3Data {
        wasteLoWCode
        localAuthorityOfOrigin
        quantity
        goingToFacility
      }
    }
  }
`;

const getDocketById = gql`
  query GetDocketById($docketId: String!) {
    getDocketById(docketId: $docketId) {
      response {
        message
        status
      }
      docketData {
        _id
        fleet
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
            allowedWaste {
              label
              value
            }
            createdAt
          }
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
          createdAt
        }
        creatorEmail
        fleetOwnerEmail
        docketData {
          individualDocketNumber
          docketNumber
          jobId
          prefix
          gpsOn
          longitude
          latitude
          date
          time
          vehicleRegistration
          generalPickupDescription
          nonWasteLoadPictures
          isWaste
          wastes {
            wasteDescription
            wasteLoWCode
            isHazardous
            localAuthorityOfOrigin
            wasteQuantity {
              unit
              amount
            }
            wasteLoadPicture
          }
          collectedFromWasteFacility
          collectionPointName
          collectionPointAddress
          collectionPointStreet
          collectionPointCity
          collectionPointCounty
          collectionPointEircode
          collectionPointCountry
          driverSignature
          wasteFacilityRepSignature
          customerSignature
          isCustomerSignatureId
          isLoadForExport
          portOfExport
          countryOfDestination
          facilityAtDestination
          tfsReferenceNumber
          additionalInformation
        }
        customerContact {
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
            createdAt
          }
          contactProvider {
            _id
            accountType
            isSignUpComplete
            createdAt
          }
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
          customerId
          customerEmail
          isAutomatedGenerated
        }
        destinationFacility {
          _id
          destinationFacilityData {
            _id
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
    }
  }
`;

const getLastDocketForUser = gql`
  query GetLastDocketForUser {
    getLastDocketForUser {
      response {
        message
        status
      }
      docketData {
        _id
        fleet
        creatorEmail
        fleetOwnerEmail
        docketData {
          individualDocketNumber
          docketNumber
          jobId
          prefix
          gpsOn
          longitude
          latitude
          date
          time
          vehicleRegistration
          generalPickupDescription
          nonWasteLoadPictures
          isWaste
          wastes {
            wasteDescription
            wasteLoWCode
            isHazardous
            localAuthorityOfOrigin
            wasteQuantity {
              unit
              amount
            }
            wasteLoadPicture
          }
          collectedFromWasteFacility
          collectionPointName
          collectionPointAddress
          collectionPointStreet
          collectionPointCity
          collectionPointCounty
          collectionPointEircode
          collectionPointCountry
          driverSignature
          wasteFacilityRepSignature
          customerSignature
          isCustomerSignatureId
          isLoadForExport
          portOfExport
          countryOfDestination
          facilityAtDestination
          tfsReferenceNumber
          additionalInformation
        }
        customerContact {
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
            createdAt
          }
          contactProvider {
            _id
            accountType
            isSignUpComplete
            createdAt
          }
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
          customerId
          customerEmail
          isAutomatedGenerated
        }
        destinationFacility {
          _id
          destinationFacilityData {
            _id
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
    }
  }
`;

const GetDestinationFacility = gql`
  query GetDestinationFacility($fleetId: String!, $facilityInput: SearchInput) {
    getDestinationFacility(fleetId: $fleetId, facilityInput: $facilityInput) {
      response {
        message
        status
      }
      totalCount
      destinationFacilityData {
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

const GetDestinationFacilityWithSorting = gql`
  query GetDestinationFacilityWithSorting(
    $fleetId: String!
    $facilityInput: SearchInputWithSorting
  ) {
    getDestinationFacilityWithSorting(fleetId: $fleetId, facilityInput: $facilityInput) {
      response {
        message
        status
      }
      totalCount
      destinationFacilityData {
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

const GetWasteCollectionPermitDocumentWithSorting = gql`
  query GetWasteCollectionPermitDocumentWithSorting(
    $wastePermitDocumentWithSortingInput: SearchInputWithSorting
  ) {
    getWasteCollectionPermitDocumentWithSorting(
      wastePermitDocumentWithSortingInput: $wastePermitDocumentWithSortingInput
    ) {
      response {
        message
        status
      }
      totalCount
      wasteCollectionPermitDocument {
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
        documentName
        createdAt
      }
      fleet {
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
        createdAt
        ownerEmail
        membersEmails
      }
    }
  }
`;

const GetWasteCollectionPermitDocument = gql`
  query GetWasteCollectionPermitDocument(
    $fleetId: String!
    $wastePermitDocumentInput: SearchInput
  ) {
    getWasteCollectionPermitDocument(
      fleetId: $fleetId
      wastePermitDocumentInput: $wastePermitDocumentInput
    ) {
      response {
        message
        status
      }
      totalCount
      wasteCollectionPermitDocument {
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
        documentName
        createdAt
      }
      fleet {
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
        createdAt
        ownerEmail
        membersEmails
      }
    }
  }
`;

const GetDocumentDownloadUrl = gql`
  query GetDocumentDownloadUrl($fleetId: String!, $wastePermitDocumentId: String!) {
    getDocumentDownloadUrl(fleetId: $fleetId, wastePermitDocumentId: $wastePermitDocumentId) {
      documentUrl
      response {
        message
        status
      }
    }
  }
`;

const queries = {
  GetFleets,
  GetFleetById,
  GetFleetMemebersByIdWithSorting,
  GetCustomerContactByFleetId,
  GetCustomerContactsByFleetIdWithSorting,
  GetDocketsByFleetId,
  GetDocketsByFleetIdWithSorting,
  getAllDocketsByFleetId,
  getAllDocketsByFleetIdWithPagination,
  GetAllFleetsForAdmin,
  GetAllBusinessesForAdminWithSorting,
  GetAllDocketsByAdmin,
  GetAllDocketsForAdminWithSorting,
  GetMultipleCollectionsTotalCountsForAdmin,
  GetTermsAndConditionsByFleetId,
  GetEnvironmentalReport,
  getDocketById,
  getLastDocketForUser,
  GetDestinationFacility,
  GetDestinationFacilityWithSorting,
  GetWasteCollectionPermitDocument,
  GetWasteCollectionPermitDocumentWithSorting,
  GetDocumentDownloadUrl,
};

export default queries;
