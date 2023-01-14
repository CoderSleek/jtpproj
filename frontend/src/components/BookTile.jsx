/**
 * This file returns the BookTile component
 * which is a JSX element contianing the information
 * of each book Object
 */

import React, { useState } from 'react';
import './BookTile.css'
import InfoBox from './InfoBox';

/**
 * This function creates a sinlge BookTile object and returns it
 * it also sets the type of object and firstsearchObject to be used by its child
 * component InfoBox
 * 
 * bookObject is Object containing data of book
 * type is String mentioning what type the BookTile is
 * firstSearchObject Object is passed on as prop to child
 * @param {Object} { bookObject, type, firstSearchObject } 
 * @returns {JSX component}
 */
function BookTile({ bookObject, type, firstSearchObject }) {
  // sets state to zoom the cover image on hover
  // type = Boolean
  const [zoomCoverImage, setZoomCoverImage] = useState(false);
  // sets state to show description of a book when clicked on it
  // type = Boolean
  const [showInfo, setShowInfo] = useState(false);

  /**
   * Wrapper function to set the value of show info by negating it
   */
  function handleModalDisplay() {
    setShowInfo(prev => !prev);
  }

  return (
    <>
      { // conditional rendering of description box
        showInfo &&
        <div className='info-modal'>
          <InfoBox
            bookObject={bookObject}
            handleShowInfo={setShowInfo}
            type={type}
            firstSearchObject={firstSearchObject}
          />
        </div>
      }
      {/* onMouseEnter and onMouseLeave help establish hover effect */}
      <div className="card booktile--single"
        onClick={handleModalDisplay}
        onMouseEnter={() => setZoomCoverImage(prev => !prev)}
        onMouseLeave={() => setZoomCoverImage(prev => !prev)}>

        <div style={{ 'overflow': 'hidden' }}>
          <img src={bookObject.coverImg} alt={bookObject.title} className={`booktile--coverimg ${zoomCoverImage ? 'onhover' : ''}`} />
        </div>
        <h3>{bookObject.title}</h3>
        {
          bookObject.rating &&
          <div className='booktile--rating'>
            <span>Rating: {bookObject.rating}</span>
            <img src="/star-icon.png" alt="rating"></img>
          </div>
        }
        {
          bookObject.genres?.length > 0 && <div className='booktile--single-genres'>
            Genres: {bookObject.genres.join(', ')}
          </div>
        }
      </div>
    </>
  );
}

export default BookTile;