import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import {AuthData} from '../../auth/AuthWrapper.tsx'

interface Piece {
    piece_id: number;
    piece_name: string;
    size: string;
    user_id: number;
    image: string;
}

interface PieceCardProps {
  pieces: Piece[];
  showDeleteButton?: boolean;
}

const PieceCard: React.FC<PieceCardProps> = ({ pieces, showDeleteButton = false }) => {
    const { user } = AuthData();

    async function favoritePiece(piece_id) {
        try {
            const res = await axios.post(`http://localhost:8000/api/users/${user.id}/wishlist`, { pieceId: piece_id })
        } catch (error) {
            console.error("error: " +  error);
        }
    }

    async function deletePiece(piece_id) {
      try {
          const response = await axios.delete(`http://localhost:8000/api/users/${user.id}/pieces/${piece_id}`);
          console.log(response.data);
          alert('Piece deleted successfully');
      } catch (error) {
          console.error("Error deleting the piece: " + error);
          alert('Failed to delete the piece');
      }
  }
  
    // const [img, setImg] = useState(null);

    // async function getImg(img) {
    //     const image = await axios.post(`http://localhost:8000/api/uploads/${img}`);
    //     setImg(image);
    // }
  React.useEffect(() => {
    console.log('PieceCard receiving pieces:', pieces);
}, [pieces]);

    // function favorite(piece_id) {
    //     const f = await axios.
    // }
  return (
    <Grid container spacing={2}>
      {pieces.map((piece: Piece) => (
        <Grid item xs={12} sm={6} md={4} key={piece.piece_id}>
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {piece.user_id}
                </Avatar>
              }
              action={
                // <div onClick={favorite(piece.piece_id)}>
                <button className='btn' aria-label="favorite" onClick={() => favoritePiece(piece.piece_id)}>
                  <FavoriteIcon />
                </button>
                // </div>
              }
              title={piece.piece_name}
              subheader={piece.size}
            />
            <CardMedia component="img" height="194" image={`http://localhost:8000/api/uploads/${piece.image}`} alt={piece.piece_name} />
            <CardActions disableSpacing>
              {showDeleteButton && (
                <IconButton aria-label="remove" onClick={() => deletePiece(piece.piece_id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default PieceCard;