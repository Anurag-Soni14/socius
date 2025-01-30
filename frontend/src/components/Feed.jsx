import React from 'react';
import Posts from './Posts';

function Feed() {
  return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[20%] bg-base-100 text-base-content">
      <Posts />
    </div>
  );
}

export default Feed;
