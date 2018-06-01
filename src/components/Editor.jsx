import React, { Component, Fragment } from "react";
import styles from "./Editor.scss";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";

class Editor extends Component {
  render() {
    return (
      <Fragment>
        <div className={styles.editor}>
          <div className={styles.left}>
            <EditorLeft />
          </div>
          <div className={styles.right}>
            <EditorRight />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Editor;
