import React from 'react';

export default function Circle(props) {
  return (
    <div className="Circle"
      id={props.color}
      style={{border: `4px solid ${props.color}`}}
      onClick={props.onClick}>
    </div>
  );
}
