import React, { useState } from 'react';
import './BookTile.css'
import InfoBox from './InfoBox';


function BookTile({ bookObject, type, firstSearchObject }) {
  const [zoomCoverImage, setZoomCoverImage] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  function handleModalDisplay() {
    setShowInfo(prev => !prev);
  }

  return (
    <>
      {showInfo && <div className='info-modal'>
        <InfoBox
          bookObject={bookObject}
          handleShowInfo={setShowInfo}
          type={type}
          firstSearchObject={firstSearchObject}
        />
      </div>
      }
      <div className="card booktile--single"
        onClick={handleModalDisplay}
        onMouseEnter={() => setZoomCoverImage(prev => !prev)}
        onMouseLeave={() => setZoomCoverImage(prev => !prev)}
      >

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
        {bookObject.genres?.length > 0 && <div className='booktile--single-genres'>
          Genres: {bookObject.genres.join(', ')}
        </div>
        }
      </div>
    </>
  );
}

export default BookTile;