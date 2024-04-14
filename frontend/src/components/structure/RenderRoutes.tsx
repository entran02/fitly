import { Link, Route, Routes } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper.tsx";
import React from 'react';
import nav from "./navigation.tsx";
import "bootstrap/dist/css/bootstrap.min.css";

const RenderRoutes = () => {

        const { user } = AuthData();
        
        return (
             <Routes>
             { nav.map((r, i) => {
                  if (r.isPrivate && user.isAuthenticated) {
                       return <Route key={i} path={r.path} element={r.element}/>
                  } else if (!r.isPrivate) {
                       return <Route key={i} path={r.path} element={r.element}/>
                  } else return false
             })}
             
             </Routes>
        )
};
export default RenderRoutes;