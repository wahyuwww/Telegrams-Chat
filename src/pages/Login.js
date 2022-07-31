/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';
import { VscEyeClosed, VscEye } from 'react-icons/vsc';
import { useNavigate,Link } from 'react-router-dom';
import { login } from '../redux/actions/auth';
import swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './auth.css';

const Login = () => {
 const navigate = useNavigate();
 const [visibel, setVisible] = useState(false);
 const [loading, setLoading] = useState(false);
 const [form, setForm] = useState({
   email: '',
   password: ''
 });
  
  const [getErorrName, setErorrName] = useState('');
 const onSubmit = e => {
   e.preventDefault();
   setLoading(true);
   if (!form.email || !form.password) {
     setErorrName('All field must be filled!');
    //  swal.fire('Error!', 'All field must be filled', 'error');
     setLoading(false);
   } else {
     login(form)
       .then(response => {
         swal.fire('Success!', `success anda berhasil login ${form.email}`, 'success');
         navigate('/chat');
       })
       .catch(err => {
         console.log(err);
         swal.fire('Failed!', 'password atau email salah', 'error');
       })
       .finally(() => {
         setLoading(false);
       });
   }
 };

 return (
   <div className="bg-theme-primary flex items-center justify-center h-screen">
     <div className="drop-shadow-lg w-120 p-10 rounded-3xl bg-primary">
       <p className="text-link font-medium text-2xl text-center">Login</p>
       <p className="text-dark-color text-sm mt-6 mb-5">Hi, Welcome back!</p>
       <form
         action=""
         onSubmit={(e) => {
           onSubmit(e);
         }}
       >
         <div className="relative flex flex-col mb-6">
           <label className="text-grey-color text-sm" htmlFor="email">
             Email
           </label>
           <input
             type="email"
             className="bg-primary border-b-[1px] border-solid border-dark-color pt-1 pb-1 focus:outline-none"
             id="email"
             placeholder="Enter your email"
             onChange={(e) => {
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
             className="bg-white border-b-[1px] border-solid border-dark-color pt-1 pb-1 focus:outline-none"
             id="password"
             placeholder="Enter your password"
             onChange={(e) => {
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
           {getErorrName ? (
             <p className="text-red-light text-[13px]">
               {getErorrName.toLowerCase()}
             </p>
           ) : null}
         </div>
         <p className="text-sm text-link flex justify-end cursor-pointer">
           Forgot password?
         </p>
         <button
           className="p-3 bg-button rounded-full w-full font-medium text-primary mt-5"
           type="submit"
         >
           {loading ? (
             <>
               <FontAwesomeIcon icon={faSpinner} spin />
               &nbsp;Loading
             </>
           ) : (
             'Login'
           )}
         </button>
       </form>
       <div className="flex justify-between mt-5 mb-5 text-grey-color">
         <hr className="w-24 text-center mt-3 text-grey-color" />
         <p>Login with</p>
         <hr className="w-24 text-center mt-3 text-grey-color" />
       </div>
       <button className="p-3 bg-primary border-solid border-color-secondary border-2 rounded-full w-full font-medium text-link mt-4 flex justify-center">
         <AiOutlineGoogle className="mr-2 mt-[1px] font-bold text-xl" />
         Google
       </button>
       <div className="flex mt-6 justify-center text-sm">
         <p>Don’t have an account?</p>
         <Link to="/register" className="ml-1 text-link cursor-pointer">
           Sign Up
         </Link>
       </div>
     </div>
   </div>
 );
};

export default Login;