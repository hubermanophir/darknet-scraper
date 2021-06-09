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
import { searchKeywords } from "../Utils";

export default function Dashboard() {
  const [scrapeSucceeded, setScrapeSucceeded] = useState(false);
  const [newPostsNumber, setNewPostsNumber] = useState(0);
  const [postsVisible, setPostsVisible] = useState(true);
  const [alertConfigVisible, setAlertConfigVisible] = useState(false);
  const [customPostsVisible, setCustomPostsVisible] = useState(false);
  const [matchArray, setMatchArray] = useState([]);
  const [newPostsArray, setNewPostsArray] = useState([]);
  const [posts, setPosts] = useState([]);
  const [user, setsUser] = useState();
  const [socketData, setSocketData] = useState();
  const { currentUser } = useAuth();

  useEffect(() => {
    //Checks if user exists and changes user state
    (async () => {
      const bool = await axios.post("http://localhost:8080/api/user/exist", {
        uid: currentUser.uid,
      });

      if (!bool.data.message) {
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
      if (data.message === "success") {
        setSocketData(data);
        setScrapeSucceeded(true);
        setNewPostsNumber((prev) => (prev += data.numberOfNew));
        if (data.numberOfNew !== 0) {
          (async () => {
            const res = await axios.get(
              "http://localhost:8080/api/info/all_data"
            );
            setPosts(res.data);
          })();
        }
      } else {
        setScrapeSucceeded(false);
      }
    });
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (postsVisible) {
      setNewPostsNumber(0);
    } else if (customPostsVisible) {
      setNewPostsArray([]);
    }
  }, [newPostsNumber]);

  useEffect(() => {
    if (socketData) {
      if (socketData.numberOfNew > 0) {
        const temp = [...newPostsArray];
        socketData.newPosts.forEach((newPost) => {
          temp.push(newPost);
        });
        setNewPostsArray(temp);
      }
    }
  }, [socketData]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        const matches = searchKeywords(user.keywords, newPostsArray);
        const temp = [...matchArray];
        if (matches.length > 0) {
          matches.forEach((match) => {
            temp.push(match);
          });
        }
        setMatchArray(temp);
      }, user.searchInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [newPostsArray]);
  return (
    <div>
      <PrimarySearchAppBar
        scrapeSucceeded={scrapeSucceeded}
        newPostsNumber={newPostsNumber}
        SwipeableTemporaryDrawer={SwipeableTemporaryDrawer}
        setPostsVisible={setPostsVisible}
        setAlertConfigVisible={setAlertConfigVisible}
        setCustomPostsVisible={setCustomPostsVisible}
        matchArray={matchArray}
        setMatchArray={setMatchArray}
        setPosts={setPosts}
        setNewPostsArray={setNewPostsArray}
      />
      {postsVisible && (
        <Posts
          setPosts={setPosts}
          posts={posts}
          setNewPostsNumber={setNewPostsNumber}
        />
      )}
      {alertConfigVisible && <AlertConfig user={user} setsUser={setsUser} />}
      {customPostsVisible && <CustomPosts user={user} posts={posts} />}
    </div>
  );
}
