import { About } from "../pages/About.tsx"
import { Account } from "../pages/Account.tsx"
import { Home } from "../pages/Home.tsx"
import { Login } from "../pages/Login.tsx"
import { Private } from "../pages/Private.tsx"
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const nav = [
     { path:     "/",         name: "Home",        element: <Home />,       isMenu: true,     isPrivate: true  },
     { path:     "/about",    name: "About",       element: <About />,      isMenu: true,     isPrivate: true  },
     { path:     "/login",    name: "Login",       element: <Login />,      isMenu: false,    isPrivate: false  },
     { path:     "/private",  name: "Private",     element: <Private />,    isMenu: true,     isPrivate: true  },
     { path:     "/account",  name: "Account",     element: <Account />,    isMenu: true,     isPrivate: true  },
];
export default nav;