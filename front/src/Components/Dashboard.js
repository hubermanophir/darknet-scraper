import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import { io } from "socket.io-client";

export default function Dashboard() {
  const [scrapeSucceeded, setScrapeSucceeded] = useState(false);
  const [user, setsUser] = useState();
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      const bool = await axios.post("http://localhost:8080/api/user/exist", {
        uid: currentUser.uid,
      });
      if (!bool.data.message) {
        console.log("user does not exist");
        const obj = {
          name: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
        };
        try {
          const savedUser = await axios.post(
            "http://localhost:8080/api/user/new",
            obj
          );
          setsUser(savedUser.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        const savedUser = await axios.post(
          "http://localhost:8080/api/user/get_user",
          { uid: currentUser.uid }
        );
        setsUser(savedUser.data);
      }
    })();
    const newSocket = io("http://localhost:8080");
    newSocket.on("didWork", (data) => {
      newSocket.emit("keywords", currentUser.uid);
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
    // console.log(posts);
  }, [posts]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      <h1>Dashboard</h1>
      <input type="text" />
      <button onClick={logout}>Logout</button>
      {scrapeSucceeded ? <h1>Success</h1> : <h1>Fail</h1>}
    </div>
  );
}
