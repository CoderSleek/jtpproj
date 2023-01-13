import React from 'react';

function Genre({ list1, list2 }) {
  const matchingWords = list1.filter(word => list2.includes(word));

  return (
    <>
      <span className="bold">Genres: </span>
      <span>
        {list1.map(word => (
          <span style={{ backgroundColor: matchingWords.includes(word) ? 'yellow' : 'inherit' }}>
            {`${word}, `}
          </span>
        ))}
      </span>
      <br />
    </>
  );
}

export default Genre;