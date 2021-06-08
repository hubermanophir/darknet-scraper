import axios from "axios";
import React, { useEffect } from "react";
import Post from "./Post";

export default function Posts({ setPosts, posts }) {
  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:8080/api/info/all_data");
      setPosts(res.data);
    })();
  }, []);
  return (
    <div>
      {posts &&
        posts.map((post, i) => {
          return <Post key={`post ${i}`} post={post} />;
        })}
    </div>
  );
}
