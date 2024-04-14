import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PieceCard from "../structure/ClothingDisplay.tsx";
import { SearchBar } from "../structure/SearchBar.tsx";
import axios from "axios";

export const Home = () => {
     const [pieces, setPieces] = useState([]);

     useEffect(() => {
          const fetchAllPieces = async () => {
            try {
              const response = await axios.get('http://localhost:8000/api/pieces');
              setPieces(response.data);
            } catch (error) {
              console.error('Error fetching pieces:', error);
              setPieces([]);
            }
          };
          fetchAllPieces();
        }, []);

     const fetchSearchResults = async (searchParams) => {
          try{
               // Construct the query parameters object dynamically based on searchParams
               const response = await axios.get('http://localhost:8000/api/search/pieces', {
               params: searchParams
               });
               setPieces(response.data);
          } catch (error) {
               console.error("There was an error fetching the search results: ", error);
               setPieces([]);
          }
     };

     return (
          <div className="page">
               <h2>home page</h2>
               <SearchBar onSearch={fetchSearchResults} />
               {
               pieces.length > 0 ? (<PieceCard pieces={pieces} />) : 
               (<p>No pieces found.</p>)
               }
          </div>
     )
}