const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'goyalfilling'
        });

        const passwordHash = await bcrypt.hash('admin123', 10);
        
        console.log('Inserting default Admin user...');
        await connection.query(
            `INSERT IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
            ['Admin User', 'admin@example.com', passwordHash, 'ADMIN']
        );

        console.log('Inserting default Salesman user...');
        const salesmanHash = await bcrypt.hash('sales123', 10);
        await connection.query(
            `INSERT IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
            ['Salesman User', 'sales@example.com', salesmanHash, 'SALESMAN']
        );

        console.log('Seed complete!');
        await connection.end();
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seed();
