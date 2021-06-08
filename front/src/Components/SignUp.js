import { Button } from "@material-ui/core";
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
    <div className="login-div-container">
      <div className="login-div">
        <h1>DarkWeb Scraper</h1>
        <Button color="inherit" variant="contained" onClick={signupHandler}>
          Login with google
        </Button>
      </div>
    </div>
  );
}
