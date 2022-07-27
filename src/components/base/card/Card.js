import React from 'react';
import './style.css';

const Card = ({img,onClick,username,message,date,count}) => {
  return (
    <div className="header-card" onClick={onClick}>
      <img src={img} alt="user" className="imgs-card" />
      <div className="card-usernames">
        <p className="usernames">{username}</p>
        <p className="message-reciver">
          {message}
        </p>
      </div>
      <div className="card-dates">
        <p className="dates">{date}</p>
        <p className="message-sendss ">
          {count}
        </p>
      </div>
    </div>
  );
};

export default Card;
