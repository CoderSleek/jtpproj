import React from 'react';
import './SearchComponent.css'

/**
 * This function generates the SearchComponent which includes error msg, search bar, search button and search by genre button
 * 
 * handleSubmit is setState function to call and retrieve search data from api on search by button
 * searchTerm is the value in searchbox, maintained by the parent App component
 * hanle change is a setState function to change the searchTerm when use types in searchbox
 * error is a String component is managed by this function, it displays any error on the webpage
 * searchByGenreHandler is a setState function that sets the search type to true if searchbygenre or false if string search
 * @param {Object} { handleSubmit, searchTerm, handleChange, error, searchByGenreHandler } props passed by the parent
 * @returns {JSX component}
 */
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