CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(455) NOT NULL,
    phone_number VARCHAR(455),
    profile VARCHAR(455),
    publicIdFromCloudinary VARCHAR(455) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS EmailVerifyAndForgetPassword (
    email_passwd_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    is_email_verified TINYINT(1) DEFAULT 0, -- boolean
    email_verify_token VARCHAR(455),
    forget_passwd_verify_token VARCHAR(455),
    verifyTokenExpiry TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS AesCredential(
    aes_id INT AUTO_INCREMENT PRIMARY KEY,
    aes_key VARCHAR(255),
    aes_iv VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Password (
    pass_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, 
    pass_title_name VARCHAR(255) NOT NULL,
    icon VARCHAR(455),
    publicIdFromCloudinary VARCHAR(455) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS PasswordDetail (
    pass_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    pass_id INT,
    email VARCHAR(455) NOT NULL,
    password VARCHAR(455) NOT NULL,
    link_website VARCHAR(455),
    short_note VARCHAR(455),
    FOREIGN KEY (pass_id) REFERENCES Password(pass_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CategoriesOfFileManger (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Insert predefined categories only if they don't already exist
INSERT INTO CategoriesOfFileManger (category_id, category_name)
VALUES 
    (1, 'Photos'),
    (2, 'Videos'),
    (3, 'Documents'),
    (4, 'Secret-Note')
ON DUPLICATE KEY UPDATE category_name=VALUES(category_name);

CREATE TABLE IF NOT EXISTS Albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    album_name VARCHAR(255) NOT NULL,
    album_cover_image VARCHAR(455) DEFAULT NULL,
    public_id_from_cloudinary VARCHAR(455) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES CategoriesOfFileManger(category_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    file_name VARCHAR(455) NOT NULL,
    file_url VARCHAR(455) NOT NULL,
    file_extension VARCHAR(100) NOT NULL,
    public_id_from_cloudinary VARCHAR(455) DEFAULT NULL,
    FOREIGN KEY (album_id) REFERENCES Albums(album_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PhoneBook (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- The user who owns this contact
    contact_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    contact_picture_url VARCHAR(455) DEFAULT NULL,
    public_id_from_cloudinary VARCHAR(455) DEFAULT NULL,
    is_in_whatsapp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

