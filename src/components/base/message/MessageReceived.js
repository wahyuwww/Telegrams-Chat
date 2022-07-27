import React from 'react';
import './style.css';

const MessageReceived = ({img,date,message}) => {
   return (
     <div>
       <div className="header-receiver  ">
         <div className="sub-receiver">
           <img
             src={img}
             alt=""
             className="img-receiver"
           />
         </div>
         <div className="msg-receiver">
           <p className="msg">{message}</p>
         </div>
       </div>
       <div className="date-receiver ">
         <p className="dater-msg">{date}</p>
       </div>
     </div>
   );
};

export default MessageReceived;