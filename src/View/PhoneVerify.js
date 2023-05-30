import React, { useState } from "react";
import { InputMask } from 'primereact/inputmask';
import { InputText} from 'primereact/inputtext';
import "../Style/LoginRegister.css";
import {RecaptchaVerifier, signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider} from 'firebase/auth';
import {auth} from "../Model/firebase";
import {onSignInSubmit} from "firebase/auth";
import {motion} from "framer-motion/dist/framer-motion";
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';
import axios from 'axios';
import swal from 'sweetalert';

const PhoneVerify = ({controller, setPVerif, setPNumber, setCoCode}) => {
    const [ verificationCode, setVerificationCode] = useState("");
    const [ phoneNumber, setPhoneNumber] = useState("");
    const [ country, setCountry] = useState(""); 

    const sendVerifCode = async ( userIDStr, phoneNumberStr) => {
        let data = {
            uidStr: userIDStr, 
            phoneStr : phoneNumberStr
          };
        let url = "https://us-central1-mystockapp-23c4a.cloudfunctions.net/sendOTP";
        axios.post(url,data)
        .then(response => {
            console.log(response.data);
            // do something with response data
        })
        .catch(error => {
            console.log(error);
            // handle error
        });
      }

    const VerifCode = async ( userIDStr, codeString) => {
    let data = {
        uidStr: userIDStr, 
        codeStr : codeString
        };
    let url = "https://us-central1-mystockapp-23c4a.cloudfunctions.net/verifyOTP";
    axios.post(url,data)
    .then(response => {
        console.log(response.data.result);
        return response.data.result;
        // do something with response data
    })
    .catch(error => {
        console.log(error);
        // handle error
    });
    }


    const cancelButtonAction = () => {
        setCoCode("");
        setPNumber("");
    }

    const verifyCodeButtonAction = async () => {
        console.log("check if code input is valid");
        setPNumber(phoneNumber);
    
        if ( VerifCode(controller.authUser.uid, verificationCode)) {
            console.log("True for pass page");
            setPVerif(true);
            swal("Phone Verified Succesfully","","success");
        }
        

    };
    
    
    const sendVerifCodeButtonAction = () => {
        // Check if phone and extension is valid before sending
        if(sendVerifCode(controller.authUser.uid, phoneNumber)){
            swal("Verification Code Sent","","success");
            console.log("ask controller to send code");
        }
    }
    

    return (
        <form className="PhoneVerify">
            <h1>Verify Your Phone Number</h1>
                <div className="PhoneNumber">
                        <PhoneInput  placeholder="Phone number" countrySelectProps={{ unicodeFlags: true }}  id="CountryCode" class="form-control" required value={phoneNumber} onChange={setPhoneNumber} ></PhoneInput>  
                        <input placeholder="Verification Code" id="verification" value= {verificationCode} onChange={(e)=>setVerificationCode(e.target.value)} ></input> 
                        

                </div>              
                    <ul>
                        <uli>
                        
                            <button type="button" onClick={sendVerifCodeButtonAction}> Send Code </button>
                            <button type="button" onClick={cancelButtonAction}> Cancel </button>
                            <button type="button" onClick={verifyCodeButtonAction}> Verify Code </button>
                            
                        </uli>
                    </ul>  
        </form>

    )
}

export default PhoneVerify;