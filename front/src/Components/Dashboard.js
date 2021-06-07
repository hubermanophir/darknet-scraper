import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import { io } from "socket.io-client";

export default function Dashboard() {
  const [scrapeSucceeded, setScrapeSucceeded] = useState(false);
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      const bool = await axios.post(
        "http://localhost:8080/api/user/exist",
        currentUser.uid
      );
      if (!bool.data.message) {
        console.log("user does not exist");
        const obj = {
          name: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
        };
        try {
          await axios.post("http://localhost:8080/api/user/new", obj);
          console.log(obj);
        } catch (error) {
          console.log(error);
        }
      }
    })();
    const newSocket = io("http://localhost:8080");
    newSocket.on("didWork", (data) => {
      console.log(data);
      if (data.message === "success") {
        setScrapeSucceeded(true);
        const temp = [...posts];
        temp.concat(data.newArray);

        if (temp.length > posts.length) {
          setPosts(temp);
        }
      } else {
        setScrapeSucceeded(false);
      }
    });
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (posts.length !== 0) {
      console.log("new Post");
    }
  }, [posts]);

  return (
    <div>
      <h1>Dashboard</h1>
      <input type="text" />
      <button onClick={logout}>Logout</button>
      {scrapeSucceeded ? <h1>Success</h1> : <h1>Fail</h1>}
    </div>
  );
}
