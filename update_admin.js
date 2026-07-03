const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function updateAdmin() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'goyalfilling'
        });

        const newEmail = 'babloogoyal@gmail.com';
        const newPassword = 'babloo@123';
        const passwordHash = await bcrypt.hash(newPassword, 10);
        
        console.log('Updating Admin user...');
        
        // We update the existing ADMIN user. If there are multiple, this updates the first one, or we can just update where role = 'ADMIN'
        await connection.query(
            `UPDATE users SET email = ?, password_hash = ? WHERE role = 'ADMIN'`,
            [newEmail, passwordHash]
        );

        console.log('Admin updated successfully!');
        await connection.end();
    } catch (err) {
        console.error('Error updating admin:', err);
    }
}

updateAdmin();
