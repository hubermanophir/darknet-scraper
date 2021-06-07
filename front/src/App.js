import "./App.css";
import Dashboard from "./Components/Dashboard";
import AuthProvider from "./context/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";
import SignUp from "./Components/SignUp";
import { io } from "socket.io-client";

import { useEffect, useState } from "react";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <Route exact path="/login">
              <SignUp />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
