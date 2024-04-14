
import { Link, Route, Routes } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper.tsx";
import React from 'react';
import nav from "./navigation.tsx";
import "bootstrap/dist/css/bootstrap.min.css";

const RenderMenu = () => {
   
        const { user, logout } = AuthData()
   
        const MenuItem = ({r}) => {
             return (
               <li className="nav-item">
                    <Link className="nav-link" to={r.path}>{r.name}</Link>
               </li>
             )
        }
          return (
               <nav className="navbar navbar-expand bg-light">
      <ul className="navbar-nav">
          <li className="nav-item">
               <Link className="nav-link" to='/'>fitly</Link>
          </li>
        {nav.map((r, i) => {
          if (!r.isPrivate && r.isMenu) {
            return <MenuItem key={i} r={r} />;
          } else if (user.isAuthenticated && r.isMenu) {
            return <MenuItem key={i} r={r} />;
          } else {
            return false;
          }
        })}
        {user.isAuthenticated ? (
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={logout}>
              log out
            </Link>
          </li>
        ) : (
          <li className="nav-item">
            <Link className="nav-link" to="login">
              log in
            </Link>
          </li>
        )}
        {user.isAuthenticated ? (<></>) : (
          <li className="nav-item">
               <Link className="nav-link" to="createuser">
                    create account
               </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default RenderMenu;