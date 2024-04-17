import database from './database.ts';
import express from 'express';
import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import cors from "cors";
import './types.ts';
import multer from 'multer';
import path from 'path';
import Outfit from '../frontend/src/components/pages/Outfit.tsx';

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
    /* try {
        const [rows] = await database.query('CALL GetAllUsers()');
        return rows as User[];
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    } */
}

async function getUserById(user_id: number): Promise<User | null> {
    const query = 'SELECT * FROM user WHERE user_id = ?';
    const users = await executeQuery(query, [user_id]);
    return users as User;
    /* if (!Number.isInteger(user_id)) {
        throw new Error('Invalid user ID. User ID must be an integer.');
    }

    try {
        const [results] = await database.query('CALL GetUserById(?)', [user_id]);
        const rows = results[0];

        if (rows.length === 0) {
            console.log('No user found for ID:', user_id);
            return null;
        }

        return rows[0] as User;

    } catch (error) {
        console.error('Error fetching user by ID:', user_id, error);
        throw error;
    } */
}

async function getUserByUsername(username: string): Promise<User | null> {
    try {
        const [results] = await database.query('CALL GetUserByUsername(?)', [username]);
        const user = results[0][0];
        return user as User;
    } catch (error) {
        console.error('Error fetching user by username:', error);
        throw error;
    }
}

async function createUser(username: string, password: string): Promise<void> {
    try {
        await database.query('CALL CreateUser(?, ?, ?)', [username, password, '']);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function getAllPieces(): Promise<Piece[]> {
    try {
        const [results] = await database.query('CALL GetAllPieces()');
        return results[0] as Piece[];
    } catch (error) {
        console.error('Error fetching all pieces:', error);
        throw error;
    }
}

async function uploadPiece(user_id, piece_name, piece_type, color, size, material, image): Promise<string> {
    try {
        const [results] = await database.query('CALL UploadPiece(?, ?, ?, ?, ?, ?, ?)', [user_id, piece_name, piece_type, color, size, material, image]);
        return results[0][0].pieceId;
    } catch (error) {
        console.error('Error uploading piece:', error);
        throw error;
    }
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
    /* try {
        const [results] = await database.query('CALL GetWishlistedPiecesByUserId(?)', [user_id]);
        return results[0] as Piece[];
    } catch (error) {
        console.error('Error fetching wishlisted pieces for user:', user_id, error);
        throw new Error('Failed to fetch wishlisted pieces');
    } */
}

async function addWishlistedPiece(userId: string, pieceId: string): Promise<void> {
    const query = 'INSERT INTO wishlisted_pieces (user_id, piece_id) VALUES (?, ?);';
  await executeQuery(query, [userId, pieceId]);
    /* try {
        await database.query('CALL AddWishlistedPiece(?, ?)', [userId, pieceId]);
    } catch (error) {
        console.error('Error adding piece to wishlist:', error);
        throw new Error('Failed to add piece to wishlist');
    } */
}

async function getPieceByUserIdAndPieceId(userId: string, pieceId: string): Promise<Piece | null> {
    const query = 'SELECT * FROM wishlisted_pieces WHERE user_id = ? AND piece_id = ?;';
  const result = await executeQuery(query, [userId, pieceId]);
  return result[0] as Piece | null;
    /* try {
        const [results] = await database.query('CALL GetPieceByUserIdAndPieceId(?, ?)', [userId, pieceId]);
        return results[0] as Piece;
    } catch (error) {
        console.error('Error fetching piece by user ID and piece ID:', error);
        throw new Error('Failed to fetch piece');
    } */
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

async function createOutfit(userId: string, outfitName: string): Promise<void>{
    try {
        await database.query('CALL CreateOutfit(?, ?)', [userId, outfitName]);
    } catch (error) {
        console.error('Error creating outfit:', error);
        throw new Error('Failed to create outfit');
    }
}

async function addPieceToOutfit(outfitId: string, pieceId: string): Promise<void>{
    try {
        await database.query('CALL AddPieceToOutfit(?, ?)', [outfitId, pieceId]);
    } catch (error) {
        console.error('Error adding piece to outfit:', error);
        throw new Error('Failed to add piece to outfit');
    }
}

async function getOutfits(userId: string): Promise<Outfit[]> {
    try {
        const [results] = await database.query('CALL GetOutfitsByUserId(?)', [userId]);
        return results as Outfit[];
    } catch (error) {
        console.error('Error fetching outfits for user:', userId, error);
        throw new Error('Failed to fetch outfits');
    }
}

async function getOutfitById(outfitId: string): Promise<Outfit> {
    try {
        const [results] = await database.query('CALL GetOutfitById(?)', [outfitId]);
        return results[0] as Outfit;
    } catch (error) {
        console.error('Error fetching outfit by ID:', outfitId, error);
        throw new Error('Failed to fetch outfit');
    }
}

async function getOutfitPieces(outfitId: string): Promise<Piece[]> {
    try {
        const [results] = await database.query('CALL GetOutfitPiecesByOutfitId(?)', [outfitId]);
        return results as Piece[];
    } catch (error) {
        console.error('Error fetching pieces for outfit:', outfitId, error);
        throw new Error('Failed to fetch outfit pieces');
    }
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

// create an outfit
app.post('/api/outfits/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { outfitName } = req.body;
  try {
    const createdOutfit = await createOutfit(userId, outfitName);
    res.status(201).json({ message: 'Outfit created' });
  } catch (error) {
    console.error('Error creating outfit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get list of outfits for our user
app.get('/api/outfits/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const outfits = await getOutfits(userId);
        res.status(201).json({ message: 'Outfit created' });
    } catch (error) {
        console.error('Error getting outfits:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// get outfit by id 
app.get('/api/outfitbyid', async (req: Request, res: Response) => {
    const { outfitId } = req.body;
    try {
        const outfit = await getOutfitById(outfitId);
        res.json(outfit);
    } catch (error) {
        console.error('Error getting outfit:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// get outfit pieces by outfit id
app.get('/api/getoutfitpieces', async (req: Request, res: Response) => {
    const { outfitId } = req.body;
    try {
        const outfits = await getOutfitPieces(outfitId);
        res.json(outfits);
    } catch (error) {
        console.error('Error getting pieces:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

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