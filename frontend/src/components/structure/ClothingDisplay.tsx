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

interface Piece {
    piece_id: number;
    piece_name: string;
    size: string;
    user_id: number;
    image: string;
}
export default function PieceCard() {
  const [pieces, setPieces] = React.useState([]);

  React.useEffect(() => {
    async function getAllPieces() {
      try {
        const response = await axios.get('http://localhost:8000/api/pieces');
        const data = response.data;
        if (data) {
          setPieces(data);
        }
      } catch (error) {
        console.error('Error fetching pieces:', error);
      }
    }

    getAllPieces();
  }, []);

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
                <IconButton aria-label="favorite">
                  <FavoriteIcon />
                </IconButton>
              }
              title={piece.piece_name}
              subheader={piece.size}
            />
            <CardMedia component="img" height="194" image={piece.image} alt={piece.piece_name} />
            <CardActions disableSpacing>
              <IconButton aria-label="remove">
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}