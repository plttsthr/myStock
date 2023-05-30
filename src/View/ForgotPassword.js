import React, { useState } from "react";
import "../Style/ForgotPassword.css";
import { Link } from "react-router-dom";
import {motion} from "framer-motion/dist/framer-motion";
import {auth} from "../Model/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import swal from 'sweetalert';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';
import axios from 'axios';


const ForgotPassword = ({controller}) => {


    const [ phoneNumber, setPhoneNumber] = useState("");
    const [ country, setCountry] = useState(""); 
    const [ verificationCode, setVerificationCode] = useState("");

    const style = {
        fontWeight: "bold",
        color: "white"
    }

    // Sends password reset email
    const [email,setEmail] = useState("");

    const passResetButtonAction = () => {
        controller.sendPassReset(email);
        setEmail("");
    }


    const cancelButtonAction = () => {
            setCountry("");
            setPhoneNumber("");
    }

    const VerifCodeEmailRecovery = async ( PhoneStr, codeString) => {

        let data = {
        phoneStr: PhoneStr,
        codeStr : codeString
        };
        
        let url = "https://us-central1-mystockapp-23c4a.cloudfunctions.net/verifyOTPEmailRecovery";
        axios.post(url,data)
        .then(response => {
        
        if(response.data.result ==="wrong code"){
            swal(`${response.data.result}`,"", "error");
        }
        else{
            swal(`Your email is: ${response.data.result}`);
        }
        
        
        return response.data.result;
        // do something with response data
        
        })
        }

        const sendVerifCodeEmailRecovery = async (phoneNumberStr) => {

            let data = {
            phoneStr : phoneNumberStr
            };
            let url = "https://us-central1-mystockapp-23c4a.cloudfunctions.net/sendOTPEmailRecovery";
            axios.post(url,data)
             .then(response => {
            console.log(response.data);
            swal("Verification Code Sent","","success");
                 // do something with response data
            })
           
         }

         const sendVerifCodeButtonAction = () => {

            sendVerifCodeEmailRecovery(phoneNumber)
         }

         const verifyCodeButtonAction = async () => {
                console.log(phoneNumber, verificationCode)
            VerifCodeEmailRecovery(phoneNumber, verificationCode)
            
        };


    return(

        <div className="ForgotPassword"> 
                <motion.div initial="hidden" animate="visible" variants={{
                        hidden: {
                            scale: .10,
                            opacity: 0
                        },
                        visible: {
                            scale: 1,
                            opacity: 1,
                            transition: {
                            delay: .5
                            }
                        },
                        }}>
                        <div className="Container"> 
                            <div className="Link">
                                <h6>Please enter your email address. You will receive a link to create a new password via email.</h6>
                                <input type="text" placeholder="Email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input> 
                                <button onClick={passResetButtonAction}>Send link</button>
                                <Link style={style}to="/"> Back to Login</Link>
                            </div>
                        </div>
                        <div className="Container-Code">

                            <h6> Please enter phone number. You will receive a code to recover your email </h6>
                                <div className="PhoneNumber">
                                        <PhoneInput  placeholder="Phone number" countrySelectProps={{ unicodeFlags: true }}  id="CountryCode" class="form-control" required value={phoneNumber} onChange={setPhoneNumber} ></PhoneInput>  
                                        
                                        <input placeholder="Verification Code" id="verification" value= {verificationCode} onChange={(e)=>setVerificationCode(e.target.value)} ></input> 
                                        

                                </div>              
                                    <ul>
                                        <uli>
                                        
                                            <button type="button" onClick={sendVerifCodeButtonAction}> Send Code </button>
                                            <button type="button" onClick={cancelButtonAction}> Cancel </button>
                                            <button type="button" onClick={verifyCodeButtonAction}> Verify Code </button>
                                            <Link style={style}to="/"> Back to Login</Link>
                                            
                                        </uli>
                                    </ul>  


                        </div>

                       
                </motion.div>

                
               
        </div>
    );
}


export default ForgotPassword;
