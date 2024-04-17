import React, { useEffect, useState, useContext } from "react";
import { AuthData } from "../../auth/AuthWrapper.tsx";
import axios from "axios";
import OutfitDisplay from "../structure/OutfitDisplay.tsx";

export const WishlistOutfits = () => {
     const { user } = AuthData();
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            const fetchOutfits = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/outfits/${user.id}`); // Using template literals to include the userId
                    console.log(response.data[0]);
                    setOutfits(response.data[0]); // Assuming the server returns the array of outfits directly
                } catch (error) {
                    console.error("Failed to fetch wishlist outfits:", error);
                    // Optionally handle errors, e.g., show a user-friendly message
                }
            };

            fetchOutfits();
        }
    }, [user]); // Depend on user to re-fetch when user changes

    return (
        <div className="page">
            <h2>Wishlist Outfits</h2>
            <OutfitDisplay outfits={outfits} />
        </div>
    );
}

export default WishlistOutfits;
