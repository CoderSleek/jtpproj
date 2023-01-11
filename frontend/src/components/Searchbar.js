import React from 'react';

function SearchBar({handleSubmit, searchTerm, handleChange, error}) {
  console.log(handleSubmit);
  console.log(searchTerm);
  console.log(handleChange);
  console.log(error);


  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        placeholder="Search a Book Title" 
        value={searchTerm}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
      {error && <div className="errorMsg" style={{ color: 'red' }}>{error}</div>}
      {/* {error && <div>
        <div 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '1rem',
            border: '1px solid black',
          }}
        >
            {error}
        </div>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        ></div>
      </div>} */}
    </form>
  );
}

export default SearchBar;