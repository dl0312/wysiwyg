import React, { Component, Fragment } from "react";

import styles from "./EditorLeft.scss";
import "./EditorLeft.css";
import Card from "./Card";
import Box from "./Box";
import ItemTypes from "./ItemTypes";
import Builder from "./Builder";
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from "react-dnd";
import flow from "lodash.flow";
import _ from "lodash";
import { Motion, spring } from "react-motion";
import Container from "./Container";
import deepcopy from "deepcopy";

const update = require("immutability-helper");
const boxTarget = {
  drop(props, monitor, component) {
    console.log("drop");
    // component.setState({ contentHover: !component.state.contentHover });
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild && !props.greedy) {
      return;
    }

    component.setState({
      hasDropped: true,
      hasDroppedOnChild
    });
    component.handleDrop(monitor.getItem());
  }
};

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // 기본상태의 에디터화면 id=container
    const {
      greedy,
      isOver,
      isOverCurrent,
      connectDropTarget,
      children
    } = this.props;
    let backgroundColor = `rgba(${this.props.color.r}, ${this.props.color.g}, ${
      this.props.color.b
    }, ${this.props.color.a})`;
    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = "#b8e994";
    }
    return (
      connectDropTarget &&
      connectDropTarget(
        <div
          style={{ backgroundColor, fontFamily: `${this.props.font}` }}
          className={styles.editor}
          id="container"
        >
          {this.props.children}
        </div>
      )
    );
  }
}

export default DropTarget("hello", boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))(EditorLeft);
