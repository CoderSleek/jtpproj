import React from "react";
import './InfoBox.css';
import Genre from './Genres';

/**
 * This function creates the InfoBox which displays the information of a book
 * when clicked on it, similar to a modal.
 * @param {Object} props Object passed by parent component
 * contains bookObject which is Object having book data that invoked the description
 * and firstSearchObject is the first search result object
 * @returns {JSX component}
 */
function InfoBox(props) {
    const bookObject = props.bookObject;
    // is not undefined check
    const genres1 = bookObject?.genres;
    // is not undefined check
    const genres2 = props.firstSearchObject?.genres;

    // flag to check whether type is recommendation, match results are not shown for search and genre type results
    let flag = false;

    if (genres1 && genres2 && props.type === 'recommendation') {
        flag = true;
    }

    return (
        <div className='data'>
            <button onClick={() => props.handleShowInfo(prev => !prev)} className='modal--close btn-close' />
            <div style={{ 'width': '100%' }}>
                <img src={bookObject.coverImg} alt={bookObject.title} className='modal--img' />
            </div>
            <h3><span className="bold">Title: </span> {bookObject.title}</h3>
            <div style={{ 'lineHeight': '18px' }}>
                {bookObject.rating && <span className="modal--rating"><span className="bold">Rating: </span> {bookObject.rating}</span>}
                <img src="/star-icon.png" alt="rating" className="modal--rating-img"></img>
            </div>
            <br />
            {
                bookObject.author && <div><span className="bold">Author: </span> {bookObject.author}</div>
            }
            <br />
            {
                flag ?
                <Genre list1={genres1} list2={genres2} /> :
                bookObject.genres &&
                <div>
                    <span className="bold">Genres: </span>
                    {bookObject.genres.join(', ')}
                </div>
            }
            <br />
            {
                bookObject.description &&
                <div><span className="bold">Description: </span>
                    {bookObject.description}
                </div>
            }
        </div>
    );
}

export default InfoBox;