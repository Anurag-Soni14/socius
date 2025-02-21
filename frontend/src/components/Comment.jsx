import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function Comment({ comment, isLast}) {
  return (
    <div className='my-2' id={isLast ? "comment-end" : undefined}>
      <div className='flex gap-3 items-center'>
        <Avatar>
          <AvatarImage src={comment?.author?.profilePic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className='font-bold text-sm text-base-content'>
            {comment?.author?.username}{' '}
            <span className='font-normal pl-1'>{comment?.text}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Comment;
