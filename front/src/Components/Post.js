import React from "react";

export default function Post({ post }) {
  return <div>
      <div>
          <div className='post-title'>{post.title}</div>
          <div className='post-content'>{post.content}</div>
          <div className='post-author'>{post.author}</div>
          <div className='post-date'>{post.date}</div>
      </div>
  </div>;
}
