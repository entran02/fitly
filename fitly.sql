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
    outfit_name VARCHAR(50),
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


-- insertions for test data:
INSERT INTO user (username, password) VALUES ('test', 'test');

-- insert brand:

INSERT INTO brand (brand_name) VALUES ('Oakley');
INSERT INTO brand (brand_name) VALUES ('Diesel');
INSERT INTO brand (brand_name) VALUES ('Stone Island');
INSERT INTO brand (brand_name) VALUES ('Salomon');


-- insert pieces: 
-- oakley bag 
INSERT INTO piece (user_id, piece_name, piece_type, color, size, brand_id, material, image)
VALUES (
    (SELECT user_id FROM user WHERE username = 'test'),  -- This assumes the user 'test' has been created
    'Cross body bag',  -- Example piece name
    'Bag',  -- Example piece type
    'Black',  -- Example color
    'One Size',  -- Example size
    (SELECT brand_id FROM brand WHERE brand_name = 'Oakley'),  -- Retrieves brand_id for Oakley
    'Polyester',  -- Example material
    'bag.jpeg'  -- Example image path
);

-- insert hat:

INSERT INTO piece (user_id, piece_name, piece_type, color, size, brand_id, material, image)
VALUES (
    (SELECT user_id FROM user WHERE username = 'test'),  -- This assumes the user 'test' has been created
    'Cool hat',  -- Example piece name
    'Hat',  -- Example piece type
    'Black',  -- Example color
    'One Size',  -- Example size
    NULL,
    'Fur',  -- Example material
    'hat.jpeg'  -- Example image path
);

-- insert jacket:
INSERT INTO piece (user_id, piece_name, piece_type, color, size, brand_id, material, image)
VALUES (
    (SELECT user_id FROM user WHERE username = 'test'),  -- This assumes the user 'test' has been created
    'Leather Jacket',  -- Example piece name
    'Jacket',  -- Example piece type
    'Black',  -- Example color
    'L',  -- Example size
    NULL,
    'Leather',  -- Example material
    'jacket.jpeg'  -- Example image path
);

-- insert pants:

INSERT INTO piece (user_id, piece_name, piece_type, color, size, brand_id, material, image)
VALUES (
    (SELECT user_id FROM user WHERE username = 'test'),  -- This assumes the user 'test' has been created
    'Zipper Pants',  -- Example piece name
    'Pants',  -- Example piece type
    'Gray',  -- Example color
    'Medium',  -- Example size
    (SELECT brand_id FROM brand WHERE brand_name = 'Stone Island'),  -- Retrieves brand_id for Oakley
    'Cotton',  -- Example material
    'pants.jpeg'  -- Example image path
);

-- insert shirt:

INSERT INTO piece (user_id, piece_name, piece_type, color, size, brand_id, material, image)
VALUES (
    (SELECT user_id FROM user WHERE username = 'test'),  -- This assumes the user 'test' has been created
    'Diesel Crop Top',  -- Example piece name
    'Shirt',  -- Example piece type
    'Gray',  -- Example color
    'Small',  -- Example size
    (SELECT brand_id FROM brand WHERE brand_name = 'Diesel'),  -- Retrieves brand_id for Oakley
    'Cotton',  -- Example material
    'shirt.jpeg'  -- Example image path
);
-- insert shoes:

-- insert pants:

INSERT INTO piece (user_id, piece_name, piece_type, color, size, brand_id, material, image)
VALUES (
    (SELECT user_id FROM user WHERE username = 'test'),  -- This assumes the user 'test' has been created
    'Cool Shoes',  -- Example piece name
    'Shoes',  -- Example piece type
    'White',  -- Example color
    'Medium',  -- Example size
    (SELECT brand_id FROM brand WHERE brand_name = 'Salomon'),  -- Retrieves brand_id for Oakley
    'Synthetic',  -- Example material
    'shoes.jpeg'  -- Example image path
);