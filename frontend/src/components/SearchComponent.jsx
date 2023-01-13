import React from 'react';
import './SearchComponent.css'

function SearchComponent({ handleSubmit, searchTerm, handleChange, error, searchByGenreHandler }) {
  const errorStyles = {
    'textAlign': 'center'
  };

  function genreSearchWrapper() {
    searchByGenreHandler(prev => !prev);
  }

  return (
    <form onSubmit={handleSubmit} className="search--form">
      <div className="search-bar-and-button">
        <input id="search-input" className='form-control'
          type="search"
          placeholder="Search a Book Title"
          value={searchTerm}
          onChange={handleChange}
        />

        <button type="submit" className='btn btn-primary' style={{ 'borderRadius': 8 }}>
          Search
        </button>
        <button type="button" className='btn btn-light' style={{ 'borderRadius': 8, 'padding': '1px 5px' }} onClick={genreSearchWrapper}>
          Search By Genre
        </button>
      </div>
      {error && <div className="errorMsg alert alert-danger" style={errorStyles}>{error}</div>}
    </form>
  );
}

export default SearchComponent;