import "../Style/LoginRegister.css";
import profilepicture from '../Icons/profilepicture.png';
import { setDoc, doc } from 'firebase/firestore';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import {auth, storage, db} from "../Model/firebase"; 
import React, { useState, useEffect, useMemo } from "react";
import swal from 'sweetalert';


const FundAccount = ({controller}) => {

    const [amount, setAmount] = useState(null);
    const [accounts, setAccounts] = useState([]);
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


    const handleFundAccount = async () => {

        if(await controller.fundAccount(accountfund, amount)){
            refreshBalance(accountfund);
            await timeout(1000);
            swal("Account Funded Succesfully","","success");
            
        } 
    };


    async function handleBalance (e){

        if (e.target.value != 'Select Account'){
            setAccountFund(e.target.value)
            const getAccountInfo = await controller.getBalance(e.target.value);
            setCurrency(getAccountInfo[0])
            setBalance(getAccountInfo[1])
        }
    };

    async function refreshBalance (accountID){

        if (accountID != 'Select Account'){
            setAccountFund(accountID)
            const getAccountInfo = await controller.getBalance(accountID);
            setCurrency(getAccountInfo[0])
            setBalance(getAccountInfo[1])
            setAmount(null);
        }
    };
   


    return(
            <div className="AnchorPaneTransfer">
                <div className="MyAccountFund">
                    <h1 > Fund Account</h1>
                    <div className="AccountHistory" style={{marginBottom:'40px'}}>
                        <div className="Accounts">
                            <select placeholder="Select Account" className="AccountSelector" value={accountfund} onChange={handleBalance}>
                                {accounts.map((val, i) => <option key={i} value={val}>{val}</option>)}
                            </select>
                            <div className="MyAccountBalance">
                            <div style={{fontSize: '15px', float: 'left', marginBottom: '5px', marginLeft: '-7px'}}>Balance {currency} {balance}</div>
                            
                        </div>
                        </div>

                        <div className="CardAmount">  
                            <div className="CardInfo-1">
                                <input type="text" placeholder="Card Number" style={{marginRight: '7.5px'}}></input>
                                <input type="text" placeholder="Expiration Date" style={{marginLeft: '7.5px'}}></input>
                            </div>
                            <div className="CardInfo-2">
                                <input type="text" placeholder="Cardholder's Name" style={{marginRight: '7.5px'}}></input>
                                <input type="text" placeholder="CVV" style={{marginLeft: '7.5px'}}></input>
                            </div>

                            <div style={{marginTop: '15px'}} className="AmountBox">
                            <div style={{fontSize: '14px', float: 'left', marginBottom: '5px'}}>Amount </div>
                            <div style={{fontSize: '14px', float: 'left', marginBottom: '5px'}}></div><input style={{width: '60%', marginRight:'20px'}}placeholder="0.00" type="number" pattern="/^[0-9\b]+$/" value={amount} onChange={(e)=>setAmount(e.target.value)}></input>
                            <button style={{width: '30%'}} id="ButtonHome" onClick={()=>{handleFundAccount(); setAmount("")}}>Fund Account</button> 
                            </div>
                        </div>

                    </div>   
                    
                 </div>    

            </div>

    )
}


export default FundAccount;