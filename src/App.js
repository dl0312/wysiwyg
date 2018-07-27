import React from "react";
import { Route, withRouter } from "react-router-dom";
import styles from "./App.scss";
import Navigation from "./components/Navigation";
import Home from "./components/Home/Home";
import Board from "./components/Board/Board";
import Wiki from "./components/Wiki/Wiki";
import Store from "./components/Store/Store";
import Editor from "./components/Editor";
import Profile from "./components/Profile";
import "./App.css";

const App = () => {
  return (
    <div className={styles.app}>
      <Navigation />
      <div className={styles.content}>
        <Route path="/ " component={Home} />
        <Route path="/guide" component={Board} />
        <Route path="/wiki" component={Wiki} />
        <Route path="/store" component={Store} />
        <Route path="/undefined" component={Editor} />
        <Route path="/profile" component={Profile} />
      </div>
    </div>
  );
};

export default withRouter(App);
