import React, {useState} from "react";
import AuthDetails from '../Model/AuthDetails';
import { Password } from "primereact/password";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../Model/firebase";
import { Navigate } from "react-router-dom";
import { Link, useNavigate} from "react-router-dom";
import "../Style/LoginRegister.css";
import swal from 'sweetalert';


const SignIn = ({controller}) => {

    //Hook to verify login credentials
    const [credentials, setCredentials] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const eraseFields = () => {
      setEmail(""); setPassword("");
    }

    const logInFormAction = async (e) => {
        e.preventDefault(); // avoid default behavior when form is submitted to maintain the fields

        if ( await controller.loginUser(email, password) ){
          setUserLoggedIn(true); setCredentials(true); eraseFields();
        }
        else{
          setUserLoggedIn(false);setCredentials(false); eraseFields();
        }
    }

    return(
    
       <div className="form-container sign-in-container">
            <form onSubmit={logInFormAction} id="login-form">
                <h1>Login</h1>

                  {!credentials ? (

                    <>
                      <div className="Email-Box">
                          <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                          <input type="email" style={{borderBottom: '1px solid red'}} placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)} name="email"/>
                      </div>
      
                      <div className="Password-Box">
                          <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                          <input type="password" placeholder="Password"  style={{borderBottom: '1px solid red'}}  required value={password} onChange={(e)=>setPassword(e.target.value)} name="password" toggleMask />
                      </div>      

                      <p style={{color: 'red'}} > Incorrect email or password. Try again  </p>
                    </>

                    ):(

                      <>
                        <div className="Email-Box">
                          <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                          <input type="email" placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)} name="email"/>
                        </div>
          
                        <div className="Password-Box">
                            <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                            <Password placeholder="Password"  required value={password} onChange={(e)=>setPassword(e.target.value)} name="password" toggleMask />
                        </div>      
                      </>
     
                      )}     
            
              <Link to="/forgot"> Forgot Password or Email</Link>

              <button type="submit">LOGIN</button>

              {userLoggedIn ? (<>{navigate('/homeweb')}</>):(<></>)}

        </form>
      </div>

    )
}

export default SignIn;