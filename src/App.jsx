import React from "react";
import styles from "./App.scss";
import { HashRouter as Router, Route, withRouter } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import client from "./apolloClient";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";
import Board from "./components/Board/Board";
import Wiki from "./components/Wiki/Wiki";
import Store from "./components/Store/Store";
import Editor from "./components/Editor/Editor";
import Profile from "./components/Profile/Profile";
import Detail from "./components/Board/Detail";
import db from "./components/Editor/db";
import "./App.css";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className={styles.app}>
          <Navigation />
          <div className={styles.content}>
            <Route exact path="/" component={Home} />
            <Route exact path="/guide" component={Board} />
            <Route exact path="/wiki" component={Wiki} />
            <Route exact path="/store" component={Store} />
            <Route exact path="/editor" component={Editor} />
            <Route exact path="/editor/:post_id" component={Editor} />
            <Route exact path="/read/:post_id" component={Detail} />
            <Route exact path="/profile" component={Profile} />
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default withRouter(App);
