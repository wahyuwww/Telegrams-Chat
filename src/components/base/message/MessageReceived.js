import React from 'react';

const MessageReceived = ({img,date,message}) => {
   return (
     <div>
       <div className="flex relative p-3 w-9/12 ">
         <div className="relative w-20 flex-col">
           <img
             src={img}
             alt=""
             className="w-16 h-16 rounded-xl ml-3 cursor-pointer object-cover absolute bottom-0 left-0"
           />
         </div>
         <div className="bg-secondary max-w-sm p-5 rounded-[35px] rounded-bl-xl ml-3 relative">
           <p className="text-white">{message}</p>
         </div>
       </div>
       <div className="flex  justify-start ml-10 mb-3 flex-col">
         <p className="text-grey-color">{date}</p>
       </div>
     </div>
   );
};

export default MessageReceived;