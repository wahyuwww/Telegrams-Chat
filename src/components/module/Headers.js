import React from 'react';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import './Header.css';


const Headers = ({ img, onClick, user }) => {
  return (
    <div className="header-header ">
      <div className="card-headers">
        <img src={img} alt="" className="img-header " />
        <div className="header-usersss">
          <h5 className="text-userh ">{user}</h5>
          <p className="online-header ">online</p>
        </div>
        <AiOutlineMenuUnfold
          className="menuheader "
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default Headers;
