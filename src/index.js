import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router, Route } from "react-router-dom";

ReactDOM.hydrate(
  <Router>
    <Route path="/" component={App} />
  </Router>,
  document.getElementById("root")
);
