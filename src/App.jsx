import React from "react";
import { Route, withRouter } from "react-router-dom";
import styles from "./App.scss";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";
import Board from "./components/Board/Board";
import Wiki from "./components/Wiki/Wiki";
import Store from "./components/Store/Store";
import Editor from "./components/Editor/Editor";
import Profile from "./components/Profile/Profile";
import "./App.css";

const App = () => {
  return (
    <div className={styles.app}>
      <Navigation />
      <div className={styles.content}>
        <Route exact path="/" component={Home} />
        <Route exact path="/guide" component={Board} />
        <Route exact path="/wiki" component={Wiki} />
        <Route exact path="/store" component={Store} />
        <Route exact path="/editor" component={Editor} />
        <Route exact path="/profile" component={Profile} />
      </div>
    </div>
  );
};

export default withRouter(App);
