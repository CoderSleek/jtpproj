import React from 'react';

/**
 * This function returns a jsx component which includes styling for genre tags
 * which are common between search results and recommendation results
 * matching words are highlighted in yellow
 * 
 * list1 is list of genre words in the BookObject that called this method
 * list2 is list of words in the first Search Result book object
 * @param {*} { list1, list2} list of words in genre
 * @returns {JSX component}
 */
function Genre({ list1, list2, key}) {
  // list containing common words
  const matchingWords = list1.filter(word => list2.includes(word));

  return (
    <>
      <span className="bold">Genres: </span>
      <span>
        {
          list1.map(word => (
            <span style={{ backgroundColor: matchingWords.includes(word) ? 'yellow' : 'inherit' }} key={key}>
              {`${word}, `}
            </span>
          ))
        }
      </span>
      <br />
    </>
  );
}

export default Genre;