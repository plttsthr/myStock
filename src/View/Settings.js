import React, { useState, useEffect, useMemo } from "react";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import "../Style/LoginRegister.css";
import erroricon from '../Icons/error.png';
import profilepicture from '../Icons/profilepicture.png';
import plus from '../Icons/plus.png';
import swal from 'sweetalert';
import { Link, useNavigate} from "react-router-dom";
import "../Style/Modal.css";
import PhoneVerify from "./PhoneVerify";


async function grabname(controller) {
    const item = await controller.grab_user_info(["name"]);

    if (item == "") {
        return "-";
    }
    return item;
}

async function grabcountry(controller) {
    const item = await controller.grab_user_info(["country"]);

    if (item == "") {
        return "-";
    }
    return item;
}

async function grabaddress1(controller) {
    const item = await controller.grab_user_info(["address1"]);

    if (item == "") {
        return "-";
    }
    return item;
}

async function grablastName(controller) {
    const item = await controller.grab_user_info(["lastName"]);

    if (item == "") {
        return "-";
    }
    return item;
}

async function grabmidName(controller) {
    const item = await controller.grab_user_info(["midName"]);

    if (item == "") {
        return "-";
    }
    return item;
}

async function grabPhoneNumber(controller) {
    const item = await controller.grab_user_info(["phonenumber"]);

    if (item == "") {
        return "-";
    }
    
    return item;
}

async function grabImg(controller) {
    const picture = await controller.grab_user_picture("profilePicture");

    return picture;
}

function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}


