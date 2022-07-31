import React from 'react';
import { AiOutlineUser,  AiOutlineLogout } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Menu = ({ onProfile }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="bg-menu w-36 h-30 z-20 absolute rounded-3xl rounded-tr-xl ml-36">
      <ul className="p-5">
        <li className="flex text-white text-center text-lg cursor-pointer" onClick={onProfile}>
          <AiOutlineUser className="mt-1 mr-2 text-lg" />
          Profile
        </li>
        <li
          className="flex text-white text-center text-lg mt-2 cursor-pointer"
          onClick={() => {
            logout();
          }}
        >
          <AiOutlineLogout className="mt-1 mr-2 text-lg" />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Menu;