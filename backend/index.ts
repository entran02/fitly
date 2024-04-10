import database from './database.ts';

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

main().catch(console.error);