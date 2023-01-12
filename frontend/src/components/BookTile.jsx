import React, {useState} from 'react';
import { useEffect } from 'react';
import './BookTile.css'

let x = false;

function BookTile({bookObject, infoCardState, handleSetInfoCardState}) {
  const [zoomCoverImage, setZoomCoverImage] = useState(false);

  useEffect(()=>{
    console.log('called');
    handleSetInfoCardState(1);
  }, [x]);

  function handleModalDisplay(){
    console.log('handled click')
    console.log(infoCardState)
    x = !x;
    // handleSetInfoCardState(1);
    // console.log(bookObject);
    // console.log(infoCardState);
    // console.log(handleSetInfoCardState);
    // if(infoCardState['_id'] !== undefined && infoCardState['_id'] === bookObject['_id']){
    //   console.log('yes')
    //   setInfoCardState({});
    // } else {
    //   console.log('no');
    //   setInfoCardState(bobj);
    // }
  }

  return (
    <div className="card booktile--single"
    onClick={handleModalDisplay}
    onMouseEnter={()=>setZoomCoverImage(prev => !prev)}
    onMouseLeave={()=>setZoomCoverImage(prev => !prev)}>

      <div style={{'overflow': 'hidden'}}>
        <img src={bookObject.coverImg} alt={bookObject.title} className={`booktile--coverimg ${zoomCoverImage ? 'onhover' : ''}`}/>
      </div>
      <h3>{bookObject.title}</h3>
      <div className='booktile--rating'>
        <span>Rating: {bookObject.rating}</span>
        <img src="/star-icon.png" alt="rating"></img>
      </div>
      <div className='booktile--single-genres'>
        Genres: {bookObject.genres.join(', ')}
      </div>
      {/* {isModalVisible && <modal style={{'backgroundColor': 'yellow', 'height': '60px'}}></modal>} */}
    </div>
  );
}

export default BookTile;