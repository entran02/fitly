import { AuthData } from "../../auth/AuthWrapper.tsx";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const Account = () => {

     const { user } = AuthData();

     return (
          <div className="page">
               <h2>your account</h2>
               <p>username: {user.name}</p>
          </div>
     )
}