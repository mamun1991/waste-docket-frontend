// import ACTIONS from 'constants/context/userActions';
import {AnyAction} from 'types';
import {UserState} from 'types/state';

const userReducer = (state: UserState, {type}: AnyAction) => {
  switch (type) {
    default:
      return state;
  }
};

export default userReducer;
