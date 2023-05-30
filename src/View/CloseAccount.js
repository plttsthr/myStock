import "../Style/LoginRegister.css";
import {useTable} from "react-table";  
import React, { useState, useEffect, useMemo } from "react";
import { setDoc, doc } from 'firebase/firestore';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import {auth, storage, db} from "../Model/firebase"; 
import swal from 'sweetalert';

const CloseAccount = ({controller}) => {


    const [accounts, setAccounts] = useState([]);
    const [accountToClose, setAccountToClose] = useState("");
    
    useEffect(() => {
        // Define an async function inside useEffect to be able to use await
        const fetchData = async () => {

        const docRef = doc(db, 'users', controller.authUser.uid);
        const docSnap = await getDoc(docRef);
        const arr = docSnap.data()["accounts"];
        let accountsArr = [];
        for (var key in arr)
             accountsArr.push(arr[key]);
        accountsArr.unshift('Select Account');
        console.log( accountsArr );
        setAccounts(accountsArr);
        console.log( accounts );
        
        };
        fetchData();
    }, []);


    async function closeAccountAction( acc ){

        return await controller.deleteAccount(acc);
        swal(`Account ${acc} was removed succesfully`);
     }


return(

    <div className="AnchorPaneAddAccount">
        <div className="CreateAccount">
            <h1 classname="p"> Close Account</h1>
                <select placeholder="Select Account" className="AccountSelector" value={accountToClose} onChange={(e)=>setAccountToClose(e.target.value)}>
                {accounts.map((val, i) => <option key={i} value={val}>{val}</option>)}
                </select>
                <button id="ButtonHome" onClick={() => {closeAccountAction(accountToClose)}}>Close Account</button>
        </div>
    </div>
);
}
export default CloseAccount;