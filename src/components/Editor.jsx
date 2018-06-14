import React, { Component, Fragment } from "react";
import styles from "./Editor.scss";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

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
              greedy={false}
            />
          </div>
          <div className={styles.right}>
            <EditorRight
              callbackfromparent={this.myCallback.bind(this)}
              callbackfromparentwidth={this.widthCallback.bind(this)}
              callbackfromparentfont={this.fontCallback.bind(this)}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DragDropContext(HTML5Backend)(Editor);
