import React from 'react';
import { AiOutlineMenuUnfold } from 'react-icons/ai';

export default function Headers({ img, onClick, user }) {
  return (
    <div className="h-24 drop-shadow-sm bg-white p-4 fixed w-9/12 z-10">
      <div className="flex">
        <img src={img} alt="" className="w-16 h-16 rounded-xl ml-3 cursor-pointer object-cover" />
        <div className="ml-5 p-2">
          <h5 className="font-medium font-base text-dark-color">{user}</h5>
          <p className="text-secondary text-sm">online</p>
        </div>
        <AiOutlineMenuUnfold
          className=" cursor-pointer flex justify-end text-secondary mr-6 text-3xl right-4 absolute top-9"
          onClick={onClick}
        />
      </div>
    </div>
  );
}
