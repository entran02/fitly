import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PieceCard from "../structure/ClothingDisplay.tsx";
import axios from "axios";
import {AuthData} from '../../auth/AuthWrapper.tsx'
import { buttonBaseClasses } from "@mui/material";
import ClothingDisplay from "../structure/ClothingDisplay.tsx";

export const WishlistPieces = () => {
     const [showForm, setShowForm] = useState(false);
     const show = () => setShowForm(true)
     const hide = () => setShowForm(false)
     const [showUpload, setShowUpload] = useState(false);
     const showUploadAgainButton = () => {
          setShowUpload(true)
          hide();
     }
     const hideUploadAgainButton = () => {
          setShowUpload(false)
          show();
          setSubmitted(false);
     }

const { user } = AuthData();

const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    piece_name: '',
    piece_type: '',
    color: '',
    size: '',
    material: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setSubmitted(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
          event.preventDefault();
    if (selectedFile) {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedFile);
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('piece_name', formData.piece_name);
      formDataToSend.append('piece_type', formData.piece_type);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('material', formData.material);

      try {
          //    const response = await axios.post('http://localhost:8000/api/upload', {user_id: formData.user_id, piece_name: formData.piece_name, piece_type: formData.piece_type, color: formData.color, size: formData.size, material: formData.material, file: selectedFile});

          const response = await axios.post('http://localhost:8000/api/upload', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Piece uploaded successfully:', response.data);
          setSubmitted(true);
          showUploadAgainButton();
          setFormData({
    user_id: '',
    piece_name: '',
    piece_type: '',
    color: '',
    size: '',
    material: '',
  })
  fetchPieces();


        // Handle success, such as displaying a success message or updating the UI
      } catch (error) {
        console.error('Error uploading piece:', error);
        setSubmitted(false);

        // Handle error, such as displaying an error message or taking appropriate action
      }
    }
  };

       const [pieces, setPieces] = useState([]);

     useEffect(() => {
          const fetchPieces = async () => {
            try {
            const res = await axios.get(`http://localhost:8000/api/users/${user.id}/wishlist`)
              setPieces(res.data);
            } catch (error) {
              console.error('Error fetching pieces:', error);
              setPieces([]);
            }
          };
          fetchPieces();
        }, []);
        const fetchPieces = async () => {
            try {
            const res = await axios.get(`http://localhost:8000/api/users/${user.id}/wishlist`)
              setPieces(res.data);
            } catch (error) {
              console.error('Error fetching pieces:', error);
              setPieces([]);
            }
          };

  return (
<>
     {showUpload ? <button onClick={hideUploadAgainButton} className="btn btn-success">upload another piece</button> : <form onSubmit={handleSubmit}>
     <ul className="list-group">
          <li>
               <h3>upload a piece!</h3>
               <input type="file" onChange={handleFileChange} onClick={show}/>
          </li>
          { showForm ? <><li>
       <input
            type="text"
            name="piece_name"
            placeholder="Piece Name"
            value={formData.piece_name}
            onChange={handleInputChange}
            required />
  </li><li>
            <input
                 type="text"
                 name="piece_type"
                 placeholder="Piece Type"
                 value={formData.piece_type}
                 onChange={handleInputChange}
                 required />
       </li><li>
            <input
                 type="text"
                 name="color"
                 placeholder="Color"
                 value={formData.color}
                 onChange={handleInputChange}
                 required />
       </li><li>
            <input
                 type="text"
                 name="size"
                 placeholder="Size"
                 value={formData.size}
                 onChange={handleInputChange}
                 required />
       </li><li>
            <input
                 type="text"
                 name="material"
                 placeholder="Material"
                 value={formData.material}
                 onChange={handleInputChange}
                 required />
       </li></> : null }

     </ul>
     <button className='btn btn-success' type="submit" disabled={!selectedFile} onClick={hide}>
          Upload
     </button>
     
     
     { submitted ? <h5>Piece was uploaded!</h5> : <></>}
    </form>}
    
    <ClothingDisplay pieces={pieces} showDeleteButton={true} />
      
</>
   
  );
}

