import React, { useEffect, useState } from "react";
import { searchKeywords } from "../Utils";

export default function CustomPosts({ posts, user }) {
  const [customPosts, setCustomPosts] = useState([]);

  useEffect(() => {
    const postWithNoId = posts.map((post) => {
      return {
        author: post.author,
        content: post.content,
        date: post.date,
        title: post.title,
      };
    });
    const uniqueMatchArray = searchKeywords(user.keywords, postWithNoId);
    setCustomPosts(uniqueMatchArray);
  }, []);

  return (
    <div>
      <h1>custom posts</h1>
      {customPosts &&
        customPosts.map((post) => {
          return (
            <div className="post-div">
              <div className="post-title">{post.post.title}</div>
              <div className="post-content">{post.post.content}</div>
              <div className="post-author">{post.post.author}</div>
              <div className="post-date">{post.post.date}</div>
              <div className="post-keyword">{post.keyword}</div>
              <div className="post-match-percent">
                {Math.floor(post.matchPercent * 100)}
              </div>
            </div>
          );
        })}
    </div>
  );
}
