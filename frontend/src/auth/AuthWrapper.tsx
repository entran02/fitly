import { createContext, useContext, useState } from "react"
import RenderHeader from "../components/structure/Header.tsx";
import RenderRoutes from "../components/structure/RenderRoutes.tsx";
import RenderMenu from "../components/structure/RenderMenu.tsx";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthContext = createContext({user: {name: '', isAuthenticated: false}, login: (username, password) => {}, logout: () => {}});
export const AuthData = () => useContext(AuthContext);


export const AuthWrapper = () => {

     const [ user, setUser ] = useState({name: "", isAuthenticated: false})

     const login = (userName, password) => {

          // Make a call to the authentication API to check the username
          
          return new Promise((resolve, reject) => {

               if (password === "password") {
                    setUser({name: userName, isAuthenticated: true})
                    resolve("success")
               } else {
                    reject("Incorrect password")
               }
          })
          
          
     }
     const logout = () => {

          setUser({...user, isAuthenticated: false})
     }


     return (
          
               <AuthContext.Provider value={{user, login, logout}}>
                    <>
                         <RenderMenu />
                         <RenderRoutes />
                    </>
                    
               </AuthContext.Provider>
          
     )

}