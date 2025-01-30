import React from 'react';
import Postframe from './Postframe';
import { useSelector } from 'react-redux';

function Posts() {
  const { posts } = useSelector(store => store.posts);
  return (
    <div className="size-96 bg-base-100 text-base-content">
      {posts.map((post) => (
        <Postframe key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
