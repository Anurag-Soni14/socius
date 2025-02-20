import React from 'react';
import Posts from './Posts';

function Feed() {
  return (
    <div className="flex-1 my-8 flex flex-col items-center bg-base-100 text-base-content min-h-screen ml-[16%]">
      <Posts />
    </div>
  );
}

export default Feed;
