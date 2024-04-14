import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper.tsx"
import React from "react";
import axios from 'axios';

export const CreateUser = () => {

     const navigate = useNavigate();
     const { createAccount } = AuthData();
     const [ formData, setFormData ] = useReducer((formData, newItem) => { return ( {...formData, ...newItem} )}, {userName: "", password1: "", password2: ""})
     const [ errorMessage, setErrorMessage ] = useState(null)
     
     const handleCreateAccount = async () => {

          try {
               
               await createAccount(formData.userName, formData.password1, formData.password2);
               navigate("/account")

          } catch (error) {

               setErrorMessage(error)
               
          }
          
     }

     return (
          <div className="page">
               <h2>create new account</h2>
               <div className="inputs">
                    <div className="input">
                         <input value={formData.userName} placeholder='username' onChange={(e) => setFormData({userName: e.target.value}) } type="text"/>
                    </div>
                    <div className="input">
                         <input value={formData.password1} placeholder='password' onChange={(e) => setFormData({password1: e.target.value}) } type="password"/>
                    </div>
                    <div className="input">
                         <input value={formData.password2} placeholder='confirm password' onChange={(e) => setFormData({password2: e.target.value}) } type="password"/>
                    </div>
                    <div className="button">
                         <button className='btn btn-success' onClick={handleCreateAccount}>create account</button>
                    </div>
                    {errorMessage ?
                    <div className="error">{errorMessage}</div>
                    : null }
               </div>
          </div>
     )
}