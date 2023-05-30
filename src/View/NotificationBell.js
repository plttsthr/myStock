import React, { useState } from "react";
import "../Style/LoginRegister.css";
import notification from '../Icons/notification.png';

const NotificationBell = () => {

   


    return(

        <div className="NotificationBell">
            <button id="ButtonBell"> <img src={notification} id="picture-home" alt="profpicture" ></img> </button>

            
            
        </div>
    )
}


export default NotificationBell;