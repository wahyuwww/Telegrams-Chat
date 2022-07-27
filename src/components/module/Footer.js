import React from 'react';
// import { FiPlus } from 'react-icons/fi';
// import { BsFillEmojiLaughingFill, BsFillRecordCircleFill } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import './Footer.css';

const Footer = ({ onSubmit, onChange, value }) => {
  return (
    <div className="header-footer h-20 drop-shadow-lg bg-white p-4 fixed bottom-0 w-9/12">
      <div className="sub-footer flex p-2">
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Type your message..."
            className="input-footer"
            onChange={onChange}
            value={value}
          />
          <button className='btn-send'>
            <FiSend className='send' />
          </button>
          {/* <div className=" icon-footer ">
            <FiPlus className="plus" />
              <BsFillEmojiLaughingFill className="text-secondary text-xl cursor-pointer" />
            <BsFillRecordCircleFill className="text-secondary text-xl cursor-pointer" />
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Footer;
