
import './Style/fonts.css';
import React, {useState, useEffect} from "react";
import LoginRegister from './View/LoginRegister';
import Home from './View/Home';
import AuthDetails from './Model/AuthDetails';
import ForgotPassword from './View/ForgotPassword';
import ChangePassword from './View/ChangePassword';
import 'primeicons/primeicons.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Controller from "./Controller/Controller";
import {auth} from "./Model/firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const controller = new Controller(auth);
  console.log(auth)

  return (

   <div>

      <Router>
            <Routes>
               <Route path="/change" element={<ChangePassword controller={controller}/>} />
              <Route path="/homeweb" element={<Home controller={controller} />} />
              <Route path="/forgot" element={<ForgotPassword controller={controller}/>} />
              <Route path="/" element={<LoginRegister controller={controller}/>} />
            </Routes>
      </Router>

   </div>
  );
}

export default App;
