import React from "react";
import { Multiselect } from 'multiselect-react-dropdown';
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from '../index.js';
import './SelectComponents.css';

function SelectComponent({ setErrorHandler, setBookSearchEles, setRecommBookHandler, mapBookObjectToBookTile }) {
    const [genreList, setGenreList] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

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
            let data = await res.json();
            data = data['suggested'].map(bookObject => mapBookObjectToBookTile(bookObject, 'genres'));

            setBookSearchEles(data);
            setRecommBookHandler([]);

        } catch (err) {
            console.log(err)
            setErrorHandler('Trouble Connecting to the server');
        }
    }

    useEffect(() => {
        try {
            fetch(
                API_URL + '/gettopgenres',
                {
                    method: 'GET'
                }
            )
                .then(res => res.json())
                .then(listOfRecomm => {
                    setGenreList(listOfRecomm['genres'])
                });
        } catch (err) {
            console.log(err)
            // setErrorWrapper('Trouble Connecting to the server');
        }
    }
        , []);

    return (
        <div className='multi--select'>
            <div className="multi--select-container">
                <div className="multi--select-wrapper">
                    <Multiselect
                        isObject={false}
                        options={genreList}
                        displayValue="genre"
                        showCheckbox={true}
                        onSelect={vals => setSelectedOptions(vals)}
                        onRemove={vals => setSelectedOptions(vals)}
                    />
                </div>
                <button style={{ 'float': 'right' }} className='button-1' onClick={loadGenreData}>Submit</button>
            </div>
        </div>
    );
}

export default SelectComponent;