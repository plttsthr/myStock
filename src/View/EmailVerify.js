import React, { useState, useEffect } from "react";
import { Password } from "primereact/password";
import PasswordChecklist from "react-password-checklist";

import {sendEmailVerification, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {auth} from "../Model/firebase";
import check from '../Icons/check.png';
import invalid from '../Icons/invalid.png';
import "../Style/LoginRegister.css";
import swal from 'sweetalert';
import {motion} from "framer-motion/dist/framer-motion";

const EmailVerify = ({controller, clear, setEVerif}) => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [clickedVerifyEmail, setVerifyEmailTrue] = useState(false);

    const verifyButtonAction = (e) => {
        e.preventDefault();
        controller.emailVerifyProcedure(email, password, confirmPassword);
        setVerifyEmailTrue(true);

    }
    
    const cancelButtonAction = () => { setEmail(""); setPassword(""); setConfirmPassword(""); }

    async function nextButtonAction(e){ 
        e.preventDefault();
        
        if ( await controller.emailVerifyNext() ){
            console.log("setting flag to true");
            setEVerif(true); //email verified flag for parent method set to true, modifies the view in the parent
        }     
    }

    useEffect(() => {
        cancelButtonAction();
        // props.setRClear(false);
    }, [clear]);

    // When form submitted ask controller for signup
    
    return (
        <>
            <form onSubmit={verifyButtonAction} id="signup-form">
                <h1>Create Account</h1>
                <div className="Email-Box">
                <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                <input type="email" placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)} name="email"/>
                </div>
            
                <div className="Password-Box">
                <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                <Password placeholder="Password"  required value={password} onChange={(e)=>setPassword(e.target.value)} name="password" toggleMask  onCopy={(e) => {e.preventDefault(); return false;}}/>
                </div>
            
                <div className="PasswordConfirm-Box">
                <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                <Password placeholder="Confirm Password"  required   value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}  name="confirmpassword" toggleMask onPaste={(e) => {e.preventDefault(); return false;}}/>
                </div>

                {password != ""  || confirmPassword != "" ? /* Show checklist if passwords are being filled by user */
                    <>

                        <motion.div  initial="hidden" animate="visible" variants={{
                            hidden: {
                                scale: .10,
                                opacity: 0
                            },
                            visible: {
                                scale: 1,
                                opacity: 1,
                                transition: {
                                delay: .3
                                }
                            },
                        }}>
                            <PasswordChecklist className="PasswordCheck"
                            rules={["minLength","specialChar","number","capital","match"]}
                            minLength={8}
                            value={password}
                            valueAgain={confirmPassword}
                            
                            validColor={'#679267'}
                            invalidColor={'#ce2029'}
                            style={{marginTop: '20px', alignItems: 'center', position: 'relative'}}
                            iconComponents={{ValidIcon: <img src = {check} style={{width: '16px', height: '16px'}} />, InvalidIcon:<img src = {invalid}  style={{width: '17px', height: '17px'}} />}}
                            onChange={(isValid) => {}}
                        />

                        </motion.div>
                        
                    </>
                : 
                    <></> }

                <ul id="ButtonEmailVerify">
                    <uli>
                        {!clickedVerifyEmail ? 
                        (<> 
                            <button type="submit"> Verify Email </button>
                            <button type="button" onClick={ nextButtonAction }> Next </button>
                            <button type="button" onClick={ cancelButtonAction }> Cancel </button>
                        </>)
                         : 
                        (<>
                            <button type="submit"> Verify Email Again</button>
                            <button type="button" onClick={ nextButtonAction }> Next </button>
                            <button type="button" onClick={ cancelButtonAction }> Cancel </button> 
                        </>) }
                        
                    </uli>
                </ul>
                
            </form>
            
        </> 
    )
}

export default EmailVerify;