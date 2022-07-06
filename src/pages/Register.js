/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineGoogle } from 'react-icons/ai';
import { VscEyeClosed, VscEye } from 'react-icons/vsc';
import { register } from '../redux/actions/auth';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  const [visibel, setVisible] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: form.username,
      email: form.email,
      password: form.password
    };

    if (form.username && form.email && form.password) {
      if (!form.username.match(/^[a-zA-Z ']*$/i)) {
        swal.fire({ icon: 'error', title: 'Failed!', text: 'name only alphabet!' });
      } else if (
        !form.email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        swal.fire({ icon: 'error', title: 'Failed!', text: 'wrong email address!' });
      } else if (
        form.password.length < 7
      ) {
        swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'password must contain uppercase letters, special characters and at least 8 letters.!'
        });
      } else if (form) {
        register(body)
          .then(response => {
            swal.fire('Success!', `success anda berhasil register, ${form.username} silahkan login `, 'success');
            navigate('/');
          })
          .catch(error => {
            swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'email is ready!'
            });
          });
      }
    } else {
      swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'all inputs must be filled!'
      });
    }
  };

  const onNavigate = () => {
    navigate('/');
  };
  return (
    <div className="bg-theme-primary flex items-center justify-center h-screen">
      <div className="drop-shadow-lg w-100 p-10 rounded-3xl bg-primary">
        <div className="flex text-center">
          <IoIosArrowBack className="text-secondary text-xl ml-[-5px] cursor-pointer" onClick={() => onNavigate()} />
          <p className="text-secondary font-medium text-2xl text-center ml-24 mt-[-5px]">Register</p>
        </div>
        <p className="text-dark-color text-sm mt-6 mb-5">Let’s create your account!</p>
        <form
          onSubmit={e => {
            onSubmit(e);
          }}
        >
          <div className="relative flex flex-col mb-6">
            <label className="text-grey-color text-sm" htmlFor="username">
              Name
            </label>
            <input
              type="text"
              className="bg-primary border-b-[1px] border-solid border-dark-color pt-1 pb-1 focus:outline-none"
              id="username"
              placeholder="Enter your name"
              onChange={e => {
                setForm({ ...form, username: e.target.value });
              }}
            />
          </div>
          <div className="relative flex flex-col mb-6">
            <label className="text-grey-color text-sm" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="bg-primary border-b-[1px] border-solid border-dark-color pt-1 pb-1 focus:outline-none"
              id="email"
              placeholder="Enter your email"
              onChange={e => {
                setForm({ ...form, email: e.target.value });
              }}
            />
          </div>
          <div className="relative flex flex-col mb-6">
            <label className="text-grey-color text-sm" htmlFor="password">
              Password
            </label>
            <input
              type={visibel ? 'text' : 'password'}
              className="bg-primary border-b-[1px] border-solid border-dark-color pt-1 pb-1 focus:outline-none"
              id="password"
              placeholder="Enter your password"
              onChange={e => {
                setForm({ ...form, password: e.target.value });
              }}
            />
            {visibel ? (
              <VscEye
                className="absolute top-7 right-1.5 text-lg cursor-pointer"
                onClick={() => setVisible(false)}
              />
            ) : (
              <VscEyeClosed
                className="absolute top-7 right-1.5 text-lg cursor-pointer"
                onClick={() => setVisible(true)}
              />
            )}
          </div>

          <button className="p-3 bg-secondary rounded-full w-full font-medium text-primary mt-5" type="submit">
            Register
          </button>
        </form>
        <div className="flex justify-between mt-5 mb-5 text-grey-color">
          <hr className="w-24 text-center mt-3 text-grey-color" />
          <p>Register with</p>
          <hr className="w-24 text-center mt-3 text-grey-color" />
        </div>
        <button className="p-3 bg-primary border-solid border-color-secondary border-2 rounded-full w-full font-medium text-secondary mt-4 flex justify-center">
          <AiOutlineGoogle className="mr-2 mt-[1px] font-bold text-xl" />
          Google
        </button>
      </div>
    </div>
  );
};

export default Register;
