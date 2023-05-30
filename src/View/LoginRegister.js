import React, { useState } from "react";
import logo from '../Icons/logo.png';
import profilepicture from '../Icons/user.png';
import plus from '../Icons/plus.png';
import erroricon from '../Icons/error.png';
import arrow from '../Icons/arrow.png';
import check from '../Icons/check.png';
import invalid from '../Icons/invalid.png';
import upload from '../Icons/upload.png';
import "../Style/LoginRegister.css";
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import {auth, storage, db} from "../Model/firebase"; 
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import AuthDetails from '../Model/AuthDetails';
import { ref, uploadBytes } from 'firebase/storage';
import swal from 'sweetalert';
import { useForm } from "react-hook-form";
import PasswordChecklist from "react-password-checklist"
import SignIn from "../View/SignIn";
import SignUp from "./SignUp";

const LoginRegister = ({controller}) => {

  // hook to activate the overlay effect
  const [addclass, setaddclass] = useState("");

  const showSignIn = () =>{
    setaddclass("");
  }

  const showSignUp= () =>{
    setaddclass("right-panel-active")
  }

  return (


  <div className="App"> 
    <header className="App-header">
    <img src={arrow} className="App-logo" alt="logo" />

    <nav>
      <ul>
        <div className="HeaderLogin">
          <h1> About Us</h1>
          <h1> Contact Us</h1>
          <button  className="ButtonHeader" onClick={() => setaddclass("right-panel-active")}>Sign Up </button>
        </div>
        
      </ul>
    </nav>  

  </header>

    <div className="body">


      <div className={`container ${addclass}`} id="container">

        <SignUp controller={controller} ></SignUp>
        <SignIn controller={controller} > </SignIn>
        

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h4> Already have an account? </h4>
              <button
                className="ghost"
                id="signIn"
                onClick={() => showSignIn()}>
                LOG IN
              </button>
            </div>
                  
            <div className="overlay-panel overlay-right">
              <h4> Not a member yet? </h4>
                <button
                  className="ghost"
                  id="signUp"
                  onClick={() => showSignUp()}
                >
                  SIGN UP
                </button>                
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

    

  );
};

export default LoginRegister;
