import React, { Component, Fragment } from "react";
import styles from "./Editor.scss";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { color: { r: "255", g: "255", b: "255", a: "1" } };
  }

  myCallback = dataFromChild => {
    console.log(dataFromChild);
    this.setState({ color: dataFromChild });
  };
  render() {
    return (
      <Fragment>
        <div className={styles.editor}>
          <div className={styles.left}>
            <EditorLeft color={this.state.color} />
          </div>
          <div className={styles.right}>
            <EditorRight callbackfromparent={this.myCallback.bind(this)} />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Editor;
