CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'SALESMAN') DEFAULT 'SALESMAN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    address VARCHAR(500),
    status ENUM('PENDING', 'APPROVED') DEFAULT 'PENDING',
    added_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS fuel_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fuel_type ENUM('PETROL', 'DIESEL') UNIQUE NOT NULL,
    price_per_liter DECIMAL(10, 2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    salesman_id INT NOT NULL,
    fuel_type ENUM('PETROL', 'DIESEL') NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (salesman_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default fuel rates if not exists
INSERT IGNORE INTO fuel_rates (fuel_type, price_per_liter) VALUES ('PETROL', 0.00);
INSERT IGNORE INTO fuel_rates (fuel_type, price_per_liter) VALUES ('DIESEL', 0.00);

-- Insert default admin user if not exists
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES ('Admin', 'babloogoyal@gmail.com', '$2b$10$fGqKTr18.2hXRbY8qycUhevmSxRCnLizDTq1Wgj9Zzg1ggdArF1G6', 'ADMIN');
