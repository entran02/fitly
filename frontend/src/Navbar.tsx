import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
function NavBar() {
    const handleClick = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/pieces');
          const data = response.data;
          // Handle the response data
          console.log(data);
        } catch (error) {
          // Handle any errors
          console.error('Error:', error);
        }
      };
    return (
        <nav>
            <button className="btn btn-primary" onClick={handleClick}>
                Pieces
            </button>
        </nav>
    );
}
export default NavBar;