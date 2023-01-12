import React, { useState } from 'react';

function ToggleSlider({handleToggle, toggleStatus}){

    function toggleHandler(){
        handleToggle(prev => !prev);
    }

  return (
    <div className="form-check form-switch" style={{'width': '100%', 'marginBottom': '30px'}}>
      <input
        className="form-check-input"
        data-container="body"
        data-toggle="popover"
        data-placement="bottom"
        data-trigger="hover"
        title="On for keyword search off for exact search"
        data-content="On for keyword search off for exact search"
        type="checkbox"
        checked={toggleStatus}
        onChange={toggleHandler}
        style={{'float': 'right', 'marginRight': 'calc((100vw - 600px) / 2)', 'height': '20px', 'width': '45px'}}
      />
    </div>
  );
};

export default ToggleSlider;