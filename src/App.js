import React from "react";
import { Route, withRouter } from "react-router-dom";
import styles from "./App.scss";
import Navigation from "./components/Navigation";
import Guide from "./components/Guide";
import Wiki from "./components/Wiki";
import Store from "./components/Store";
import Editor from "./components/Editor";
import Profile from "./components/Profile";

const App = () => {
  return (
    <div className={styles.app}>
      <Navigation />
      <div className={styles.content}>
        <Route path="/" component={""} />
        <Route path="/guide" component={Guide} />
        <Route path="/wiki" component={Wiki} />
        <Route path="/store" component={Store} />
        <Route path="/undefined" component={Editor} />
        <Route path="/profile" component={Profile} />
      </div>
    </div>
  );
};

export default withRouter(App);
