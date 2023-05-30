import "../Style/LoginRegister.css";
import {useTable} from "react-table";  
import pdf from '../Icons/pdf.png';
import React, { useState, useEffect, useRef } from "react";
import { setDoc, doc } from 'firebase/firestore';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import {auth, storage, db} from "../Model/firebase"; 
import PieChartAccount from "../View/PieChartAccount";
import Table from "../View/Table";
import { useReactToPrint } from "react-to-print";


const Account = ({controller}) => {

    const [accounts, setAccounts] = useState([]);
    const [accountSelection, setAccountSelection] = useState("");
    const [seePieChart, setPieChart] = useState(false);
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

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    async function handleBalance (e){

        if (e.target.value != 'Select Account'){
            setAccountSelection(e.target.value)
            console.log(e.target.value);
            const getAccountInfo = await controller.getBalance(e.target.value);
            if(getAccountInfo[0] ==="dollar"){
                setCurrency("$")
            }
            else{
                setCurrency(getAccountInfo[0])
            }
            setBalance(getAccountInfo[1])
        }
    };

    return(

        <div className="AnchorPaneTransfer">
            <div className="MyAccount">
                <h1 >My Accounts</h1>
                <div className="AccountHistory">
                        <div className="Accounts">
                            <select placeholder="Select Account" className="AccountSelector" value={accountSelection} onChange={handleBalance}>
                            {accounts.map((val, i) => <option key={i} value={val}>{val}</option>)}
                            </select>
                            <button id="ButtonHome" onClick={() => {setPieChart(true)}}>See Account Summary</button> 
                            
                        </div>
                    </div> 
                    {seePieChart ? (

                    <div className="PDF-Container">
                        
                        <button style={{color:'gray'}} onClick={handlePrint} id="ButtonAccount"> <img src={pdf} id="pdf" alt="profpicture" ></img> <h2>Print or Save as PDF</h2></button>
                        <div ref={componentRef} class="PieChartPDF"> 
                        
                            <h1 style={{color:'gray'}}>Account Summary:  {accountSelection} <h1 style={{fontSize: '16px'}}>Balance {currency} {balance}</h1>  </h1>
                                <hr />
                                
                            <div  className="ToPDF"> 
                                 
                                <PieChartAccount></PieChartAccount>  
                                
                            </div>

                            <Table controller={controller}></Table>
                        </div>
                    </div> 
                    )
                    :
                    (<>
                    </>)
                    }                    
            </div>
         </div>
    )
}


export default Account;