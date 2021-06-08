import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import { io } from "socket.io-client";
import PrimarySearchAppBar from "./PrimarySearchAppBar";
import { Button } from "@material-ui/core";
import Posts from "./Posts";
import SwipeableTemporaryDrawer from "./SwipeableTemporaryDrawer";
import CustomPosts from "./CustomPosts";
import AlertConfig from "./AlertConfig";

export default function Dashboard() {
  const [scrapeSucceeded, setScrapeSucceeded] = useState(false);
  const [newPostsNumber, setNewPostsNumber] = useState(0);
  const [postsVisible, setPostsVisible] = useState(true);
  const [alertConfigVisible, setAlertConfigVisible] = useState(false);
  const [customPostsVisible, setCustomPostsVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setsUser] = useState();
  const { currentUser } = useAuth();
  const { logout } = useAuth();

  useEffect(() => {
    //Checks if user exists and changes user state
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
    //Socket io client config
    const newSocket = io("http://localhost:8080");
    newSocket.on("didWork", (data) => {
      console.log(data);
      if (data.message === "success") {
        setScrapeSucceeded(true);
        setNewPostsNumber((prev) => (prev += data.numberOfNew));
      } else {
        setScrapeSucceeded(false);
      }
    });
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    console.log("New Post");
  }, [newPostsNumber]);

  return (
    <div>
      <PrimarySearchAppBar
        scrapeSucceeded={scrapeSucceeded}
        newPostsNumber={newPostsNumber}
        SwipeableTemporaryDrawer={SwipeableTemporaryDrawer}
        setPostsVisible={setPostsVisible}
        setAlertConfigVisible={setAlertConfigVisible}
        setCustomPostsVisible={setCustomPostsVisible}
      />
      {postsVisible && (
        <Posts
          setPosts={setPosts}
          posts={posts}
          setNewPostsNumber={setNewPostsNumber}
        />
      )}
      {alertConfigVisible && <AlertConfig user={user} />}
      {customPostsVisible && <CustomPosts />}
    </div>
  );
}
