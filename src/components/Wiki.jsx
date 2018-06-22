import React, { Component } from "react";
import styles from "./Wiki.scss";
import Button from "./Button";

class Wiki extends Component {
  render() {
    return (
      <div className={styles.wiki}>
        <Button />
      </div>
    );
  }
}

export default Wiki;
