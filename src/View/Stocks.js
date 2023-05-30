import "../Style/LoginRegister.css";
import React, { useState, useEffect, useMemo } from "react";
import { setDoc, doc } from 'firebase/firestore';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import {auth, storage, db} from "../Model/firebase"; 

const Stocks =  ({ controller, ...props }) => {

    const [accounts, setAccounts] = useState([]);
    const [accountSelection, setAccountSelection] = useState("");
    const [balance, setBalance] = useState([]);
    const [currency, setCurrency] = useState([]);
    const [isDisabled, setDisabled] = useState(true);

    const [stocks, setQuantity] =  useState([])
    const [stockImgs, setImgs] =  useState([])
  
    useEffect(() => {
        // Define an async function inside useEffect to be able to use await
        const fetchData = async () => {
                
            const uid = await controller.checkCurrentUserStatus();

            const docRef = doc(db, 'users', controller.authUser.uid);
            const docSnap = await getDoc(docRef);
            const arr = docSnap.data()["accounts"];
            let accountsArr = [];
            for (var key in arr)
                accountsArr.push(arr[key]);
            accountsArr.unshift('Select Account To Buy');
            console.log( accountsArr );
            setAccounts(accountsArr);
            console.log( accounts );
            
            };
        fetchData();
    }, []);


    useEffect(() => {
      // Define an async function inside useEffect to be able to use await
      const fetchStocks = async () => {
              
          const StocksFetch = await controller.getStocksInfo();
          setQuantity(StocksFetch);
          console.log("here");
          let stockURL=[];
          for(var stock in StocksFetch)
            stockURL[stock] = await controller.getImage( `stocks/logos/${StocksFetch[stock].stockimg}.png`);
          console.log(stockURL);
          setImgs(stockURL);
          };
          

      fetchStocks();
  }, []);

    const handleChange = (e, index) => {
        const newFiltered = [...filtered];
        newFiltered[index][e.target.name] = e.target.value;
        setQuantity(
          stocks.map((stock) => (stock.id === newFiltered[index].id ? newFiltered[index] : stock))
        );
       
        
      };

    const filtered = stocks.filter((stock) =>
    stock.id.includes(props.searchText) ||
    stock.symbol.includes(props.searchText)

  );

  const filteredImgs = filtered.map((stock) => {
    const index = stocks.indexOf(stock);
    return stockImgs[index];
  });

    async function handleAccountSelection(e) {

      if (e.target.value != 'Select Account'){
        setAccountSelection(e.target.value)
        setDisabled(false);
      }
    }

    async function buyStockAction( stockName, stockQuantity ){
      console.log(accountSelection, stockName, stockQuantity);
      return await controller.buyStock(accountSelection, stockName, stockQuantity );
    }
       

    return(

        <div className="Stocks">
            <div className="Accounts" >
                            
                            <select placeholder="Select Account" className="AccountSelector" value={accountSelection} onChange={handleAccountSelection} >
                            {accounts.map((val, i) => <option key={i} value={val}>{val}</option>)}
                            </select>
                            
            </div>
            <div className="MyStocks">
                <div className="StocksGrid" >
                    {filtered.map((stock,i) => (

                        <div key={stock.id} className="StockCard">
                                <h4>{stock.name}</h4>
                                <img className="StockImg" src={filteredImgs[i]}></img>
                                <h4> $ {stock.price}</h4>
                                
                                    <div className="AmountStock">
                                            <h4>Quantity:</h4>
                                            <input placeholder="0"  pattern="/^[1-9\b]+$/" value={stock.quantity} onChange={(e) => handleChange(e, i)} name="quantity"></input> 
                                    </div>

                                    <div className="AmountStock">
                                            
                                        <h4> Total Price: $ {(stock.price * stock.quantity).toFixed(2)}</h4>
                                    </div>
                                    <button type="button"  onClick={ () => {buyStockAction( stock.name, stock.quantity);} }  disabled={isDisabled} Style={{ color: isDisabled ? 'red' : 'green' }}>Buy</button>   
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default Stocks;