const Settings = ({controller}) => {
    
    const [name, setName] = useState('');
    const [midName, setmidName] = useState('');
    const [lastName, setlastName] = useState('');
    const [countryView, setCountryView] = useState("");
    const [country, setCountry] = useState('');
    const [address1, setAddress1] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [img, setImg] = useState(null);
    const [image, setImage] = useState(null);   // Profile picture
    const [imagePath, setImagePath] = useState(null); // path to use for storing profile picture
    const [ImgIsUploaded, setImgIsUploaded] = useState(false); // status of upload for profile picture
    const [typeFile,setTypeFile] = useState("");
    
    const [isDisabled, setDisabled] = useState(true);
    const [isMDisabled, setModalDisabled] = useState(true);
    const [temp, setTemp] = useState(""); //Used in order to change variables without changing them in the background, less awkward
    const [nameModal,setNameModal] = useState(false); // Set new name
    const [midNameModal, setMidNameModal] = useState(false); //Set new mid name
    const [lastNameModal, setLastNameModal] = useState(false); //Set new last name
    const [addressModal, setAddressModal] = useState(false); //Set new address(es)
    const [countryModal, setCountryModal] = useState(false); //Set Country Modal
    const [phoneModal, setPhoneModal] = useState(false); //Set Phone Modal
    const options = useMemo(() => countryList().getData(), []);

    //Name Change:
    const toggleNameModal = () => {
        setNameModal(!nameModal);
    }

    //Middle Name Change:
    const toggleMidNameModal = () => {
        setMidNameModal(!midNameModal);
    }

    //Last Name Change:
    const toggleLastNameModal = () => {
        setLastNameModal(!lastNameModal);
    }
    
    //Address Change:
    const toggleAddressModal = () => {
        setAddressModal(!addressModal);
    }

    //Country Change:
    const toggleCountryModal = () => {
        setCountryModal(!countryModal);
    }
    
    //Handle Country Change:
    const handlerCountryChange = (countryView) => {
        setCountryView(countryView);
        if ( countryView.label == country )
        {
            setModalDisabled(true);
        }
        else
        {
            setModalDisabled(false);
        }
    }

    //Versatile Variable name for the Modal
    function handleModalChange(new_var, modal_var) {
        //Name matches the previous one
        if( new_var == modal_var || new_var == "" || new_var =="-")
        {
            setModalDisabled(true);
        }
        else
        {
            setModalDisabled(false);
        }
    }

    //Refreshes the page after an action has happened
    async function refreshPage( variable ){
        swal(variable + " Updated","","success");
        await timeout(2000);
        window.location.reload(false);
    }

    function handleImageChange(e) {
    
        if (e.target.files && e.target.files[0]) {
          setTypeFile(e.target.files[0].type);
          let reader = new FileReader();
          
          setImagePath(e.target.files[0]);
    
          reader.onload = function (e) {
            setImage(e.target.result); // changes the profile picture variable through its hook
            setImgIsUploaded(true); // status set to true
          };
    
          reader.readAsDataURL(e.target.files[0]);
        }

        setDisabled(false);
    
      }
   
     async function changeProfilePicture(controller){
        let sts = true;
       if( await controller.uploadImage("profilePicture",imagePath)){
        swal("Picture Updated","","success");
        await timeout(2000);
        window.location.reload(false);
       }
    }

    useEffect(() => {
        // Define an async function inside useEffect to be able to use await
        const fetchData = async () => {
            const name = await grabname(controller);
            const midName = await grabmidName(controller);
            const lastName = await grablastName(controller);
            const country = await grabcountry(controller);
            const address1 = await grabaddress1(controller);
            const pNumber = await grabPhoneNumber(controller);
            const picture = await grabImg(controller);

            setName(name);
            setmidName(midName);
            setlastName(lastName);
            setCountry(country);
            setAddress1(address1);
            setPhoneNumber(pNumber);
            setImg(picture);

        };
        fetchData();
    }, [controller]);

    //Change the desired field to the database
    async function changeDataButtonAction(path, payload, variable){
        controller.updateField( path, payload);
        
        switch ( variable )
        {
            case "name":
            {
                toggleNameModal( );
                break;
            }
            case "midName":
            {
                toggleMidNameModal( );
                break;
            }
            case "lastName":
            {
                toggleLastNameModal( );
                break;
            }
            case "address":
            {
                toggleAddressModal( );
                break;
            }
            case "country":
            {
                toggleCountryModal( );
                break;
            }
        }
    }

    return(
        <div className='AnchorPaneSettings'>
                <div className="UserDataChange">
                    <h1> Settings</h1>
                    <div className="AccountHistory">
                        <div className="InfoOptions">

                            <div className="SettingsTest">
                                <h3 style={{color: "black"}}> Name:</h3> <input placeholder={name}></input>
                                <button id="SettingsButton" onClick={toggleNameModal}> Change </button>
                            </div>
                            <div className="SettingsTest">
                                <h3 style={{color: "black"}}> Middle name:</h3> <input placeholder={midName}></input>
                                <button id="SettingsButton" onClick={toggleMidNameModal}> Change </button>
                            </div>
                            <div className="SettingsTest">
                                <h3 style={{color: "black"}}> Last Name:</h3> <input placeholder={lastName}></input>
                                <button id="SettingsButton" onClick={toggleLastNameModal}> Change </button>
                            </div>
                            <div className="SettingsTest">
                                <h3 style={{color: "black"}}> Email Address:</h3> <input placeholder="New Email"></input><button id="SettingsButton"> Change </button>
                            </div>
                            <div className="SettingsTest">
                                <h3 style={{color: "black"}}> Password: </h3><input placeholder="********"></input>
                                <Link id="changePassword" to="/change">Change</Link>
                            </div>
                            <div className="SettingsTest">
                                <h3 style={{color: "black"}}> Phone Number: </h3>  <input placeholder={phoneNumber}></input><button id="SettingsButton"> Change </button>
                            </div>
                            <div className="SettingsTest">
                                <h3 style={{color: "black"}}> Country:</h3> <input placeholder={country}></input>
                                <button id="SettingsButton" onClick={toggleCountryModal}> Change </button>
                            </div>
                            <div className="SettingsTest">
                                <h3 style={{color: "black"}}> Address: </h3> <input placeholder={address1}></input>
                                <button id="SettingsButton" onClick={toggleAddressModal}> Change </button> 
                            </div>
                        </div>

                        <div className="ChangePicProfile"> 
                            <div className="profile-pic-settings">
                                
                                { ImgIsUploaded ? (
                                        <>
                                            <label htmlFor="inputImg"> <img id="picture-settings" src={image} draggable={false} alt="uploaded-img" /></label>
                                            <div className="CameraIcon"> 
                                            <img src={erroricon} id="close" alt="plus" onClick={() => {setImgIsUploaded(false); setImage(null); setDisabled(true);}} ></img> 
                                            </div>
                                            
                                        </>) 
                                        : 
                                        (
                                        <>
                                            <label htmlFor="inputImg"> <img src={img} id="picture-settings" alt="profilepicture" ></img> </label> 
                                            <div className="CameraIcon"> <label htmlFor="inputImg"> <img src={plus} id="plus" alt="plus" ></img> </label>     </div>  
                                            <input type="file"   accept="image/jpg" id="inputImg" onChange={handleImageChange} />
                                        </>
                                        ) }
                            </div>
                            <button onClick={() =>changeProfilePicture(controller)} disabled={isDisabled} Style={{ color: isDisabled ? 'red' : 'green' }}> Change Picture</button>
                        </div>  
                    </div>
                </div>
            {nameModal && (
            <div className="modal">
                <div onClick={toggleNameModal} className="overlay_modal"></div>
                    <div className="modal-content">
                        <h2> Change Name:</h2>
                        <input placeholder='New First Name:' onChange={(e)=>{setTemp(e.target.value); handleModalChange(e.target.value, name)} }></input>
                        <button onClick={() => { changeDataButtonAction(`users/${controller.authUser.uid}`, {name: temp}, "name"); refreshPage("Name") }} disabled = {isMDisabled} Style={{ color: isMDisabled ? 'red' : 'green' }}> accept </button>
                        <button className="close-modal" onClick={toggleNameModal}>
                            Cancel
                        </button>
                    </div>
                </div>)
            }
            {midNameModal && (
            <div className="modal">
                <div onClick={toggleMidNameModal} className="overlay_modal"></div>
                    <div className="modal-content">
                        <h2> Change Middle Name:</h2>
                        <input placeholder='New Middle Name:' onChange={(e)=>{setTemp(e.target.value); handleModalChange(e.target.value, midName)}}></input>
                        <button onClick={() => { changeDataButtonAction(`users/${controller.authUser.uid}`, {midName: temp}, "midName"); refreshPage("Middle Name") }} disabled = {isMDisabled} Style={{ color: isMDisabled ? 'red' : 'green' }}> accept </button>
                        <button className="close-modal" onClick={toggleMidNameModal}>
                            Cancel
                        </button>
                    </div>
                </div>)
            }
            {lastNameModal && (
            <div className="modal">
                <div onClick={toggleLastNameModal} className="overlay_modal"></div>
                    <div className="modal-content">
                        <h2> Change Last Name:</h2>
                        <input placeholder='New Last Name:' onChange={(e)=>{setTemp(e.target.value); handleModalChange(e.target.value, lastName)}}></input>
                        <button onClick={() => { changeDataButtonAction(`users/${controller.authUser.uid}`, {lastName: temp}, "lastName"); refreshPage("Last Name") }} disabled = {isMDisabled} Style={{ color: isMDisabled ? 'red' : 'green' }}> accept </button>
                        <button className="close-modal" onClick={toggleLastNameModal}>
                            Cancel
                        </button>
                    </div>
                </div>)
            }
            {countryModal && (
            <div className="modal">
                <div onClick={toggleCountryModal} className="overlay_modal"></div>
                    <div className="modal-content">
                        <h2> Change Country:</h2>
                        <div className="Country">
                                {/* <label for="country" id="CountrySelector"></label>  */}
                               
                                <Select styles={{
                                    indicatorSeparator: () => ({ display: "none" }),
                                    indicatorsContainer: () => ({display: "table"}),
                                
                                    
                                    control: (provided, state) => ({
                                    ...provided,
                                    boxShadow: "none",
                                    border: state.isFocused && "none"
                                    }),
                                    menu: (provided, state) => ({
                                    ...provided,
                                    border: "none",
                                    boxShadow: "none"
                                    }),
                                    option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isFocused && "lightgray",
                                    color: state.isFocused && "gray",
                                    border: "none"
                                    })
                                }}id="CountrySelector" placeholder="Select Country" options={options} value={countryView} onChange={handlerCountryChange} />  
                            </div>
                        <button onClick={() => { changeDataButtonAction(`users/${controller.authUser.uid}`, {country: countryView.label}, "country"); refreshPage("Country") }} disabled = {isMDisabled} Style={{ color: isMDisabled ? 'red' : 'green' }}> accept </button>
                        <button className="close-modal" onClick={toggleCountryModal}>
                            Cancel
                        </button>
                    </div>
                </div>)
            }
            {addressModal && (
            <div className="modal">
                <div onClick={toggleAddressModal} className="overlay_modal"></div>
                    <div className="modal-content">
                        <h2> Change Address:</h2>
                        <input placeholder='New Main Address:' onChange={(e)=>{setTemp(e.target.value); handleModalChange(e.target.value, address1)}}></input>
                        <button onClick={() => { changeDataButtonAction(`users/${controller.authUser.uid}`, {address1: temp}, "address"); refreshPage("Address") }} disabled = {isMDisabled} Style={{ color: isMDisabled ? 'red' : 'green' }}> accept </button>
                        <button className="close-modal" onClick={toggleAddressModal}>
                            Cancel
                        </button>
                    </div>
                </div>)
            }
        </div>
    );
};

export default Settings;