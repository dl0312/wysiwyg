import React, { Component, ThemeContext } from "react";
import PropTypes from "prop-types";

import styles from "./ContentItem.scss";

import ItemTypes from "./ItemTypes";
import { DragSource, ConnectDragSource } from "react-dnd";

import { Editor } from "slate-react";
import { Value } from "slate";

const itemSource = {
  beginDrag(props) {
    console.log("dragging");
    return { OnDrag: "content", content: props.item.name };
  },
  endDrag(props, monitor, component) {
    console.log(`monitor.didDrop(): ${monitor.didDrop()}`);
    if (!monitor.didDrop()) {
      return;
    }
  }
};

class ContentItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired
  };
  render() {
    const { icon, name, connectDragSource, isDragging } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    return (
      connectDragSource &&
      connectDragSource(
        <li style={{ opacity }} className={styles.item}>
          <div className={styles.icon}>
            <i class={icon} />
          </div>
          <div className={styles.title}>{name}</div>
        </li>
      )
    );
  }
}

export default DragSource(ItemTypes.CONTENT, itemSource, connect => ({
  connectDragSource: connect.dragSource()
}))(ContentItem);
