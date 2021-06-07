import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import { io } from "socket.io-client";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  // useEffect(() => {

  //   const obj = {
  //     name: currentUser.displayName,
  //     email: currentUser.email,
  //     uid: currentUser.uid,
  //   };
  //   (async () => {
  //     try {
  //       await axios.post("http://localhost:8080/api/user/new", obj);
  //       console.log(obj);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   })();
  // }, []);

  const [scrapeSucceeded, setScrapeSucceeded] = useState(false);
  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    newSocket.on("didWork", (data) => {
      data === "success" ? setScrapeSucceeded(true) : setScrapeSucceeded(false);
    });
    return () => newSocket.close();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <input type="text" />
      <button onClick={logout}>Logout</button>
      {scrapeSucceeded ? <h1>Success</h1> : <h1>Fail</h1>}
    </div>
  );
}
