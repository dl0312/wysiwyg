import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import ItemTypes from "./ItemTypes";
import { DropTarget } from "react-dnd";

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
    if (type === ItemTypes.COLUMN) {
      props.moveCard(monitor.getItem().index, props.index);
    } else if (type === ItemTypes.ROW) {
      props.handleDrop(monitor.getItem(), props.index);
    }
  }
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
  [ItemTypes.ROW, ItemTypes.COLUMN],
  builderTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    didDrop: monitor.didDrop()
  })
)(Builder);
