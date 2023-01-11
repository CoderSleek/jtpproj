import React from 'react';

function BookTile(props) {
  return (
    <div>
      <img src={props.coverImg} alt={props.title} />
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <div>
        Rating: {props.rating}
      </div>
      <div>
        Genres: {props.genres.join(', ')}
      </div>
    </div>
  );
}

export default BookTile;