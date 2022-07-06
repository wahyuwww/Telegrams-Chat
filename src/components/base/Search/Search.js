import React from 'react';
import { IoSearch } from 'react-icons/io5';

export default function Search({onChange}) {
  return (
    <div className="flex p-1 w-full">
      <IoSearch className="absolute text-grey-color text-lg mt-3 ml-2 font-bold" htmlFor="search" />
      <input
        type="text"
        className="pl-9 p-2 pr-5 font-base rounded-xl focus:outline-none bg-primary"
        id="search"
        placeholder="Type username..."
        onChange={onChange}
      />
    </div>
  );
}
