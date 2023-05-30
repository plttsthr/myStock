import React, { useState } from "react";
import swal from 'sweetalert';

const AddAccount = ({controller}) => {

    const [currency, setCurrency] = useState("");

    async function addAccount(){
        if(await controller.addAccount(currency)){
            swal("Account Created Succesfully","","success");
        }

    }


return(

    <div className="AnchorPaneAddAccount">
            
                <div className="CreateAccount">
                    <h1 classname="p"> Create Account</h1>
                        <select placeholder="From Account" className="AccountSelector" value={currency}  onChange={(e)=>setCurrency(e.target.value)}>
                            <option selected> Select Currency </option>
                            <option value="$" Selected>Dollars $ </option>
                            <option value="¢" Selected>Colón ¢ </option>
                            <option value="€" Selected>Euro € </option>
                            <option value="¥" Selected>Yuan ¥ </option>
                        </select>

                        <button type="button" id="ButtonHome" onClick={() => addAccount()}>Add Account</button>
                </div>

             
    </div>
);
}
export default AddAccount;