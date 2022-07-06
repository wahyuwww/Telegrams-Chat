import React from 'react';
import { TiDelete } from 'react-icons/ti';

const MessageSender = ({ message, img, date, deletes }) => {
  return (
    <div className="p-3 w-full relative">
      <div className="flex justify-end">
        <div className="bg-white max-w-sm p-5 rounded-[35px] rounded-br-xl ml-3 relative">
          <p className="absolute top-0 left-0 cursor-pointer hover:text-trans" onClick={deletes}>
            <TiDelete className="text-rose-500" size="20px" />
          </p>
          <p className="text-dark-color">{message}</p>
        </div>
        <div className="relative w-20">
          <img
            src={img}
            alt=""
            className="w-16 h-16 rounded-xl ml-3 cursor-pointer absolute bottom-0 object-cover left-0"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <p className="text-grey-color mt-3">{date}</p>
      </div>
    </div>
  );
};

export default MessageSender;