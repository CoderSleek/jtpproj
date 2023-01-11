import React from 'react';

function BookTile(props) {
  return (
    <div>
      <img src={props.coverImg} alt={props.title} />
      <h2>{props.title}</h2>
      <div>
        Rating: {props.rating}
      </div>
      {/* <p>{props.description}</p> */}
      <div>
        Genres: {props.genres.join(', ')}
      </div>
    </div>
  );
}

export default BookTile;