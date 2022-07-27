import React from 'react';
import { TiDelete } from 'react-icons/ti';
import './style.css';

const MessageSender = ({ message, img, date, deletes }) => {
  return (
    <div className="header-sender ">
      <div className="sub-sender">
        <div className="contend-msg">
          <p className="deletead " onClick={deletes}>
            <TiDelete className="text-rose-500" size="20px" />
          </p>
          <p className="msg">{message}</p>
        </div>
        <div className="img-msg">
          <img
            src={img}
            alt=""
            className="images-msg "
          />
        </div>
      </div>
      <div className="date-msg ">
        <p className="dates-msg">{date}</p>
      </div>
    </div>
  );
};

export default MessageSender;