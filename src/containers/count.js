import React from 'react';

export default function Count(props) {
  const count = props.count === 0 ? '--' : props.count;
  return (
    <div className="Count text-center">{count}</div>
  );
}
