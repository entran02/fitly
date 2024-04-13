/**
 * Type declarations go here 
 */
interface User {
    user_id: number;
    username: string;
    password: string;
    sizePreference: string;
};

interface Piece {
    piece_id: number;
    user_id: number;
    piece_name: string;
    piece_type: string;
    color: string;
    size: string;
    brand_id: number;
    material: string;
    image: string;
};

