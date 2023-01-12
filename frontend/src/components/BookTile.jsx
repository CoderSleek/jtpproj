import React from 'react';
import './BookTile.css'

function BookTile(props) {
  return (
    <div className="card booktile--single">
      <div className='bg-image hover-zoom'>
        <img src={props.coverImg} alt={props.title} className="booktile--coverimg"/>
      </div>
      <h3>{props.title}</h3>
      <div className='booktile--rating'>
        <span>Rating: {props.rating}</span>
        <img src="/star-icon.png" alt="rating"></img>
      </div>
      {/* <p>{props.description}</p> */}
      <div className='booktile--single-genres'>
        Genres: {props.genres.join(', ')}
      </div>
    </div>
  );
}

export default BookTile;