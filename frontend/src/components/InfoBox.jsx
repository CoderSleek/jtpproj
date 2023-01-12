import React from "react";

function InfoBox(props){
    const bookObject = props.info;

    return (
    <div className={props.className}>
        {/* <h3>Title: {bookObject.title}</h3>
        <span>Author: {bookObject.author}</span>
        <span>Genres: {bookObject.genres.join(', ')}</span>
        <span>Description: {bookObject.description}</span> */}
    </div>
    );
}

export default InfoBox;