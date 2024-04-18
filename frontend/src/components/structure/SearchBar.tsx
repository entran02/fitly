import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchParams: {
    piece_name?: string,
    piece_type?: string,
    color?: string,
    size?: string,
    brand_name?: string,
    material?: string,
    style?: string,
  }) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    piece_name: '',
    piece_type: '',
    color: '',
    size: '',
    brand_name: '',
    material: '',
    style: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        name="piece_name"
        value={searchParams.piece_name}
        onChange={handleChange}
        placeholder="Piece Name"
      />
      <input
        type="text"
        name="piece_type"
        value={searchParams.piece_type}
        onChange={handleChange}
        placeholder="Piece Type"
      />
      <input
        type="text"
        name="color"
        value={searchParams.color}
        onChange={handleChange}
        placeholder="Color"
      />
      <input
        type="text"
        name="size"
        value={searchParams.size}
        onChange={handleChange}
        placeholder="Size"
      />
      <input
        type="text"
        name="brand_name"
        value={searchParams.brand_name}
        onChange={handleChange}
        placeholder="Brand"
      />
      <input
        type="text"
        name="material"
        value={searchParams.material}
        onChange={handleChange}
        placeholder="Material"
      />
      <input
        type="text"
        name="style"
        value={searchParams.style}
        onChange={handleChange}
        placeholder="Style"
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
};
