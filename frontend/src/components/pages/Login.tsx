import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper.tsx"
import React from "react";
import axios from 'axios';

export const Login = () => {

     const navigate = useNavigate();
     const { login } = AuthData();
     const [ formData, setFormData ] = useReducer((formData, newItem) => { return ( {...formData, ...newItem} )}, {userName: "", password: ""})
     const [ errorMessage, setErrorMessage ] = useState(null)
     
     const handleLogin = async () => {

          try {
               
               await login(formData.userName, formData.password)
               navigate("/account")

          } catch (error) {

               setErrorMessage(error)
               
          }
          
     }

     return (
          <div className="page">
               <h2>login page</h2>
               <div className="inputs">
                    <div className="input">
                         <input value={formData.userName} placeholder='username' onChange={(e) => setFormData({userName: e.target.value}) } type="text"/>
                    </div>
                    <div className="input">
                         <input value={formData.password} placeholder='password' onChange={(e) => setFormData({password: e.target.value}) } type="password"/>
                    </div>
                    <div className="button">
                         <button className='btn btn-success' onClick={handleLogin}>log in</button>
                    </div>
                    {errorMessage ?
                    <div className="error">{errorMessage}</div>
                    : null }
               </div>
          </div>
     )
}