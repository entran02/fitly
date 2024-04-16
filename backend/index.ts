import database from './database.ts';
import express from 'express';
import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import cors from "cors";
import './types.ts';
import multer from 'multer';
import path, { parse } from 'path';

// set up app
const app = express();
app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
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
        console.error('Error executing query:', error);
        throw error;
    }
}

// Query methods

/**
 * gets all users from the DB
 * @returns User[]
 */
async function getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM user';
    const users = await executeQuery(query);
    return users as User[];
}

async function getUserById(user_id: number): Promise<User | null> {
    const query = 'SELECT * FROM user WHERE user_id = ?';
    const users = await executeQuery(query, [user_id]);
    return users as User;
}

async function getUserByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM user WHERE username = ?';
    const user = await executeQuery(query, [username]);
    return user[0] as User;
}

async function createUser(username: string, password: string): Promise<void> {
    const query = 'INSERT INTO user (username, password, size_preference) VALUES (?, ?, ?)';
    await executeQuery(query, [username, password, '']);
}

async function getAllPieces(): Promise<Piece[]> {
    const query = 'SELECT * FROM piece';
    const pieces = await executeQuery(query);
    return pieces as Piece[];
}

async function uploadPiece(user_id, piece_name, piece_type, color, size, material, image): Promise<string> {
    const query = 'INSERT INTO piece (user_id, piece_name, piece_type, color, size, material, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const result = await executeQuery(query, [user_id, piece_name, piece_type, color, size, material, image])
    const pieceId = result.insertId;
    return String(pieceId);
}


async function getWishlistedPieceFromUserId(user_id: string): Promise<Piece[]> {
    const query = `
    SELECT p.*
    FROM piece p
    INNER JOIN wishlisted_pieces wp ON p.piece_id = wp.piece_id
    WHERE wp.user_id = ?;
    `;
    const pieces = await executeQuery(query, [user_id]);
    return pieces as Piece[];
}

async function addWishlistedPiece(userId: string, pieceId: string): Promise<void> {
  const query = 'INSERT INTO wishlisted_pieces (user_id, piece_id) VALUES (?, ?);';
  await executeQuery(query, [userId, pieceId]);
}

async function getPieceByUserIdAndPieceId(userId: string, pieceId: string): Promise<Piece | null> {
  const query = 'SELECT * FROM wishlisted_pieces WHERE user_id = ? AND piece_id = ?;';
  const result = await executeQuery(query, [userId, pieceId]);
  return result[0] as Piece | null;
}

async function searchPieces(params: { piece_name?: string, piece_type?: string, color?: string, size?: string, brand_name?: string, material?: string }): Promise<Piece[]> {
    let query = `
        SELECT p.*, b.brand_name FROM piece p
        LEFT JOIN brand b ON p.brand_id = b.brand_id
        WHERE TRUE`;
    let values: string[] = [];

    if (params.piece_name) {
        query += ' AND p.piece_name LIKE ?';
        values.push(`%${params.piece_name}%`);
    }
    if (params.piece_type) {
        query += ' AND p.piece_type LIKE ?';
        values.push(`%${params.piece_type}%`);
    }
    if (params.color) {
        query += ' AND p.color LIKE ?';
        values.push(`%${params.color}%`);
    }
    if (params.size) {
        query += ' AND p.size LIKE ?';
        values.push(`%${params.size}%`);
    }
    if (params.brand_name) {
        query += ' AND b.brand_name LIKE ?';
        values.push(`%${params.brand_name}%`);
    }
    if (params.material) {
        query += ' AND p.material LIKE ?';
        values.push(`%${params.material}%`);
    }

    const pieces = await executeQuery(query, values);
    return pieces as Piece[];
}


/**
 * API Endpoints:
 */
app.get('/api/users/:id', async (req: Request, res: Response) => {
    const user = await getUserById(req.params.id);
    if (user) {
        // User found
        res.json(user);
      } else {
        // User not found
        res.status(404).json({ error: 'User not found' });
    }
});

