/* eslint-disable no-undef */
import axios from 'axios';
import {
  GET_USER_FAILED,
  GET_USER_PENDING,
  GET_USER_SUCCESS,
  GET_DETAIL_USER_SUCCESS,
  GET_DETAIL_USER_PENDING,
  GET_DETAIL_USER_FAILED
} from './type';

export const getUser = (search) => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    dispatch({
      type: GET_USER_PENDING
    });
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users?search=${search}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch({
      type: GET_USER_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_USER_FAILED,
      payload: error.message
    });
  }
};

export const getDetailUser = () => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    const profile = JSON.parse(localStorage.getItem('user'));
    dispatch({
      type: GET_DETAIL_USER_PENDING
    });
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${profile.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch({
      type: GET_DETAIL_USER_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_DETAIL_USER_FAILED,
      payload: error.message
    });
  }
};

export const updateUser = data => {
  const token = localStorage.getItem('token');
  return new Promise((resolve, reject) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/users`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const updatePhoto = data => {
  const token = localStorage.getItem('token');
  return new Promise((resolve, reject) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/photo`, data, {
         headers: { Authorization: `Bearer ${token}`,'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};
