import database from './database.ts';
import express from 'express';
import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import cors from "cors";
import 'types.ts';

// set up app
const app = express();
app.use(cors());
app.use(express.json());


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

async function createUser(user: User): Promise<void> {
    const query = 'INSERT INTO user (username, password, size_preference) VALUES (?, ?, ?)';
    await executeQuery(query, [user.user_id, user.password, user.sizePreference]);
}

async function getAllPieces(): Promise<Piece[]> {
    const query = 'SELECT * FROM piece';
    const pieces = await executeQuery(query);
    console.error(pieces);
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

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});