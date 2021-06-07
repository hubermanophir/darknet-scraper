import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { login } = useAuth();
  const history = useHistory();
  const signupHandler = async () => {
    try {
      await login();
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h1>Welcome to my shop</h1>
      <button onClick={signupHandler}>signin with google</button>
    </div>
  );
}
