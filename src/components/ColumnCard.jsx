import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor,
  connectDragPreview
} from "react-dnd";
import ItemTypes from "./ItemTypes";
import { XYCoord } from "dnd-core";
import flow from "lodash.flow";
import Container from "./Container";

const style = {
  outline: "1px dashed gray",
  padding: "0.5rem",
  borderRadius: "5px",
  backgroundColor: "white",
  width: "100%",
  position: "relative"
};

const handleStyle = {
  backgroundColor: "#9c88ff",
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "100%",
  cursor: "-webkit-grab",
  marginRight: "0.75rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  position: "absolute",
  top: "50%",
  transform: "translateX(-20px) translateY(-10px)"
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    let dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

class ColumnCard extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      OnDrag,
      content
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDropTarget(
        connectDragPreview(
          <div style={{ ...style, opacity }}>
            {connectDragSource(
              <div style={handleStyle}>
                <i class="fas fa-plus" />
              </div>
            )}
            <Container
              OnDrag={OnDrag}
              content={content}
              columnListArray={this.props.columnListArray}
            />
          </div>
        )
      )
    );
  }
}

export default flow(
  DragSource(ItemTypes.COLUMNCARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.COLUMNCARD, cardTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }))
)(ColumnCard);
