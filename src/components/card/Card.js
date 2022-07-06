import React from 'react';

export default function Card({ onClick, img, username }) {
  return (
    <div className="flex p-3 cursor-pointer pr-2" onClick={onClick}>
      <img src={img} alt="user" className="w-14 h-14 rounded-xl ml-1" />
      <div className="p-2 ml-2">
        <p className="text-dark-color text-lg font-medium max-w-sm">{username}</p>
        <p className="text-secondary text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[169px] inline-block float-right mt-1">
          Lorem ipsum dolor sit as Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa amet atque cum et
          maxime! Est voluptas at distinctio, repudiandae quo rem magnam fugit in nulla aspernatur facilis quas soluta
          vitae.
        </p>
      </div>
      <div className="ml-1">
        <p className="text-grey-color text-sm mt-4">15:00</p>
        <p className="bg-secondary text-primary flex justify-center items-center w-5 h-5 text-center text-sm rounded-full p-1 mt-1">
          5
        </p>
      </div>
    </div>
  );
}
