import SignOut from '@/components/shared/Modals/Elements/signOut';
import Confirm from '@/components/shared/Modals/Elements/Confirm';
import AddEditFleet from '@/components/shared/Modals/Elements/addEditFleet';
import deleteFleet from '@/components/shared/Modals/Elements/deleteFleet';
import inviteUserInFleet from '@/components/shared/Modals/Elements/inviteUserInFleet';
import leaveFleet from '@/components/shared/Modals/Elements/leaveFleet';
import addEditDocketData from '@/components/shared/Modals/Elements/addEditDocketData';
import UserPendingInvitations from '@/components/shared/Modals/Elements/UserPendingInvitations';
import addIndividualAccount from '@/components/shared/Modals/Elements/addIndividualAccount';
import deleteDocket from '@/components/shared/Modals/Elements/deleteDocket';
import deleteMemberInFleet from '@/components/shared/Modals/Elements/deleteMemberInFleet';
import docketDetails from '@/components/shared/Modals/Elements/docketDetails';
import helpModal from '@/components/shared/Modals/Elements/helpModal';
import deleteFleetAdmin from '@/components/shared/Modals/Elements/deleteFleetAdmin';
import deleteDocketAdmin from '@/components/shared/Modals/Elements/deleteDocketAdmin';
import deleteUserByAdmin from '@/components/shared/Modals/Elements/deleteUserByAdmin';
import deleteMyAccount from '@/components/shared/Modals/Elements/deleteMyAccount';
import fleetDetails from '@/components/shared/Modals/Elements/fleetDetails';
import addEditCustomer from '@/components/shared/Modals/Elements/addEditCustomer';
import deleteCustomerInFleet from '@/components/shared/Modals/Elements/deleteCustomerInFleet';
import importCustomers from '@/components/shared/Modals/Elements/importCustomers';
import deletePendingInviteModal from '@/components/shared/Modals/Elements/deletePendingInvite';
import CreateSubscription from '@/components/shared/Modals/Elements/createSubscription';
import CancelConfirmation from '@/components/shared/Modals/Elements/cancelConfirmation';
import Subscribe from '@/components/shared/Modals/Elements/Subscribe';
import AddEditFacility from '@/components/shared/Modals/Elements/addEditFacility';
import deleteFacility from '@/components/shared/Modals/Elements/deleteFacility';
import AddWastePermitDocuments from '@/components/shared/Modals/Elements/addWastePermitDocuments';
import DeleteWastePermitDocuments from '@/components/shared/Modals/Elements/deleteWasatePermitDocuments';
import PdfViewOpen from '@/components/shared/Modals/Elements/pdfViewOpen';
import ExportDockets from '@/components/shared/Modals/Elements/exportDockets';
import ExportAnnualEnvironmentalReport from '@/components/shared/Modals/Elements/exportAnnualEnvironmentalReport';
import ForwardDocket from '@/components/shared/Modals/Elements/forwardDocket';
import DeleteCollectionDataByAdminModal from '@/components/shared/Modals/Elements/deleteCollectionDataByAdmin';
import SignupAsBusinessOrDriverConfirmationModal from '@/components/shared/Modals/Elements/signupAsBusinessOrDriverConfirmationModal';
import DeleteCustomerConfirm from '@/components/shared/Modals/Elements/deleteCustomerConfirm';
import AddDocketSignature from '@/components/shared/Modals/Elements/addDocketSignature';
import AddSuggestion from '@/components/shared/Modals/Elements/addSuggestion';
import DeleteSuggestionModal from '@/components/shared/Modals/Elements/deleteSuggestion';
import SuggestionDetails from '@/components/shared/Modals/Elements/suggestionDetails';

export const MODAL_TYPES = {
  SIGN_OUT: 'SIGN_OUT',
  CONFIRM: 'CONFIRM',
  DELETE_CUSTOMER_CONFIRM: 'DeleteCustomerConfirm',
  ADD_EDIT_FLEET: 'ADD_EDIT_FLEET',
  DELETE_FLEET: 'DELETE_FLEET',
  INVITE_USER_IN_FLEET: 'INVITE_USER_IN_FLEET',
  LEAVE_FLEET: 'LEAVE_FLEET',
  ADD_DOCKET_DATA: 'ADD_DOCKET_DATA',
  ADD_DOCKET_SIGNATURE: 'ADD_DOCKET_SIGNATURE',
  EXPORT_DOCKET_DATA: 'EXPORT_DOCKET_DATA',
  FORWARD_DOCKET: 'FORWARD_DOCKET',
  EXPORT_ANNUAL_ENVIRONMENTAL_DATA: 'EXPORT_ANNUAL_ENVIRONMENTAL_DATA',
  USER_PENDING_INVITATIONS: 'USER_PENDING_INVITATIONS',
  ADD_INDIVIDIAL_ACCOUNT: 'ADD_INDIVIDIAL_ACCOUNT',
  DELETE_DOCKET: 'DELETE_DOCKET',
  DELETE_MEMBER_IN_FLEET: 'DELETE_MEMBER_IN_FLEET',
  DOCKET_DETIALS: 'DOCKET_DETIALS',
  HELP_MODAL: 'HELP_MODAL',
  DELETE_FLEET_ADMIN: 'DELETE_FLEET_ADMIN',
  DELETE_DOCKET_ADMIN: 'DELETE_DOCKET_ADMIN',
  DELETE_USER_ADMIN: 'DELETE_USER_ADMIN',
  DELETE_COLLECTION_DATA_BY_ADMIN: 'DELETE_COLLECTIONDATA_BY_ADMIN',
  DELETE_MY_ACCOUNT: 'DELETE_MY_ACCOUNT',
  DELETE_PENDING_INVITE: 'DELETE_PENDING_INVITE',
  FLEET_DETAILS: 'FLEET_DETAILS',
  ADD_EDIT_CUSTOMER: 'ADD_EDIT_CUSTOMER',
  DELETE_CUSTOMER_IN_FLEET: 'DELETE_CUSTOMER_IN_FLEET',
  IMPORT_CUSTOMERS: 'IMPORT_CUSTOMERS',
  CREATE_SUBSCRIPTION: 'CREATE_SUBSCRIPTION',
  CANCEL_SUBSCRIPTION_CONFIRM: 'CANCEL_SUBSCRIPTION_CONFIRM',
  SUBSCRIBE: 'SUBSCRIBE',
  ADD_EDIT_FACILITY: 'ADD_EDIT_FACILITY',
  DELETE_FACILITY: 'DELETE_FACILITY',
  ADD_DOCUMENTS: 'ADD_DOCUMENTS',
  DELETE_DOCUMENTS: 'DELETE_DOCUMENTS',
  VIEW_PDF: 'VIEW_PDF',
  SIGNUP_AS_BUSINESS_OR_DRIVER_CONFIRMATION_MODAL:
    'SIGNUP_AS_BUSINESS_OR_DRIVER_CONFIRMATION_MODAL',
  ADD_SUGGESTION: 'ADD_SUGGESTION',
  DELETE_SUGGESTION: 'DELETE_SUGGESTION',
  SUGGESTION_DETAILS: 'SUGGESTION_DETAILS',
};

