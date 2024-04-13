USE fitly;

DROP TABLE IF EXISTS outfit_pieces;
DROP TABLE IF EXISTS piece_style;
DROP TABLE IF EXISTS wishlisted_pieces;
DROP TABLE IF EXISTS wishlisted_outifts;
DROP TABLE IF EXISTS piece;
DROP TABLE IF EXISTS outfit;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS style;
DROP TABLE IF EXISTS brand;

CREATE TABLE user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    size_preference VARCHAR(50)
);

CREATE TABLE outfit (
    outfit_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL
);

CREATE TABLE brand (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(255)
);

CREATE TABLE piece (
    piece_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    piece_name VARCHAR(255),
    piece_type VARCHAR(50),
    color VARCHAR(50),
    size VARCHAR(50),
    brand_id INT,
    material VARCHAR(100),
    image VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE, 
    FOREIGN KEY (brand_id) REFERENCES brand(brand_id) ON DELETE SET NULL
);

CREATE TABLE outfit_pieces (
    outfit_id INT,
    piece_id INT,
    PRIMARY KEY (outfit_id, piece_id),
    FOREIGN KEY (outfit_id) REFERENCES outfit(outfit_id) ON DELETE CASCADE,
    FOREIGN KEY (piece_id) REFERENCES piece(piece_id) ON DELETE CASCADE
);

CREATE TABLE style (
    style_id INT PRIMARY KEY AUTO_INCREMENT,
    style_name VARCHAR(255)
);

CREATE TABLE piece_style (
    style_id INT,
    piece_id INT,
    PRIMARY KEY (style_id, piece_id),
    FOREIGN KEY (style_id) REFERENCES style(style_id) ON DELETE CASCADE,
    FOREIGN KEY (piece_id) REFERENCES piece(piece_id) ON DELETE CASCADE
);

CREATE TABLE wishlisted_pieces (
    user_id INT,
    piece_id INT,
    PRIMARY KEY (user_id, piece_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (piece_id) REFERENCES piece(piece_id) ON DELETE CASCADE
);

CREATE TABLE wishlisted_outifts (
    user_id INT,
    outfit_id INT,
    PRIMARY KEY (user_id, outfit_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (outfit_id) REFERENCES outfit(outfit_id) ON DELETE CASCADE
);
