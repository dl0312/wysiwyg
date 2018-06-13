import React, { Component } from "react";
import styles from "./RowItem.scss";
import ItemTypes from "./ItemTypes";
import { DragSource } from "react-dnd";

const itemSource = {
  beginDrag(props) {
    console.log("dragging");
    return { OnDrag: "columnList", content: props.item.array };
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
    return props.handleDrop(props.item.array);
  }
};

class RowItem extends Component {
  render() {
    const { array, connectDragSource, isDragging } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    const gridTemplateColumns = array.join("fr ") + "fr";
    return connectDragSource(
      <div style={{ opacity, gridTemplateColumns }} className={styles.item}>
        {array.map(element => {
          return <div className={styles.box} />;
        })}
      </div>
    );
  }
}

export default DragSource(ItemTypes.CONTENT, itemSource, connect => ({
  connectDragSource: connect.dragSource()
}))(RowItem);
