import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./RowItem.scss";

import ItemTypes from "./ItemTypes";
import { DragSource } from "react-dnd";

const itemSource = {
  beginDrag(props) {
    console.log("dragging");
    return {
      isNew: true,
      OnDrag: "columnList",
      content: props.item.array,
      columnListArray: [[], [], [], []]
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

export default DragSource(ItemTypes.CONTENT, itemSource, connect => ({
  connectDragSource: connect.dragSource()
}))(RowItem);
