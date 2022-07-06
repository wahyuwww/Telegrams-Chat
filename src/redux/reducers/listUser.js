import { GET_USER_FAILED, GET_USER_PENDING, GET_USER_SUCCESS } from '../actions/type';

const initialState = {
  isLoading: false,
  isError: false,
  data: []
};

const getListUser = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_PENDING:
      return { ...state, isLoading: true };
    case GET_USER_SUCCESS:
      return { ...state, isLoading: false, data: action.payload };
    case GET_USER_FAILED:
      return { ...state, isLoading: false, isError: true };
    default:
      return state;
  }
};

export default getListUser;
