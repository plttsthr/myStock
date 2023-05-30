import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { InputMask } from 'primereact/inputmask';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import upload from '../Icons/upload.png';
import erroricon from '../Icons/error.png';
import profilepicture from '../Icons/profilepicture.png';
import plus from '../Icons/plus.png';
import { useForm } from "react-hook-form";
import {auth, storage, db} from "../Model/firebase"; 
import { ref, uploadBytes } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import "../Style/LoginRegister.css";
import swal from 'sweetalert';
import Terms from '../View/Terms';

function timeout(delay) {
  return new Promise( res => setTimeout(res, delay) );
}

const FillOutYourInformation = ({controller, phoneNumber, countryCode}) => {
    // Hooks with user registry information
    const [prefix, setPrefix] = useState("");
    const [name, setName] = useState("");
    const [midName, setMidName] = useState("");
    const [suffix, setSuffix] = useState("");
    const [lastName, setLastName] = useState("");
    const [secondLastName, setSecondLastName] = useState("");
    const [countryView, setCountryView] = useState("");
    const [country, setCountry] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [identificationType, setIDFormat] = useState("");
    const [idvalue,setIDValue] = useState("");

    const [image, setImage] = useState(null);   // Profile picture
    const [imagePath, setImagePath] = useState(null); // path to use for storing profile picture
    const [ImgIsUploaded, setImgIsUploaded] = useState(false); // status of upload for profile picture

    const [idFile, setIdFile] = useState(""); // ID picture
    const [idFilePath, setIdFilePath] = useState(null); // path to use for storing id picture
    const [IdIsUploaded, setIdIsUploaded] = useState(false);

    const [typeFile,setTypeFile] = useState("");
    const [userAdded, setUser] = useState(false);

   // Object containg info after filling out form 
    const payload = { prefix: prefix,
      name: name,
      midName: midName,
      lastName: lastName,
      secondLastName: secondLastName,
      suffix: suffix,
      countryCode: countryCode,
      phonenumber: phoneNumber,
      country: country,
      zipCode: zipCode,
      address1: address1,
      address2: address2,
      idType: identificationType,
      id: idvalue
    };

    //const { handleSubmit, formState } = useForm();
    const options = useMemo(() => countryList().getData(), []);

    const cancel = () => { 
        swal("Your Information was deleted","You cannot revert this.","error");
        setPrefix(""); setName(""); setMidName(""); setSuffix("");
        setLastName(""); setSecondLastName(""); 
        setCountry(""); setZipCode("");
        setAddress1(""); setAddress2(""); setIDFormat(""); setIDValue("");
        setImage(""); setImgIsUploaded(false); setIdIsUploaded(false); setIdFile("");
        
      }
    
    const idMask = (e) => {
      let result;
      if(identificationType === "id"){
        result = "99-9999-9999"
      }else if(identificationType ==="ssn"){
        result = "999-99-9999"
      }else if (identificationType === "dimex"){
        result = "999999999999"
      }
      else if (identificationType === "passport"){
        result = "****************************************************************************************************"
      }
      else if (identificationType === "other"){
        result = "99999999999999999999999"
      }
      else{
        result = " "
      }
      return result;
    };
    
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
    }

    const handlerCountryChange = countryView => {
      setCountryView(countryView);
      setCountry(countryView['label']);

    }
      
    function handleIDChange(e) {
      if (e.target.files && e.target.files[0]) {
        let reader = new FileReader();
        let name = e.target.files[0].name;
  
        setIdFilePath(e.target.files[0]);
  
        reader.onload = function (e) {
          setIdFile(e.target.result);
          setIdIsUploaded(true);
        };
  
        reader.readAsDataURL(e.target.files[0]);
      }
    }

    let terms = document.getElementById("Terms");

    function toggleTerms(){  
        
      terms.classList.toggle("open-terms");  

    }

    async function signUpFormAction(e){
      e.preventDefault();

      if ( await controller.addMember(imagePath, idFilePath, "users", payload) ){

        // Make default account in dollars
        controller.addAccount("$");
        swal("User signup completed","Go ahead and signin to start navigating MyStockApp.","success");
        await timeout(2000);
        window.location.reload(false);

      }
      else {
        swal("User signup failed","Try again.","error");
      }
      
    }

    return(

        <form onSubmit={signUpFormAction} id="fill-out-form"> 
                  <h1>Fill out Your Information</h1>
                            <div className="UploadImage">
                              <div className="profile-pic">
                              

                                { ImgIsUploaded ? (
                                  <>
                                    <label htmlFor="inputImg"> <img id="picture" src={image} draggable={false} alt="uploaded-img" /></label>
                                    <div className="CameraIcon"> 
                                      <img src={erroricon} id="close" alt="plus" onClick={() => {setImgIsUploaded(false); setImage(null)}} ></img> 
                                    </div>
                                  </>) 
                                  : 
                                  (
                                  <>
                                      <label htmlFor="inputImg"> <img src={profilepicture} id="picture" alt="profilepicture" ></img> </label> 
                                      <div className="CameraIcon"> <label htmlFor="inputImg"> <img src={plus} id="plus" alt="plus" ></img> </label>     </div>  
                                      <input type="file"   accept="image/jpg" id="inputImg" onChange={handleImageChange}/>
                                  </>
                                  ) }
                              
                              </div>
                            </div>

                          <div className=" NameHolder">
                    
                            <div id="Prefix-Box"> 
                                <select id="prefix" name="Prefix" class="form-control" value={prefix} onChange={(e)=>setPrefix(e.target.value)} >
                                      <option>Prefix</option>
                                      <option value="Mr." Selected>Mr.</option>
                                      <option value="Mrs." Selected>Mrs.</option>
                                      <option value="Ms" Selected>Ms</option>
                                      <option value="Miss" Selected>Miss</option>
                                      <option value="Mx" Selected>Mx</option>
                                      <option value="Sir" Selected>Sir</option>
                                      <option value="Dr." Selected>Dr.</option>
                                      <option value="Dame" Selected>Dame</option>
                                      <option value="Lord" Selected>Lord</option>
                                      <option value="Lady" Selected>Lady</option>
                                      <option value="Cllr" Selected>Cllr</option>
                                      <option value="President" Selected>President</option>
                                      <option value="Father" Selected>Father</option>
                                      <option value="Gentlemen" Selected>Gentlemen</option>
                                      <option value="Madam" Selected>Madam</option>
                                      <option value="Professor" Selected>Professor</option>
                                      <option value="Er." Selected>Er.</option>
                                  </select>

                              </div> 

                              <div id="Name-Box"> 
                                  <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                                  <input placeholder="Name" required value={name} onChange={(e)=>setName(e.target.value)} />

                              </div>
                              
                              <div id="MiddleName-Box"> 
                              <input type="text" placeholder="Middle Name" value={midName} onChange={(e)=>setMidName(e.target.value)}/>
                              </div>
                                
                            </div>
                      
                            <div className="LastName">
                                  <div id="LastName-Box">
                                      <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                                      <input type="text" placeholder="Last Name" required value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                                  </div>
                                
                                  <input type="text" placeholder="Second Last Name" value={secondLastName} onChange={(e)=>setSecondLastName(e.target.value)}/>

                                  <div id="Suffix-Box"> 
                                    <select id="suffix" name="Suffix" class="form-control" value={suffix} onChange={(e)=>setSuffix(e.target.value)} >
                                        <option>Suffix</option>
                                        <option value="Sr." Selected>Sr.</option>
                                        <option value="Jr." Selected>Jr.</option>
                                        <option value="PhD" Selected>PhD</option>
                                        <option value="MSW" Selected>MSW</option>
                                        <option value="II" Selected>II</option>
                                        <option value="III" Selected>III</option>
                                        <option value="IV" Selected>IV</option>
                                    </select>

                                  </div> 
                            </div>

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
                                
                              
                                <input type="text" placeholder="Zip Code" value={zipCode}  onChange={(e) => setZipCode(e.target.value)} id="ZipCode" />
                            </div>

                            <div className="Address-1-Box"> 
                                <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                                <input type="text" placeholder="Address 1" required value={address1}  onChange={(e) => setAddress1(e.target.value)} name="Address1"/>
                            </div>
                           
                            <input type="text" placeholder="Address 2" value={address2} onChange={(e) => setAddress2(e.target.value)} name="Address2"/>

                            <div className="ID">
                                  <span style={{ color: 'red', fontWeight: 'bold' }}>*</span> 
                                  <label for="identification" id="IDSelector"></label>      
                                    <select id="id" name="id" class="id-control" required value={identificationType} onChange={(e) => setIDFormat(e.target.value)}>
                                        <option>Identification</option>
                                        <option value="id" Selected>ID</option>
                                        <option value="ssn" Selected>SSN</option>
                                        <option value="dimex" Selected>DIMEX</option>
                                        <option value="passport" Selected>Passport</option>
                                        <option value="other" Selected>Other</option>
                                    </select>

                                  <div className="Id-box">
                                    <InputMask value={idvalue} onChange={(e) => setIDValue(e.target.value)} mask={idMask()}  placeholder={idMask()}> </InputMask>
                                  </div>

                                  {IdIsUploaded ? 
                                  (<>
                                  
                                  <label htmlFor="inputID" style={{fontSize: '13px', paddingRight: '6px', color: 'rgb(110, 110, 110)'}}> Discard File</label>
                                  <div className="IDIcon"> 
                                      <img src={erroricon} id="close" alt="plus" onClick={() => {setIdIsUploaded(false); setIdFile(null)}} ></img> 
                                  </div>
                                  </>)

                                  :
                                  (<>
                                  
                                  <label htmlFor="inputID" style={{fontSize: '13px', paddingRight: '6px', color: 'rgb(110, 110, 110)'}}> Choose a file </label> 
                                  <div className="IDIcon"> <label htmlFor="inputID"> <img src={upload} id="upload" alt="upload" ></img> </label> </div>  
                                  <input type="file"  required accept="image/jpg" id="inputID" onChange={handleIDChange}/>

                                  </>)}  
                                  
                            </div>
                            <div className="Terms-Box">       
                            <input type="checkbox" required id='check'/> <h5 style={{textDecoration:'none'}}>Yes, I agree to the </h5> <h4> . </h4> <h5 onClick={() => toggleTerms()}> Terms and Conditions</h5>
                            </div>

                            <div className="TermsConditions" id="Terms">
                                <button type="button" id="ButtonTerms" onClick={() => toggleTerms()}>X</button>

                                <h1> Terms and Conditions</h1>
                              

                              <Terms></Terms>
                             

                            </div>
            <ul>
            <uli>
                <button type="submit" >REGISTER</button>
                <button type="button" onClick={cancel}>CANCEL</button>
            </uli>
            </ul>
        

        </form>
    )
};

export default FillOutYourInformation;