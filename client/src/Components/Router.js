import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Header from "./layouts/Header";
import Home from "../Routes/Home";
import Register from "../Routes/Register";
import Login from "../Routes/Login";
import Profile from "../Routes/Profile";
import CreateProfile from "../Routes/Profile/CreateProfile";

export default () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/create-profile" component={CreateProfile} />
        <Redirect from="/*" to="/" />
      </Switch>
    </Router>
  );
};
