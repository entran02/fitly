import { WishlistPieces } from "../pages/WishlistPieces.tsx"
import { Account } from "../pages/Account.tsx"
import { Home } from "../pages/Home.tsx"
import { Login } from "../pages/Login.tsx"
import { WishlistOutfits } from "../pages/WishlistOutfits.tsx"
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const nav = [
     { path:     "/",         name: "home",        element: <Home />,                isMenu: true,     isPrivate: true  },
     { path:     "/wishlist/pieces", name: "my pieces",    element: <WishlistPieces />,      isMenu: true,     isPrivate: true  },
     { path:     "/wishlist/outfits",  name: "my outfits",     element: <WishlistOutfits />,             isMenu: true,     isPrivate: true  },
     
     { path:     "/login",    name: "login",       element: <Login />,               isMenu: false,    isPrivate: false  },
     { path:     "/account",  name: "account",     element: <Account />,             isMenu: true,     isPrivate: true  },
];
export default nav;