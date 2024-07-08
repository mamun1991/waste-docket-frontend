import SignOut from '@/components/shared/Modals/Elements/signOut';

export const MODAL_TYPES = {
  SIGN_OUT: 'SIGN_OUT',
};

export const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.SIGN_OUT]: SignOut,
};
