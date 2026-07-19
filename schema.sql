CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'SALESMAN') DEFAULT 'SALESMAN',
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

CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255) DEFAULT '',
    category ENUM('Station', 'Team', 'Events', 'Services') DEFAULT 'Station',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES ('station_name', 'Goyal Filling Station');
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES ('operating_hours', '6:00 AM - 11:00 PM');
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES ('contact_phone', '+91 9876543210');
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES ('marquee_text', 'Welcome to Goyal Filling Station - Nayara Energy. Get the best quality fuel!');
