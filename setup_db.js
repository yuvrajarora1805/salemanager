const mysql = require('mysql2/promise');
const fs = require('fs');

async function setup() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
        });

        console.log('Creating database...');
        await connection.query('CREATE DATABASE IF NOT EXISTS goyalfilling;');
        await connection.query('USE goyalfilling;');

        console.log('Reading schema.sql...');
        const schema = fs.readFileSync('schema.sql', 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim() !== '');

        console.log('Executing statements...');
        for (let stmt of statements) {
            await connection.query(stmt);
        }

        console.log('Database setup complete!');
        await connection.end();
    } catch (err) {
        console.error('Error setting up database:', err);
    }
}

setup();
