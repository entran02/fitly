import database from './database.ts';
import express from 'express';
import { Request, Response } from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

interface User {
    userID: number;
    username: string;
    password: string;
    sizePreference: string;
};

async function executeQuery(query: string, values: any[] = []): Promise<any> {
    try {
        const [rows] = await database.query(query, values);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

/**
 * Query Methods:
 */

async function getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM user';
    const users = await executeQuery(query);
    return users as User[];
}

async function getUserById(userId: number): Promise<User | null> {
    const query = 'SELECT * FROM user WHERE user_id = ?';
    const users = await executeQuery(query, [userId]);
    return users[0] as User || null;
}

async function createUser(user: User): Promise<void> {
    const query = 'INSERT INTO user (username, password, size_preference) VALUES (?, ?, ?)';
    await executeQuery(query, [user.userID, user.password, user.sizePreference]);
}


app.get('/api/users', (req: Request, res: Response) => {
    const users = getAllUsers();
    res.json(users);
});

app.get('/api/users')


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});