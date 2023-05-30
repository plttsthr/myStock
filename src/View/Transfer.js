import "../Style/LoginRegister.css";
import profilepicture from '../Icons/profilepicture.png';
import { setDoc, doc } from 'firebase/firestore';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import {auth, storage, db} from "../Model/firebase"; 
import React, { useState, useEffect, useMemo } from "react";
import swal from 'sweetalert';




const Transfer = ({controller}) => {

    const [accounts, setAccounts] = useState([]);
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [accountfund, setAccountFund] = useState("");
    const [balance, setBalance] = useState([]);
    const [currency, setCurrency] = useState([]);

    
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

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }


    const handleTransferAccount = async () => {

        if(await controller.transferAccounts(fromAccount, toAccount, amount)){
            refreshBalance(toAccount);
            await timeout(1000);
            swal("Amount Transferred Succesfully","","success");  
        }
        
    };

    async function handleBalance (e){

        if (e.target.value != 'Select Account'){
            setToAccount(e.target.value);
            console.log(e.target.value);
            const getAccountInfo = await controller.getBalance(e.target.value);
            
            setCurrency(getAccountInfo[0])
            setBalance(getAccountInfo[1])
        }
    };

    async function refreshBalance (accountID){

        if (accountID != 'Select Account'){
            setToAccount(accountID)
            console.log(accountID);
            const getAccountInfo = await controller.getBalance(accountID);
            setAmount("");
            setCurrency(getAccountInfo[0])
            setBalance(getAccountInfo[1])
            setToAccount("");
            setFromAccount("");
        }
    };



    return(
        <div className="AnchorPaneTransfer">
                <div className="TransferFunds">
                    <h1 classname="p"> Transfer Funds</h1>
                        <div style={{fontSize: '14px', float: 'left', marginBottom: '5px'}}>From Account</div>
                        <select placeholder="From Account" className="AccountSelector" value={fromAccount} onChange={(e)=>setFromAccount(e.target.value)} >
                            {accounts.map((val, i) => <option key={i} value={val}>{val}</option>)}
                        </select>
                        <div style={{fontSize: '14px', float: 'left', marginBottom: '5px', marginTop: '20px'}}>To Account</div>
                        <select placeholder="To Account" className="AccountSelector" value={toAccount} onChange={handleBalance}>
                            {accounts.map((val, i) => <option key={i} value={val}>{val}</option>)}
                        </select>

                        <div className="AmountBox">
                            <div style={{fontSize: '14px', float: 'left', marginBottom: '0px', marginRight: '5px', width: '20%'}} >Amount {currency}</div>
                            <input style={{fontSize: '14px', float: 'left' , marginRight: '5px'}} placeholder="0.00" type="number" pattern="/^[0-9\b]+$/" value={amount} onChange={(e)=>setAmount(e.target.value)}></input>
                            <input style={{fontSize: '14px', float: 'left' , marginLeft: '5px'}} type="date"></input>
                            

                        </div>
                        
                        <button id="ButtonHome" onClick={()=>handleTransferAccount()}>Transfer Funds</button>
                </div>
        </div>
    )
}
export default Transfer;