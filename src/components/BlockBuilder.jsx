import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import ItemTypes from "./ItemTypes";
import { findDOMNode } from "react-dom";
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from "react-dnd";

const barStyle = {
  width: "120px",
  outline: "darkblue solid 1px"
};

const builderStyle = {
  textAlign: "center",
  color: "white",
  backgroundColor: "darkblue",
  borderRadius: "5px",
  fontSize: "12px",
  padding: "5px 15px",
  position: "absolute"
};

const builderTarget = {
  drop(props, monitor, component) {
    console.log("drop");
    const type = monitor.getItemType();
    console.log(monitor.getItem().index);
    if (type === ItemTypes.CARD) {
      props.moveCard(monitor.getItem().index, props.index);
    } else if (type === ItemTypes.CONTENT || type === ItemTypes.ROW) {
      props.handleDrop(monitor.getItem(), props.index);
    }
  }

  // candrop 없어야 drop이 뜸

  // hover(props, monitor, component) {
  //   // Determine rectangle on screen
  //   const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

  //   // Get vertical middle
  //   const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  //   // Determine mouse position
  //   const clientOffset = monitor.getClientOffset();

  //   // Get pixels to the top
  //   const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  //   // Only perform the move when the mouse has crossed half of the items height
  //   // When dragging downwards, only move when the cursor is below 50%
  //   // When dragging upwards, only move when the cursor is above 50%
  //   // Dragging downwards
  //   // console.log(hoverBoundingRect.top);

  //   // Time to actually perform the action
  //   // Note: we're mutating the monitor item here!
  //   // Generally it's better to avoid mutations,
  //   // but it's good here for the sake of performance
  //   // to avoid expensive index searches.
  // }
};

class BlockBuilder extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool.isRequired,
    didDrop: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      drop: false
    };
  }

  dragItem = drag => {
    console.log(drag);
    this.setState({ drop: true, drag });
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
      this.setState({ hover: true });
    }
    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
      this.setState({
        hover: false
      });
    }
    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  render() {
    const { connectDropTarget } = this.props;
    const opacity = !this.state.hover ? "0" : "1";
    return (
      connectDropTarget &&
      connectDropTarget(
        <div>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.3s ease",
              height: "10px",
              opacity
            }}
          >
            <div
              className={classnames(
                "builder",
                this.state.hover ? "builder-hover" : null
              )}
              style={{ ...builderStyle }}
            >
              Drop Here {this.props.id}
            </div>
            <div style={{ ...barStyle }} />
          </div>
          {this.state.drop ? (
            <div className="drag">
              <button onClick={() => console.log(this.state.drag)} />
            </div>
          ) : (
            <div className="notdrag" />
          )}
        </div>
      )
    );
  }
}

export default DropTarget(
  [ItemTypes.CARD, ItemTypes.CONTENT],
  builderTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    didDrop: monitor.didDrop()
  })
)(BlockBuilder);
