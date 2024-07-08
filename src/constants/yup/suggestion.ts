import * as Yup from 'yup';

export const SUGGESTION_INITIAL_STATE = {
  suggestion: '',
};

export const SUGGESTION_VALIDATION = Yup.object().shape({
  suggestion: Yup.string().required(),
});
