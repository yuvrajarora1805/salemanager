const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'goyalfilling'
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_url VARCHAR(500) NOT NULL,
      caption VARCHAR(255) DEFAULT '',
      category ENUM('Station','Team','Events','Services') DEFAULT 'Station',
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('gallery_images table created successfully');
  await conn.end();
})();
