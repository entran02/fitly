import database from './database.ts';
import express from 'express';
import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import cors from "cors";
import './types.ts';
import multer from 'multer';

// set up app
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });


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
    console.error(pieces);
    return pieces as Piece[];
}

async function uploadPiece(user_id, piece_name, piece_type, color, size, material, image): Promise<void> {
    const query = 'INSERT INTO piece (user_id, piece_name, piece_type, color, size, material, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await executeQuery(query, [user_id, piece_name, piece_type, color, size, material, image])
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

    if (String(password) === String(user?.password)) {
        res.json(user);
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

app.post('/upload', upload.single('image'), (req, res) => {
  const image = req.file;
    uploadPiece(req.user_id, req.piece_name, req.piece_type, req.color, req.size, req.material, image);
    
    res.json({ message: 'Image uploaded successfully' });
});


// test data

// testing to make sure that a piece gets uploaded
const test1 = await getUserByUsername('test1');
if (!test1) {
    console.error(await createUser("test1", "test1"))
}
console.error(await uploadPiece(1, 'shirt', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
console.error(await uploadPiece(1, 'shirt', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
console.error(await uploadPiece(1, 'shirt', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
console.error(await uploadPiece(1, 'shirt', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
console.error(await uploadPiece(1, 'shirt', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
console.error(await uploadPiece(1, 'shirt', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
console.error(await uploadPiece(1, 'shirt', 'shirt', 'red', 'm', 'cotton', 'https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4='));
const pieces = await getAllPieces();
console.error(pieces);



app.listen(8000, () => {
    console.log('Server is running on port 8000');
});