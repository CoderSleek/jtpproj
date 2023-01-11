import React, { useState } from 'react';
import {API_URL} from './index' 

function SearchBar() {
    let pageNumber = 0;
    let isFuzzy = true;
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [booksRecommendationList, setBooksRecommendationList] = useState([]);

    function handleChange(event) {
        setSearchTerm(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if(!searchTerm){
            setError('Search Field cannot be empty');
            return;
        }
        setError('');

        const response = await fetch(
            API_URL + '/findbook?' + 
            new URLSearchParams({
                'title': searchTerm.trim(),
                'fuzzy': isFuzzy
            }).toString(),
            {
                method: 'GET'
            }
        );


    if(response.status === 200){
        const data = await response.json();
        if(data){
            setBooksRecommendationList(data['suggested']);
            console.log(booksRecommendationList);
        } else {
            console.log('nothing found');
        }
    } else {
        console.log('internal server error');
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Search..." 
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