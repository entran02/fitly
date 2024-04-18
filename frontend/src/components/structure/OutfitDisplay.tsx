import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios, { formToJSON } from "axios";
import { AuthData } from "../../auth/AuthWrapper.tsx";

interface Piece {
  piece_id: number;
  piece_name: string;
  size: string;
  user_id: number;
  image: string;
}

interface Outfit {
  outfit_id: number;
  outfit_name: string;
  pieces?: Piece[];
}

interface OutfitCardProps {
  outfits: Outfit[];
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfits }) => {
  const [newOutfitName, setNewOutfitName] = useState("");
  const [availablePieces, setAvailablePieces] = useState<Piece[]>([]);
  const [updatedOutfits, setUpdatedOutfits] = useState(outfits);
  const { user } = AuthData();

  useEffect(() => {
    const fetchPieces = async () => {
      const response = await axios.get("http://localhost:8000/api/pieces");
      setAvailablePieces(response.data);
    };
    fetchPieces();
  }, []);

  useEffect(() => {
    const fetchPiecesForOutfits = async () => {
      const updatedOutfits = await Promise.all(
        outfits.map(async (outfit) => {
          console.error("outfit id: " + outfit.outfit_id);
          try {
            const response = await axios.get(
              `http://localhost:8000/api/getoutfitpieces/${outfit.outfit_id}`
            );
            return { ...outfit, pieces: response.data[0][0] };
          } catch (error) {
            console.error(
              "Error fetching pieces for outfit:",
              outfit.outfit_id,
              error
            );
            return { ...outfit, pieces: [] };
          }
        })
      );
      setUpdatedOutfits(updatedOutfits);
    };

    if (outfits.length > 0) {
      fetchPiecesForOutfits();
    }
  }, [outfits]);

  const handleCreateOutfit = async () => {
    if (user && newOutfitName.trim() !== "") {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/outfits/${user.id}`,
          {
            outfitName: newOutfitName,
          }
        );
        console.log(response.data.message);
        setNewOutfitName("");
      } catch (error) {
        console.error("Error creating outfit:", error);
        alert("Failed to create outfit"); 
      }
    }
  };

  const addPieceToOutfit = async (outfitId: number, pieceId: number) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/outfits/${outfitId}/add-piece`,
        {
          pieceId: pieceId,
        }
      );
      console.log(response.data);
      alert("Piece added successfully!");
    } catch (error) {
      console.error("Error adding piece to outfit:", error);
      alert("Failed to add piece to outfit");
    }
  };

  return (
    <div>
      <TextField
        label="New Outfit Name"
        variant="outlined"
        value={newOutfitName}
        onChange={(e) => setNewOutfitName(e.target.value)}
        size="small"
      />
      <Button onClick={handleCreateOutfit} variant="contained" color="primary">
        Create Outfit
      </Button>
      <Grid container spacing={2}>
        {updatedOutfits.map((outfit: Outfit) => (
          <Grid item xs={12} sm={6} md={4} key={outfit.outfit_id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader title={outfit.outfit_name} />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Pieces in this outfit:
                  <ul>
                    {outfit.pieces &&
                      outfit.pieces.map((piece) => (
                        <li key={piece.piece_id}>{piece.piece_name}</li>
                      ))}
                    {(!outfit.pieces || outfit.pieces.length === 0) && (
                      <li>No pieces found</li>
                    )}
                  </ul>
                  <FormControl fullWidth size="small">
                    <InputLabel id="piece-select-label">Add Piece</InputLabel>
                    <Select
                      labelId="piece-select-label"
                      label="Add Piece"
                      onChange={(e) =>
                        addPieceToOutfit(
                          outfit.outfit_id,
                          Number(e.target.value)
                        )
                      }
                    >
                      {availablePieces.map((piece) => (
                        <MenuItem key={piece.piece_id} value={piece.piece_id}>
                          {piece.piece_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default OutfitCard;
