import { combineReducers } from 'redux';
import getListUser from './listUser';
import detailUser from './detailUser';

const rootReducers = combineReducers({
  user: getListUser,
  detail: detailUser
});

export default rootReducers;
