import React from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from '../index.js';
import './SelectComponents.css';

/**
 * This function manages and returns the search dropdown when a user searches by genre
 * it also retrieves data from api when a search is performed this data is then stored in bookSearchEles Array by
 * setState, it is maintained by the parent
 * multiselect-react-dropdown is used to create the dropdown menu
 * 
 * setErrorHandler is setState method to set any errors
 * setBookSearchEles is setState function of bookRecommEles maintained by parent
 * setRecommBookHandler is setState function of booksRecommendationList 
 * mapBookObjectToBookTile is a function mapBookObjectToBookTile which creates a jsx element of a book Object
 * setBookRecommEles is a setState function of bookRecommEles which contains Array of JSX of recommendation results
 * @param {Object}  { setErrorHandler, setBookSearchEles, setRecommBookHandler, mapBookObjectToBookTile } 
 * @returns {JSX component}
 */
function SelectComponent({ setErrorHandler, setBookSearchEles, setRecommBookHandler, mapBookObjectToBookTile, setBookRecommEles }) {
    // state management for maintaining top 100 Genres Array fetched from api
	//  type = Array
    const [genreList, setGenreList] = useState([]);
    // state management for maintaining the array containing tags to search
	//  type = Array
    const [selectedOptions, setSelectedOptions] = useState([]);

    /**
     * Retrieves genre recommendations from api and stores it in Array containing search results
     * empties recommendation Arrays
     * 
     * sets State of error dialog if any
     */
    async function loadGenreData() {
        if (selectedOptions.length === 0) {
            setErrorHandler('Search list cannot be empty');
            return;
        }
        try {
            const res = await fetch(
                API_URL + '/recommendbygenre',
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(selectedOptions)
                });
            // not needed to check for response status code, if any error it will be handled by catch
            let data = await res.json();
            // map data Object to JSX and set type to genres
            data = data['suggested'].map(bookObject => mapBookObjectToBookTile(bookObject, 'genres'));

            setBookSearchEles(data);
            // empty the recommendation array as only search results are available
            setRecommBookHandler([]);
            setBookRecommEles([]);

        } catch (err) {
            setErrorHandler('Trouble Connecting to the server');
        }
    }

    /**
     * fetches from API top Array of 100 genres
     */
    useEffect(() => {
        fetch(
            API_URL + '/gettopgenres',
            {
                method: 'GET'
            }
        )
        .then(res => res.json())
        .then(listOfRecomm => {
            setGenreList(listOfRecomm['genres'])
        })
        .catch(() => setErrorHandler('Trouble Connecting to the server'));
    }, []); // empty dependency

    return (
        <div className='multi--select'>
            <div className="multi--select-container">
                <div className="multi--select-wrapper">
                    <Multiselect
                        // data not in key value pair
                        isObject={false}
                        options={genreList}
                        showCheckbox={true}
                        onSelect={vals => setSelectedOptions(vals)}
                        onRemove={vals => setSelectedOptions(vals)}
                    />
                </div>
                {/* submit button */}
                <button style={{ 'float': 'right' }} className='button-1' onClick={loadGenreData}>Submit</button>
            </div>
        </div>
    );
}

export default SelectComponent;