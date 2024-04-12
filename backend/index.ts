import database from './database.ts';
import express from 'express';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());


/**
 * Endpoints:
 */
app.get('/api/users', (req: Request, res: Response) => {
    // Simulating data retrieval from a database
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    // Sending the users data as the response
    res.json(users);
});


// Example API endpoint: POST /api/users
app.post('/api/users', (req: Request, res: Response) => {
    // Extracting the user data from the request body
    const { name, email } = req.body;

    // Simulating user creation in the database
    const newUser = {
        id: 3,
        name,
        email,
    };

    // Sending the created user as the response
    res.status(201).json(newUser);
});


interface User {
    id: number;
    name: string;
    email: string;
};

async function executeQuery(query: string, values: any[] = []): Promise<any> {
    const [rows] = await database.query(query, values);
    return rows;
}

async function getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users';
    const users = await executeQuery(query);
    return users as User[];
}

async function getUserById(userId: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?';
    const users = await executeQuery(query, [userId]);
    return users[0] as User || null;
}

async function createUser(user: User): Promise<void> {
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    await executeQuery(query, [user.name, user.email]);
}


async function main() {
    const users = await getAllUsers();
    console.log('All users:', users);

    const user = await getUserById(1);
    console.log('User by ID:', user);

    const newUser: User = {
        id: 0,
        name: 'John Doe',
        email: 'john@example.com',
    };
    await createUser(newUser);
    console.log('New user created');
}


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
main().catch(console.error);