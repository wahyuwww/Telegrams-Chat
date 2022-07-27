/* eslint-disable no-undef */
import axios from 'axios';
import swal from 'sweetalert2';


export const register = data => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/register`, data, {})
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        //  swal.fire({
        //    icon: 'error',
        //    title: 'Oops...',
        //    text: 'data yang anda input kan masih salah'
        //  });
        reject(error);
      });
  });
};

export const login = data => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/login`, data, {})
      .then(response => {
        resolve(response);
        console.log(response.data.data.token);
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      })
      .catch(error => {
       swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: 'password and email wrong!',
       });
        reject(error);
      });
  });
};
