import React, { useState } from 'react';

const Tooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    style={{'backgroundColor': 'yellow', 'width': '50', 'height': '50'}}>
      <span>Hover over me!</span>
      {isVisible && <div>{text}</div>}
    </div>
  );
};

export default Tooltip;