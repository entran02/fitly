import database from "./database.ts";
import express from "express";
import { Request, Response } from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import cors from "cors";
import "./types.ts";
import multer from "multer";
import path, { parse } from "path";
import Outfit from "../frontend/src/components/pages/Outfit.tsx";

// set up app
const app = express();
app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

/**
 * Sends a query to the db object
 * @param query the query being passed to db
 * @param values any parameters used in the query
 * @returns rows from the db
 */
async function executeQuery(query: string, values: any[] = []): Promise<any> {
  try {
    const [rows] = await database.query(query, values);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

// Query methods

/**
 * gets all users from the DB
 * @returns User[]
 */
async function getAllUsers(): Promise<User[]> {
  try {
    const [rows] = await database.query("CALL GetAllUsers()");
    return rows[0] as User[];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

async function getUserById(user_id: number): Promise<User | null> {
  try {
    const [results] = await database.query("CALL GetUserById(?)", [user_id]);
    return results[0][0] as User;
  } catch (error) {
    console.error("Error fetching user by ID:", user_id, error);
    throw error;
  }
}

async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const [results] = await database.query("CALL GetUserByUsername(?)", [
      username,
    ]);
    const user = results[0][0];
    return user as User;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
}

async function createUser(username: string, password: string): Promise<void> {
  try {
    await database.query("CALL CreateUser(?, ?, ?)", [username, password, ""]);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function getAllPieces(): Promise<Piece[]> {
  try {
    const [results] = await database.query("CALL GetAllPieces()");
    return results[0] as Piece[];
  } catch (error) {
    console.error("Error fetching all pieces:", error);
    throw error;
  }
}

async function uploadPiece(
  user_id,
  piece_name,
  piece_type,
  color,
  size,
  material,
  image,
  brand,
  style
): Promise<string> {
  try {
    const [results] = await database.query(
      "CALL UploadPiece(?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        piece_name,
        piece_type,
        color,
        size,
        material,
        image,
        brand,
        style,
      ]
    );
    return results[0][0].pieceId;
  } catch (error) {
    console.error("Error uploading piece:", error);
    throw error;
  }
}

async function getWishlistedPieceFromUserId(user_id: string): Promise<Piece[]> {
  try {
    const [results] = await database.query(
      "CALL GetWishlistedPiecesByUserId(?)",
      [user_id]
    );
    return results[0] as Piece[];
  } catch (error) {
    console.error("Error fetching wishlisted pieces for user:", user_id, error);
    throw new Error("Failed to fetch wishlisted pieces");
  }
}

async function addWishlistedPiece(
  userId: string,
  pieceId: string
): Promise<void> {
  try {
    await database.query("CALL AddWishlistedPiece(?, ?)", [userId, pieceId]);
  } catch (error) {
    console.error("Error adding piece to wishlist:", error);
    throw new Error("Failed to add piece to wishlist");
  }
}

async function getPieceByUserIdAndPieceId(
  userId: string,
  pieceId: string
): Promise<Piece | null> {
  try {
    const [results] = await database.query(
      "CALL GetPieceByUserIdAndPieceId(?, ?)",
      [userId, pieceId]
    );
    return results[0][0] as Piece;
  } catch (error) {
    console.error("Error fetching piece by user ID and piece ID:", error);
    throw new Error("Failed to fetch piece");
  }
}

async function searchPieces(params: {
  piece_name?: string;
  piece_type?: string;
  color?: string;
  size?: string;
  brand_name?: string;
  material?: string;
  style_name?: string;
}): Promise<Piece[]> {
  try {
    const [results] = await database.query(
      "CALL SearchPieces(?, ?, ?, ?, ?, ?, ?)",
      [
        params.piece_name || null,
        params.piece_type || null,
        params.color || null,
        params.size || null,
        params.brand_name || null,
        params.material || null,
        params.style_name || null,
      ]
    );
    return results[0];
  } catch (error) {
    console.error("Error searching pieces:", error);
    throw error;
  }
}

async function createOutfit(userId: string, outfitName: string): Promise<void> {
  try {
    await database.query("CALL CreateOutfit(?, ?)", [userId, outfitName]);
  } catch (error) {
    console.error("Error creating outfit:", error);
    throw new Error("Failed to create outfit");
  }
}

async function addPieceToOutfit(
  outfitId: string,
  pieceId: string
): Promise<void> {
  try {
    await database.query("CALL AddPieceToOutfit(?, ?)", [outfitId, pieceId]);
  } catch (error) {
    console.error("Error adding piece to outfit:", error);
    throw new Error("Failed to add piece to outfit");
  }
}

async function getOutfits(userId: string): Promise<Outfit[]> {
  try {
    const [results] = await database.query("CALL GetOutfitsByUserId(?)", [
      userId,
    ]);
    return results as Outfit[];
  } catch (error) {
    console.error("Error fetching outfits for user:", userId, error);
    throw new Error("Failed to fetch outfits");
  }
}

async function getOutfitById(outfitId: string): Promise<Outfit> {
  try {
    const [results] = await database.query("CALL GetOutfitById(?)", [outfitId]);
    return results[0] as Outfit;
  } catch (error) {
    console.error("Error fetching outfit by ID:", outfitId, error);
    throw new Error("Failed to fetch outfit");
  }
}

async function getOutfitPieces(outfitId: string): Promise<Piece[]> {
  try {
    const results = await database.query("CALL GetOutfitPiecesByOutfitId(?)", [
      outfitId,
    ]);
    console.error(JSON.stringify(results));
    return results as Piece[];
  } catch (error) {
    console.error("Error fetching pieces for outfit:", outfitId, error);
    throw new Error("Failed to fetch outfit pieces");
  }
}

/**
 * API Endpoints:
 */
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id);
  if (user) {
    // User found
    res.json(user);
  } else {
    // User not found
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (!user && user === undefined) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  if (user && String(password) === String(user.password)) {
    res.json({ username: user.username, id: user.user_id });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.get(
  "/api/users/username/:username",
  async (req: Request, res: Response) => {
    const user = await getUserByUsername(req.params.username);
    if (user) {
      // User found
      res.json(user);
    } else {
      // User not found
      res.status(404).json({ error: "User not found" });
    }
  }
);

app.post("/api/create/user", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (user?.username === username) {
    res.status(404).json({ error: "Username already exists" });
  } else {
    await createUser(username, password);
    const newUser = await getUserByUsername(username);
    res.json(newUser);
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  const users = await getAllUsers();
  if (users) {
    // User found
    res.json(users);
  } else {
    // User not found
    res.status(404).json({ error: "No users found" });
  }
});

app.get("/api/pieces", async (req: Request, res: Response) => {
  const pieces = await getAllPieces();
  if (pieces) {
    res.json(pieces);
  } else {
    res.status(404).json({ error: "no pieces found" });
  }
});

app.get("/api/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = "./uploads/" + filename;

  res.sendFile(path.resolve(filePath), (err) => {
    if (err) {
      res.status(404).json({ error: "File not found" });
    }
  });
});

app.post(
  "/api/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      console.error("no file uploaded");

      return res.status(400).send("No file uploaded.");
    }
    const {
      user_id,
      piece_name,
      piece_type,
      color,
      size,
      material,
      brand,
      style,
    } = req.body;

    const piece_id = await uploadPiece(
      user_id,
      piece_name,
      piece_type,
      color,
      size,
      material,
      req.file.filename,
      brand,
      style
    );

    await addWishlistedPiece(user_id, piece_id);

    res.json({ message: "Image uploaded successfully" });
  }
);

app.get("/api/users/:userId/wishlist", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const wishlistedPieces = await getWishlistedPieceFromUserId(userId);
    res.json(wishlistedPieces);
  } catch (error) {
    console.error("Error retrieving wishlisted pieces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users/:userId/wishlist", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { pieceId } = req.body;
  console.error("piece id: " + pieceId);
  console.error("userID: " + userId);

  try {
    const wishlistedPiece = await getPieceByUserIdAndPieceId(userId, pieceId);
    if (wishlistedPiece && wishlistedPiece.piece_id === pieceId) {
      console.error(wishlistedPiece);
      console.error("piece added to wishlist already");
      res.status(201).json({ message: "Piece added to wishlist" });
      return;
    }
    await addWishlistedPiece(userId, pieceId);
    res.status(201).json({ message: "Piece added to wishlist" });
  } catch (error) {
    console.error("Error adding piece to wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/search/pieces", async (req: Request, res: Response) => {
  const searchParams = {
    piece_name: req.query.piece_name as string | undefined,
    piece_type: req.query.piece_type as string | undefined,
    color: req.query.color as string | undefined,
    size: req.query.size as string | undefined,
    brand_name: req.query.brand_name as string | undefined,
    material: req.query.material as string | undefined,
    style_name: req.query.style_name as string | undefined,
  };

  try {
    const pieces = await searchPieces(searchParams);
    res.json(pieces);
  } catch (error) {
    res.status(500).json({ error: "Error executing search" });
  }
});

app.delete(
  "/api/users/:userId/pieces/:pieceId",
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const userIdInt = parseInt(userId);
    const pieceId = req.params.pieceId;

    try {
      // Check if the piece belongs to the current user
      const piece = await getPieceByUserIdAndPieceId(userId, pieceId);

      // tests to see if the piece and user IDs are being fetched correctly
      console.log("Fetched Piece:", piece);
      if (piece) {
        console.log(
          "Piece User ID:",
          piece.user_id,
          "Type:",
          typeof piece.user_id
        );
      } else {
        console.log("No piece found for given IDs");
      }
      console.log("Request User ID:", userIdInt, "Type:", typeof userIdInt);

      if (!piece) {
        return res
          .status(404)
          .json({ error: "Piece not found or does not belong to the user" });
      }

      // If the piece belongs to the user, delete it from the database
      if (piece.user_id === userIdInt) {
        // Delete the piece from the database
        const deletePieceQuery = "DELETE FROM piece WHERE piece_id = ?";
        await executeQuery(deletePieceQuery, [pieceId]);
        res.status(200).json({ message: "Piece deleted successfully" });
      } else {
        // If the piece does not belong to the user, remove it from the wishlist
        const deleteWishlistPieceQuery =
          "DELETE FROM wishlisted_pieces WHERE user_id = ? AND piece_id = ?";
        await executeQuery(deleteWishlistPieceQuery, [userId, pieceId]);
        res
          .status(200)
          .json({ message: "Piece removed from wishlist successfully" });
      }
    } catch (error) {
      console.error("Error deleting piece:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// create an outfit
app.post("/api/outfits/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { outfitName } = req.body;
  try {
    const createdOutfit = await createOutfit(userId, outfitName);
    res.status(201).json({ message: "Outfit created" });
  } catch (error) {
    console.error("Error creating outfit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get list of outfits for our user
app.get("/api/outfits/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const outfits = await getOutfits(userId);
    res.status(200).json(outfits);
  } catch (error) {
    console.error("Error getting outfits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get outfit by id
// app.get(
//   "/api/outfits/:outfitId/pieces",
//   async (req: Request, res: Response) => {
//     const outfitId = req.params.outfitId;
//     try {
//       const pieces = await getOutfitPieces("1");
//       res.json(pieces);
//     } catch (error) {
//       console.error("Error getting pieces for outfit:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );

// get outfit pieces by outfit id
app.get(
  "/api/getoutfitpieces/:outfitId",
  async (req: Request, res: Response) => {
    const outfitId = req.params.outfitId;
    console.error("outfit id:" + outfitId);
    try {
      const outfits = await getOutfitPieces(outfitId);
      res.json(outfits);
    } catch (error) {
      console.error("Error getting pieces:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Endpoint to add a piece to an outfit
app.post(
  "/api/outfits/:outfitId/add-piece",
  async (req: Request, res: Response) => {
    const { outfitId } = req.params;
    const { pieceId } = req.body; // Expecting `pieceId` to be in the request body

    try {
      await addPieceToOutfit(outfitId, pieceId); // This function should handle the database operations
      res.status(200).json({ message: "Piece added to outfit successfully" });
    } catch (error) {
      console.error("Error adding piece to outfit:", error);
      res.status(500).json({
        error: "Failed to add piece to outfit",
        details: error.message,
      });
    }
  }
);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
