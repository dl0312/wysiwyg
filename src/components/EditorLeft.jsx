import React, { Component } from "react";

import styles from "./EditorLeft.scss";

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // 기본상태의 에디터화면 id=container
    const { greedy, isOver, isOverCurrent } = this.props;
    let backgroundColor = `rgba(${this.props.color.r}, ${this.props.color.g}, ${
      this.props.color.b
    }, ${this.props.color.a})`;
    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = "#b8e994";
    }
    return (
      <div
        style={{
          backgroundColor,
          fontFamily: `${this.props.font}`
        }}
        className={styles.editor}
        id="container"
      >
        {this.props.children}
      </div>
    );
  }
}

export default EditorLeft;
