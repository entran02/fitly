import { AuthData } from "../../auth/AuthWrapper.tsx";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const Account = () => {

     const { user } = AuthData();

     return (
          <div className="page">
               <h2>Your Account</h2>
               <p>Username: {user.name}</p>
          </div>
     )
}