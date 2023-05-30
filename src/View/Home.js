import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import "../Style/LoginRegister.css";
import SearchBar from "../View/SearchBar";
import NotificationBell from "../View/NotificationBell";
import StockTicker from "../View/StockTicker";
import notification from '../Icons/notification.png';
import logout from '../Icons/logout.png';
import {useNavigate} from "react-router-dom";
import account from '../Icons/account.png';
import profits from '../Icons/profits.png';
import settings from '../Icons/settings.png';
import { NavLink } from 'react-router-dom';
import Stocks from "../View/Stocks";
import SellStocks from "../View/SellStocks";
import Account from '../View/Account';
import AddAccount from "../View/AddAccount";
import CloseAccount from "../View/CloseAccount";
import FundAccount from "../View/FundAccount";
import Settings from "../View/Settings";
import Transfer from "../View/Transfer";
import "../Style/ForgotPassword.css";

async function grabInfo(controller) {
    const item = await controller.grab_user_info(["name"]);
    return item;
}

async function grabImg(controller) {
    const picture = await controller.grab_user_picture("profilePicture");
    return picture;
}


    const Home = ({controller}) => {
        const [info, setInfo] = useState('');
        const [img, setImg] = useState(null);

        const setSearch = () => { setSection("Search")};
        const [searchValue, setSearchValue] = useState("");

        const handleSearchValue = (value) => {
            setSearchValue(value);
    };
    


    const navigate = useNavigate();
    
    useEffect(() => {
        // Define an async function inside useEffect to be able to use await
        const fetchData = async () => {
            const items = await grabInfo(controller);
            const picture = await grabImg(controller);
            
            setInfo(items);
            setImg(picture);
        };
        fetchData();

    }, [controller]);

    const [section, setSection] = useState("None");



    const RenderSection  = ()  =>{

        switch (section) {
            case "Account":
                return <Account controller = {controller}/>;

            case "Stocks":
                return <Stocks searchText={searchValue} controller = {controller} />;

            case "FundAccount":
                return <FundAccount controller = {controller}/>;

            case "Transfer":
                return <Transfer controller = {controller}/>;

            case "AddAccount":
                return <AddAccount controller = {controller}/>;

            case "CloseAccount":
                return <CloseAccount controller = {controller}/>;
                  
            case "Settings":
                return <Settings controller = {controller}/>;

            case "Search":
                return <Stocks searchText={searchValue} controller = {controller} />;
            case "SellStocks":
                return <SellStocks searchText={searchValue} controller = {controller} />;


            default:
                return <Stocks searchText={searchValue} controller = {controller} />;


        }
    }


    const buttonSignOut = (e) => {
        controller.userSignOut();
        navigate('/');
    }

    return(

        <div className="App"> 
            <header className="Menu-header">
                <div className="App-logo" alt="logo">
                </div>
                <SearchBar setSearch={setSearch} handleSearchValue={handleSearchValue}> </SearchBar>
            
                <nav>
                
                    <ul>
                        <div className="HeaderLogin">
                        
                            <button id="ButtonBell"> <img src={notification} id="bell-home" alt="profpicture" ></img> </button>
                            <h4 style={{display:'flex'}}> Hi, {info} </h4><img src={img} id="picture-home" alt="profpicture" ></img> 
                        </div>
                        
                    </ul>
                </nav>  

            </header>
            <StockTicker> </StockTicker>
            <div className="Sidebar-Anchor">
            <div className="Sidebar"> 
            
                <div className='ButtonAccounts'> 
                    <button id="ButtonSideBar"> <img src={account} id="account" alt="profpicture" ></img> <h2>Account</h2> </button>
                        <ul className="DropDownAccount" id="subMenuAccount">
                            <li>
                            <h3 onClick={() => setSection("Account")}>My Accounts</h3> 
                            </li>
                            <li>
                            <h3 onClick={() => setSection("FundAccount")}>Fund Account </h3>
                            </li>
                            <li>
                            <h3 onClick={() => setSection("Transfer")}>Transfer Funds</h3> 
                            </li>
                            <li>
                            <h3 onClick={() => setSection("AddAccount")}>Create Account</h3> 
                            </li>
                            <li>
                            <h3 onClick={() => setSection("CloseAccount")}>Close Account</h3> 
                            </li>
                            
                        </ul>        
                    </div>

                    

                    <div className="ButtonStocks"> 
                        <button  id="ButtonSideBar"> <img src={profits} id="account" alt="profpicture" ></img> <h2>Stocks</h2> </button>
                        <ul  className="DropDownStocks" id="subMenuStocks">
                        
                            <li>
                            <h3 onClick={() => setSection("Stocks")} >Buy Stocks</h3> 
                            </li>
                            <li>
                            <h3 onClick={() => setSection("SellStocks")}>Sell Stocks</h3> 
                            </li>
                            <li>
                            <h3 >Set Price Alert</h3> 
                            </li>
                        </ul>        
                     </div>
                    
                    <button id="ButtonSideBar"  onClick={() => setSection("Settings")}> <img src={settings} id="account" alt="profpicture" ></img> <h2 >Settings</h2> </button>
                    <button id="ButtonLogout" onClick={buttonSignOut} ><img src={logout} onClick={buttonSignOut} id="logout" alt="profpicture" ></img> <h2 >Sign Out</h2> </button>
            </div>

            <div className='AnchorPane'>
                
                <div className='RenderSection'>
                    {RenderSection()}
                </div>
                
            </div>
           
       </div>

        </div>

        
    )
}


export default Home;