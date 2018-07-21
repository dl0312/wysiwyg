import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import ItemTypes from "./ItemTypes";
import { DropTarget, ConnectDropTarget, DropTargetMonitor } from "react-dnd";

const barStyle = {
  outline: "darkblue solid 1px"
};

const builderStyle = {
  textAlign: "center",
  color: "white",
  backgroundColor: "darkblue",
  borderRadius: "5px",
  fontSize: "12px",
  padding: "2px 15px",
  position: "absolute"
};

const builderTarget = {
  drop(props, monitor, component) {
    console.log("drop");
    const type = monitor.getItemType();
    props.masterCallback("OnDrag", null);

    console.log(type);
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

class Builder extends Component {
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
    const opacity = !this.state.hover
      ? this.props.OnDrag !== "columnList"
        ? "0"
        : "0.5"
      : "1";
    return (
      connectDropTarget &&
      connectDropTarget(
        <div style={{ width: "100%" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.3s ease",
              height: "5px",
              zIndex: "300",
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
              Column Here
            </div>
            <div style={{ ...barStyle, width: "100%" }} />
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
  [ItemTypes.ROW],
  builderTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    didDrop: monitor.didDrop()
  })
)(Builder);
