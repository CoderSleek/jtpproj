import React from 'react';

/**
 * This function returns the slider checkbox which denotes whether fuzzy search is on or off
 * it also displays a popover when you hover over the button
 * 
 * handleToggle is a setState function that sets fuzzy search checkbox state
 * toggleStatus is Boolean value denoting whether checkbox is checked or not, used to initialize checkbox
 * @param {Object} { handleToggle, toggleStatus }
 * @returns {JSX component}
 */
function ToggleSlider({ handleToggle, toggleStatus }) {

  // setState of fuzzy search
  function toggleHandler() {
    handleToggle(prev => !prev);
  }

  return (
    <div className="form-check form-switch" style={{ 'width': '100%', 'marginBottom': '30px' }}>
      <input
        className="form-check-input"
        // popover attributes
        data-container="body"
        data-toggle="popover"
        data-placement="bottom"
        data-trigger="hover"
        title="On for keyword search off for exact search"
        type="checkbox"
        checked={toggleStatus}
        onChange={toggleHandler}
        style={{ 'float': 'right', 'marginRight': 'calc((100vw - 600px) / 2)', 'height': '20px', 'width': '45px' }}
      />
    </div>
  );
};

export default ToggleSlider;