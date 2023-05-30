import React, { useState } from "react";
import "../Style/ForgotPassword.css";
import { Link } from "react-router-dom";
import {motion} from "framer-motion/dist/framer-motion";
import {auth} from "../Model/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import swal from 'sweetalert';


const ChangePassword = ({controller}) => {
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
                            <Link style={style}to="/homeweb"> Back to Home</Link>
                            </div>
                        </div>
                </motion.div>
        </div>
    );
}


export default ChangePassword;
