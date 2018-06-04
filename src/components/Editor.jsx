import React, { Component, Fragment } from "react";
import styles from "./Editor.scss";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: { r: "255", g: "255", b: "255", a: "1" },
      contentWidth: null,
      font: null,
      OnDrag: null
    };
  }

  myCallback = dataFromChild => {
    console.log(dataFromChild);
    this.setState({ color: dataFromChild });
  };

  widthCallback = dataFromChild => {
    console.log("change width: " + dataFromChild);
    this.setState({ contentWidth: dataFromChild });
  };

  fontCallback = dataFromChild => {
    this.setState({ font: dataFromChild });
  };

  dragCallback = dataFromChild => {
    this.setState({ OnDrag: dataFromChild });
  };

  render() {
    return (
      <Fragment>
        <div className={styles.editor}>
          <div className={styles.left}>
            <EditorLeft
              color={this.state.color}
              contentWidth={this.state.contentWidth}
              font={this.state.font}
              OnDrag={this.state.OnDrag}
            />
          </div>
          <div className={styles.right}>
            <EditorRight
              callbackfromparent={this.myCallback.bind(this)}
              callbackfromparentwidth={this.widthCallback.bind(this)}
              callbackfromparentfont={this.fontCallback.bind(this)}
              callbackfromparentdrag={this.dragCallback.bind(this)}
              contentWidth={this.contentWidth}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Editor;
