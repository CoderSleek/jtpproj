import React from 'react';
import './SearchComponent.css'

function SearchComponent({handleSubmit, searchTerm, handleChange, error}) {
  const errorStyles = {
    'textAlign': 'center'
  };

  return (
    <form onSubmit={handleSubmit} className="search--form">
      <div className="search-bar-and-button">
        <input id="search-input" className='form-control'
          type="search"
          placeholder="Search a Book Title" 
          value={searchTerm}
          onChange={handleChange}
        />

      <button type="submit" className='btn btn-primary' style={{'borderRadius': 8}}>
        Search
      </button>
      </div>
      {error && <div className="errorMsg alert alert-danger" style={errorStyles}>{error}</div>}
    </form>
  );
}

export default SearchComponent;

// {error && <div>
//   <div 
//     style={{
//       position: 'fixed',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       backgroundColor: 'white',
//       padding: '1rem',
//       border: '1px solid black',
//     }}
//   >
//       {error}
//   </div>
//   <div
//     style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       width: '100vw',
//       height: '100vh',
//       backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     }}
//   ></div>
// </div>}