export const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.SIGN_OUT]: SignOut,
  [MODAL_TYPES.CONFIRM]: Confirm,
  [MODAL_TYPES.DELETE_CUSTOMER_CONFIRM]: DeleteCustomerConfirm,
  [MODAL_TYPES.ADD_EDIT_FLEET]: AddEditFleet,
  [MODAL_TYPES.DELETE_FLEET]: deleteFleet,
  [MODAL_TYPES.INVITE_USER_IN_FLEET]: inviteUserInFleet,
  [MODAL_TYPES.LEAVE_FLEET]: leaveFleet,
  [MODAL_TYPES.ADD_DOCKET_DATA]: addEditDocketData,
  [MODAL_TYPES.ADD_DOCKET_SIGNATURE]: AddDocketSignature,
  [MODAL_TYPES.EXPORT_DOCKET_DATA]: ExportDockets,
  [MODAL_TYPES.FORWARD_DOCKET]: ForwardDocket,
  [MODAL_TYPES.EXPORT_ANNUAL_ENVIRONMENTAL_DATA]: ExportAnnualEnvironmentalReport,
  [MODAL_TYPES.USER_PENDING_INVITATIONS]: UserPendingInvitations,
  [MODAL_TYPES.ADD_INDIVIDIAL_ACCOUNT]: addIndividualAccount,
  [MODAL_TYPES.DELETE_DOCKET]: deleteDocket,
  [MODAL_TYPES.DELETE_MEMBER_IN_FLEET]: deleteMemberInFleet,
  [MODAL_TYPES.DOCKET_DETIALS]: docketDetails,
  [MODAL_TYPES.HELP_MODAL]: helpModal,
  [MODAL_TYPES.DELETE_FLEET_ADMIN]: deleteFleetAdmin,
  [MODAL_TYPES.DELETE_DOCKET_ADMIN]: deleteDocketAdmin,
  [MODAL_TYPES.DELETE_USER_ADMIN]: deleteUserByAdmin,
  [MODAL_TYPES.DELETE_COLLECTION_DATA_BY_ADMIN]: DeleteCollectionDataByAdminModal,
  [MODAL_TYPES.DELETE_MY_ACCOUNT]: deleteMyAccount,
  [MODAL_TYPES.DELETE_PENDING_INVITE]: deletePendingInviteModal,
  [MODAL_TYPES.FLEET_DETAILS]: fleetDetails,
  [MODAL_TYPES.ADD_EDIT_CUSTOMER]: addEditCustomer,
  [MODAL_TYPES.DELETE_CUSTOMER_IN_FLEET]: deleteCustomerInFleet,
  [MODAL_TYPES.IMPORT_CUSTOMERS]: importCustomers,
  [MODAL_TYPES.CREATE_SUBSCRIPTION]: CreateSubscription,
  [MODAL_TYPES.CANCEL_SUBSCRIPTION_CONFIRM]: CancelConfirmation,
  [MODAL_TYPES.SUBSCRIBE]: Subscribe,
  [MODAL_TYPES.ADD_EDIT_FACILITY]: AddEditFacility,
  [MODAL_TYPES.DELETE_FACILITY]: deleteFacility,
  [MODAL_TYPES.ADD_DOCUMENTS]: AddWastePermitDocuments,
  [MODAL_TYPES.DELETE_DOCUMENTS]: DeleteWastePermitDocuments,
  [MODAL_TYPES.VIEW_PDF]: PdfViewOpen,
  [MODAL_TYPES.SIGNUP_AS_BUSINESS_OR_DRIVER_CONFIRMATION_MODAL]:
    SignupAsBusinessOrDriverConfirmationModal,
  [MODAL_TYPES.ADD_SUGGESTION]: AddSuggestion,
  [MODAL_TYPES.DELETE_SUGGESTION]: DeleteSuggestionModal,
  [MODAL_TYPES.SUGGESTION_DETAILS]: SuggestionDetails,
};
