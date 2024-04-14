import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PieceCard from "../structure/ClothingDisplay.tsx";

export const WishlistPieces = () => {

     return (
          <div className="page">
               <h2>wishlist pieces</h2>
               <button className="btn btn-success">upload new piece</button>
          </div>
     )
}