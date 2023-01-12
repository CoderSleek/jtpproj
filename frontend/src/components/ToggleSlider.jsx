import React, { useState } from 'react';

function ToggleSlider({handleToggle, toggleStatus}){

    function toggleHandler(){
        handleToggle(prev => !prev);
    }

  return (
    <div className="form-check form-switch" style={{'backgroundColor': 'red', 'width': '100%'}}>
      <input
        className="form-check-input"
        type="checkbox"
        checked={toggleStatus}
        onChange={toggleHandler}
        style={{'float': 'right', 'margin-right': 'calc(100vw - 1200px)'}}
      />
    </div>
  );
};

export default ToggleSlider;