app.post('/api/login', async (req: Request, res: Response) => {

    const { username, password } = req.body;
    const user = await getUserByUsername(username);        
    if (!user && user === undefined) {

        res.status(401).json({ error: 'Invalid username or password' });
        return;
    }

    if (user && String(password) === String(user.password)) {
        res.json({username: user.username, id: user.user_id});
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.get('/api/users/username/:username', async (req: Request, res: Response) => {
    const user = await getUserByUsername(req.params.username);
    if (user) {
        // User found
        res.json(user);
      } else {
        // User not found
        res.status(404).json({ error: 'User not found' });
    }
});

app.post('/api/create/user', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (user?.username === username) {
        res.status(404).json({ error: 'Username already exists' });
    } else {
        await createUser(username, password);
        const newUser = await getUserByUsername(username);
        res.json(newUser);
    }
});

app.get('/api/users', async (req: Request, res: Response) => {
    const users = await getAllUsers();
    if (users) {
        // User found
        res.json(users);
      } else {
        // User not found
        res.status(404).json({ error: 'No users found' });
    }
});



app.get('/api/pieces', async (req: Request, res: Response) => {
    const pieces = await getAllPieces();
    if (pieces) {
        res.json(pieces);
    } else {
        res.status(404).json({ error: 'no pieces found' });
    }
});

app.get('/api/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = './uploads/' + filename;

  res.sendFile(path.resolve(filePath), (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

app.post('/api/upload', upload.single('image'), async (req: Request, res: Response) => {
    if (!req.file) {
            console.error('no file uploaded')

    return res.status(400).send('No file uploaded.');
    
  }
    const { user_id, piece_name, piece_type, color, size, material } = req.body;

    const piece_id = await uploadPiece(user_id, piece_name, piece_type, color, size, material, req.file.filename);
    
    await addWishlistedPiece(user_id, piece_id);
    
    res.json({ message: 'Image uploaded successfully' });
});

app.get('/api/users/:userId/wishlist', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const wishlistedPieces = await getWishlistedPieceFromUserId(userId);
    res.json(wishlistedPieces);
  } catch (error) {
    console.error('Error retrieving wishlisted pieces:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users/:userId/wishlist', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { pieceId } = req.body;
  console.error('piece id: ' + pieceId)
  console.error('userID: ' + userId)

  try {
    const wishlistedPiece = await getPieceByUserIdAndPieceId(userId, pieceId);
    if (wishlistedPiece && wishlistedPiece.piece_id === pieceId) {
        console.error(wishlistedPiece)
        console.error('piece added to wishlist already')
        res.status(201).json({ message: 'Piece added to wishlist' });
        return;
    }
    await addWishlistedPiece(userId, pieceId);
    res.status(201).json({ message: 'Piece added to wishlist' });
  } catch (error) {
    console.error('Error adding piece to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/search/pieces', async (req: Request, res: Response) => {
    // Collect search parameters from the query string
    const searchParams = {
        piece_name: req.query.piece_name as string | undefined,
        piece_type: req.query.piece_type as string | undefined,
        color: req.query.color as string | undefined,
        size: req.query.size as string | undefined,
        brand_name: req.query.brand_name as string | undefined,
        material: req.query.material as string | undefined,
    };

    try {
        const pieces = await searchPieces(searchParams);
        res.json(pieces);
    } catch (error) {
        res.status(500).json({ error: 'Error executing search' });
    }
});

app.delete('/api/users/:userId/pieces/:pieceId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userIdInt = parseInt(userId);
  const pieceId = req.params.pieceId;

  try {
    // Check if the piece belongs to the current user
    const piece = await getPieceByUserIdAndPieceId(userId, pieceId);

    // Tests to see if the piece and user IDs are being fetched correctly
    console.log('Fetched Piece:', piece);
    if (piece) {
        console.log('Piece User ID:', piece.user_id, 'Type:', typeof piece.user_id);
    } else {
        console.log('No piece found for given IDs');
    }
    console.log('Request User ID:', userIdInt, 'Type:', typeof userIdInt);

    if (!piece) {
      return res.status(404).json({ error: 'Piece not found or does not belong to the user' });
    }

    // If the piece belongs to the user, delete it from the database
    if (piece.user_id === userIdInt) {
      // Delete the piece from the database
      const deletePieceQuery = 'DELETE FROM piece WHERE piece_id = ?';
      await executeQuery(deletePieceQuery, [pieceId]);
      res.status(200).json({ message: 'Piece deleted successfully' });
    } else {
      // If the piece does not belong to the user, remove it from the wishlist
      const deleteWishlistPieceQuery = 'DELETE FROM wishlisted_pieces WHERE user_id = ? AND piece_id = ?';
      await executeQuery(deleteWishlistPieceQuery, [userId, pieceId]);
      res.status(200).json({ message: 'Piece removed from wishlist successfully' });
    }
  } catch (error) {
    console.error('Error deleting piece:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// test data

// testing to make sure that a piece gets uploaded
const test1 = await getUserByUsername('test1');
if (!test1) {
    console.error(await createUser("test1", "test1"))
}
console.error(await uploadPiece(1, 'shirt1', 'shirt', 'red', 'm', 'cotton', 'image-1713169388442-544573682.webp'));
console.error(await uploadPiece(1, 'shirt1', 'shirt', 'red', 'm', 'cotton', 'image-1713169388442-544573682.webp'));
// console.error(await uploadPiece(1, 'shirt2', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
// console.error(await uploadPiece(1, 'shirt3', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
// console.error(await uploadPiece(1, 'shirt4', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
// console.error(await uploadPiece(1, 'shirt5', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
// console.error(await uploadPiece(1, 'shirt6', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
// const pieces = await getAllPieces();
// console.error(pieces);



app.listen(8000, () => {
    console.log('Server is running on port 8000');
});