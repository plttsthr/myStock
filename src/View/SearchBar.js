import React, { useState } from "react";
import "../Style/LoginRegister.css";
import search from '../Icons/search.png';

const SearchBar= ({setSearch, handleSearchValue}) => {

    const [searchInput, setSearchInput] = useState('')

    let handleChange = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchInput(lowerCase);
        handleSearchValue(e.target.value);
        enableSearch();
    };

    const enableSearch = () => {
        setSearch(true);
      };
      
      


    return(

        <div className="Search-Bar"> 
            <input id="SearchBar" type="text" placeholder="Search Stocks" onChange={handleChange} value={searchInput}/>    
            <button id="Glass"> <img src={search} id="glass-home" alt="profpicture" ></img> </button>
        </div>

    )  
}


export default SearchBar;