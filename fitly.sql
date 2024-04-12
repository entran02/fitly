USE fitly;

DROP TABLE IF EXISTS Outfit_pieces;
DROP TABLE IF EXISTS Piece_style;
DROP TABLE IF EXISTS Wishlisted_pieces;
DROP TABLE IF EXISTS Wishlisted_outfits;
DROP TABLE IF EXISTS Piece;
DROP TABLE IF EXISTS Outfit;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Style;
DROP TABLE IF EXISTS Brand;

CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    SizePreference VARCHAR(50)
);

CREATE TABLE Outfit (
    OutfitID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Favorite BOOLEAN,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Brand (
    BrandID INT PRIMARY KEY AUTO_INCREMENT,
    BrandName VARCHAR(255)
);

CREATE TABLE Piece (
    PieceID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    PieceName VARCHAR(255),
    PieceType VARCHAR(50),
    Color VARCHAR(50),
    Size VARCHAR(50),
    Material VARCHAR(100),
    Image VARCHAR(255),
    Favorite BOOLEAN,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Outfit_pieces (
    OutfitID INT,
    PieceID INT,
    PRIMARY KEY (OutfitID, PieceID),
    FOREIGN KEY (OutfitID) REFERENCES Outfit(OutfitID),
    FOREIGN KEY (PieceID) REFERENCES Piece(PieceID) ON DELETE CASCADE
);

CREATE TABLE Brand_pieces (
    BrandID INT,
    PieceID INT,
    PRIMARY KEY (BrandID, PieceID),
    FOREIGN KEY (BrandID) REFERENCES Brand(BrandID),
    FOREIGN KEY (PieceID) REFERENCES Piece(PieceID) ON DELETE CASCADE
);

CREATE TABLE Style (
    StyleID INT PRIMARY KEY AUTO_INCREMENT,
    StyleName VARCHAR(255)
);

CREATE TABLE Piece_style (
    StyleID INT,
    PieceID INT,
    PRIMARY KEY (StyleID, PieceID),
    FOREIGN KEY (StyleID) REFERENCES Style(StyleID),
    FOREIGN KEY (PieceID) REFERENCES Piece(PieceID) ON DELETE CASCADE
);

CREATE TABLE Wishlisted_pieces (
    UserID INT,
    PieceID INT,
    PRIMARY KEY (UserID, PieceID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (PieceID) REFERENCES Piece(PieceID) ON DELETE CASCADE
);

CREATE TABLE Wishlisted_outfits (
    UserID INT,
    OutfitID INT,
    PRIMARY KEY (UserID, OutfitID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (OutfitID) REFERENCES Outfit(OutfitID) ON DELETE CASCADE
);
