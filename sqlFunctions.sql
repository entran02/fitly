-- GetAllUsers
DELIMITER $$

CREATE PROCEDURE GetAllUsers()
BEGIN
    SELECT * FROM user;
END$$

DELIMITER ;

-- GetUserById(uid)
DELIMITER $$

CREATE PROCEDURE GetUserById(IN uid INT)
BEGIN
    SELECT * FROM user WHERE user_id = uid;
END$$

DELIMITER ;

-- GetUserByUsername(_username)
DELIMITER $$

CREATE PROCEDURE GetUserByUsername(IN _username VARCHAR(255))
BEGIN
    SELECT * FROM user WHERE username = _username;
END$$

DELIMITER ;

-- CreateUser
DELIMITER $$

CREATE PROCEDURE CreateUser(IN _username VARCHAR(255), IN _password VARCHAR(255), IN _size_preference VARCHAR(255))
BEGIN
    INSERT INTO user (username, password, size_preference) VALUES (_username, _password, _size_preference);
END$$

DELIMITER ;

-- GetAllPieces()
DELIMITER $$

CREATE PROCEDURE GetAllPieces()
BEGIN
    SELECT * FROM piece;
END$$

DELIMITER ;

-- UploadPiece
DELIMITER $$

CREATE PROCEDURE UploadPiece(IN _user_id INT, IN _piece_name VARCHAR(255), IN _piece_type VARCHAR(255), IN _color VARCHAR(255), IN _size VARCHAR(255), IN _material VARCHAR(255), IN _image VARCHAR(255))
BEGIN
    INSERT INTO piece (user_id, piece_name, piece_type, color, size, material, image) VALUES (_user_id, _piece_name, _piece_type, _color, _size, _material, _image);
    SELECT LAST_INSERT_ID() AS pieceId;
END$$

DELIMITER ;

--
DELIMITER $$

CREATE PROCEDURE GetWishlistedPiecesByUserId(IN _user_id VARCHAR(255))
BEGIN
    SELECT p.*
    FROM piece p
    INNER JOIN wishlisted_pieces wp ON p.piece_id = wp.piece_id
    WHERE wp.user_id = _user_id;
END$$

DELIMITER ;

--
DELIMITER $$

CREATE PROCEDURE AddWishlistedPiece(IN _user_id VARCHAR(255), IN _piece_id VARCHAR(255))
BEGIN
    INSERT INTO wishlisted_pieces (user_id, piece_id) VALUES (_user_id, _piece_id);
END$$

DELIMITER ;

--
DELIMITER $$

CREATE PROCEDURE GetPieceByUserIdAndPieceId(IN _user_id VARCHAR(255), IN _piece_id VARCHAR(255))
BEGIN
    SELECT * FROM wishlisted_pieces WHERE user_id = _user_id AND piece_id = _piece_id;
END$$

DELIMITER ;

--
DELIMITER $$

CREATE PROCEDURE CreateOutfit(IN _user_id VARCHAR(255), IN _outfit_name VARCHAR(255))
BEGIN
    INSERT INTO outfit (user_id, outfit_name) VALUES (_user_id, _outfit_name);
END$$

DELIMITER ;

--
DELIMITER $$

CREATE PROCEDURE AddPieceToOutfit(IN _outfit_id VARCHAR(255), IN _piece_id VARCHAR(255))
BEGIN
    INSERT INTO outfit_pieces (outfit_id, piece_id) VALUES (_outfit_id, _piece_id);
END$$

DELIMITER ;

--
DELIMITER $$

CREATE PROCEDURE GetOutfitsByUserId(IN _user_id VARCHAR(255))
BEGIN
    SELECT * FROM outfit WHERE user_id = _user_id;
END$$

DELIMITER ;

--
DELIMITER $$

CREATE PROCEDURE GetOutfitById(IN _outfit_id VARCHAR(255))
BEGIN
    SELECT * FROM outfit WHERE outfit_id = _outfit_id;
END$$

DELIMITER ;
	
--
DELIMITER $$

CREATE PROCEDURE GetOutfitPiecesByOutfitId(IN _outfit_id VARCHAR(255))
BEGIN
    SELECT p.*
    FROM piece AS p
    JOIN outfit_pieces AS op ON p.piece_id = op.piece_id
    WHERE op.outfit_id = _outfit_id;
END$$

DELIMITER ;


