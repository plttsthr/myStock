import React, { useState, useEffect } from "react";
import { InputMask } from 'primereact/inputmask';
import logo from '../Icons/logo.png';
import upload from '../Icons/upload.png';
import erroricon from '../Icons/error.png';
import profilepicture from '../Icons/profilepicture.png';
import plus from '../Icons/plus.png';
import { useForm } from "react-hook-form";
import {auth, storage, db} from "../Model/firebase"; 
import { ref, uploadBytes } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import "../Style/LoginRegister.css";
import swal from 'sweetalert';
import FillOutYourInformation from "./FillOutYourInformation";
import PhoneVerify from "./PhoneVerify"
import EmailVerify from "./EmailVerify"

const SignUp = ({controller}) => {
  // Variables shared by all sections of the signup component
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");

  // callbacks to communicate children with parent
  const setEVerif = () => { setEmailVerified(true); }; 
  const setPVerif = () => { setPhoneVerified(true); };
  const setPNumber = (pn) => { setPhoneNumber(pn); };
  const setCoCode = (cc) => { setCountryCode(cc); };

  return ( 

    <div className="form-container  sign-up-container">
      { emailVerified ? 
        ( 
          phoneVerified ? 
          <FillOutYourInformation controller={controller} phoneNumber={phoneNumber} countryCode={countryCode}></FillOutYourInformation>
          : 
          <PhoneVerify controller={controller} setPVerif={setPVerif} setPNumber={setPNumber} setCoCode={setCoCode} ></PhoneVerify>  
        ) 
        : <EmailVerify controller={controller} setEVerif={setEVerif} ></EmailVerify>
      }         
    </div>
  )
}
export default SignUp;