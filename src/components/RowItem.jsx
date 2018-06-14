import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./RowItem.scss";

import ItemTypes from "./ItemTypes";
import { DragSource } from "react-dnd";
const update = require("immutability-helper");

const itemSource = {
  beginDrag(props, monitor, component) {
    console.log("dragging");
    const columnListArray = [];
    component.props.array.map(element => {
      columnListArray.push([]);
    });
    console.log(`columnListArray: ${columnListArray}`);
    return {
      OnDrag: "columnList",
      content: props.item.array,
      columnListArray
    };
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
  }
};

class RowItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired
  };
  render() {
    const { array, connectDragSource, isDragging } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    const gridTemplateColumns = array.join("fr ") + "fr";
    return (
      connectDragSource &&
      connectDragSource(
        <div style={{ opacity, gridTemplateColumns }} className={styles.item}>
          {array.map((element, index) => {
            return <div key={index} className={styles.box} />;
          })}
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.ROW, itemSource, connect => ({
  connectDragSource: connect.dragSource()
}))(RowItem);
