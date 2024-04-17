-- PROCEDURES
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

--
DELIMITER $$

CREATE PROCEDURE SearchPieces(
    IN _piece_name VARCHAR(255),
    IN _piece_type VARCHAR(255),
    IN _color VARCHAR(255),
    IN _size VARCHAR(255),
    IN _brand_name VARCHAR(255),
    IN _material VARCHAR(255)
)
BEGIN
    SET @sql = 'SELECT p.*, b.brand_name FROM piece p LEFT JOIN brand b ON p.brand_id = b.brand_id WHERE 1=1';

    IF _piece_name IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND p.piece_name LIKE ', CONCAT('\'%', _piece_name, '%\''));
    END IF;

    IF _piece_type IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND p.piece_type LIKE ', CONCAT('\'%', _piece_type, '%\''));
    END IF;

    IF _color IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND p.color LIKE ', CONCAT('\'%', _color, '%\''));
    END IF;

    IF _size IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND p.size LIKE ', CONCAT('\'%', _size, '%\''));
    END IF;

    IF _brand_name IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND b.brand_name LIKE ', CONCAT('\'%', _brand_name, '%\''));
    END IF;

    IF _material IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND p.material LIKE ', CONCAT('\'%', _material, '%\''));
    END IF;

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

-- TRIGGERS
-- ensures outfit pieces are deleted when a piece is deleted
DELIMITER $$
CREATE TRIGGER BeforeDeletePiece
BEFORE DELETE ON piece FOR EACH ROW
BEGIN
  DELETE FROM outfit_pieces WHERE piece_id = OLD.piece_id;
END$$
DELIMITER ;

-- log piece deletion
CREATE TABLE deletion_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    piece_id INT,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER LogDeletePiece
AFTER DELETE ON piece FOR EACH ROW
BEGIN
  INSERT INTO deletion_log (piece_id) VALUES (OLD.piece_id);
END$$
DELIMITER ;

-- EVENTS
SET GLOBAL event_scheduler = ON;

-- cleans up brands that are not assigned to any pieces at all weekly
DELIMITER $$
CREATE EVENT CleanUpBrands
ON SCHEDULE EVERY 1 WEEK STARTS '2024-04-20 00:00:00'
DO
  DELETE FROM brand WHERE brand_id NOT IN (SELECT DISTINCT brand_id FROM piece WHERE brand_id IS NOT NULL);
END$$
DELIMITER ;

-- cleans duplicate outfits every week
DELIMITER $$
CREATE EVENT CleanUpDuplicateOutfitsByUserAndPieces
ON SCHEDULE EVERY 1 DAY STARTS '2024-04-20 00:00:00'
DO
BEGIN
    -- temp table to check outfits that arent with same user and pieces
    CREATE TEMPORARY TABLE IF NOT EXISTS TempUniqueOutfits AS
        SELECT MIN(o.outfit_id) AS keep_id, o.user_id, o.outfit_name,
               GROUP_CONCAT(p.piece_id ORDER BY p.piece_id) AS pieces_signature
        FROM outfit o
        JOIN outfit_pieces op ON o.outfit_id = op.outfit_id
        JOIN piece p ON op.piece_id = p.piece_id
        GROUP BY o.user_id, o.outfit_name, pieces_signature;

    -- delete all non unique outfits
    DELETE FROM outfit
    WHERE outfit_id NOT IN (SELECT keep_id FROM TempUniqueOutfits);

    DROP TEMPORARY TABLE IF EXISTS TempUniqueOutfits;
END$$
DELIMITER ;







