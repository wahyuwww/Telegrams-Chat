import React from 'react';

const Group = () => {
  return (
    <div className="bg-secondary w-36 h-30 z-20 absolute rounded-3xl rounded-tr-xl ml-36  mr-10">
      <ul className="p-5">
        <li className="flex text-white text-center text-lg cursor-pointer">Javascript</li>
        <li className="flex text-white text-center text-lg cursor-pointer">Python</li>
        <li className="flex text-white text-center text-lg cursor-pointer">React</li>
        <li className="flex text-white text-center text-lg cursor-pointer">Flask</li>
      </ul>
    </div>
  );
};

export default Group;