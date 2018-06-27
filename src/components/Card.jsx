import React from "react";
import PropTypes from "prop-types";
import {
  DragSource,
  ConnectDragSource,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDragPreview
} from "react-dnd";
import ItemTypes from "./ItemTypes";
import classnames from "classnames";

const style = {
  backgroundColor: "transparent",
  width: "99%",
  position: "relative",
  marginBottom: "0.2rem",
  padding: "0.1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const handleStyle = {
  backgroundColor: "#9c88ff",
  width: "2rem",
  height: "2rem",
  borderTopLeftRadius: "100%",
  borderBottomLeftRadius: "100%",
  marginRight: "0.75rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  position: "absolute",
  top: "50%",
  transform: "translate(12px,-16px)",
  marginLeft: "-2px",
  right: "0px"
};

const buttonStyle = {
  border: "none",
  outline: "none",
  backgroundColor: "#9c88ff",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2rem",
  height: "2rem",
  marginBottom: "10px",
  cursor: "pointer"
};

const toolStyle = {
  display: "flex",
  position: "absolute",
  marginRight: "0.75rem",
  cursor: "-webkit-grab",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  top: "50%",
  transform: "translate(12px,-16px)",
  marginLeft: "-2px",
  right: "0px"
};

const cardSource = {
  beginDrag(props, monitor, component) {
    return { index: props.index };
  },
  endDrag(props, monitor, component) {
    return { index: props.index };
  }
  // canDrag(props, monitor) {},
  // isDragging(props, monitor) {}
};

class Card extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    id: PropTypes.any.isRequired,
    moveCard: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    callbackfromparent: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      active: false,
      toolHover: false
    };
  }

  componentDidMount() {
    const { connectDragPreview } = this.props;
    let img = new Image();
    img.src =
      "http://iconbug.com/data/ab/48/2d2ce45a67022a830dfd8692ec75c8b1.png";
    img.onload = () => {
      connectDragPreview && connectDragPreview(img);
    };
  }

  handleOnMouseOver = event => {
    event.stopPropagation();
    // console.log(event.target);

    this.setState({
      hover: true
    });
    // console.log(`card in hover true`);
  };

  handleOnMouseOverTool = event => {
    this.setState({
      toolHover: true
    });
    // console.log(`tool in toolHover true`);
  };

  handleOnMouseLeaveTool = event => {
    event.stopPropagation();

    this.setState({
      toolHover: false
    });
    // console.log(`tool out toolHover true`);
  };

  handleOnMouseDown = event => {
    event.stopPropagation();
    if (this.state.hover === true) {
      this.setState({ hover: false });
    }
    this.state.active
      ? this.setState({
          active: false,
          hover: true
        })
      : this.setState({ active: true });
  };

  handleOnMouseLeave = event => {
    event.stopPropagation();
    this.setState({ hover: false, toolHover: false });
    // console.log(`card out hover false`);
  };

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDragPreview,
      index,
      callbackfromparent
    } = this.props;
    const opacity = isDragging ? 0.2 : 1;
    return (
      connectDragPreview &&
      connectDragSource &&
      connectDragPreview(
        <div
          style={{ ...style, opacity }}
          className={classnames(
            "frame",
            this.state.hover ? "hover" : null,
            this.state.active ? "active" : null
          )}
          onMouseOver={this.handleOnMouseOver}
          onMouseDown={this.handleOnMouseDown}
          onMouseLeave={this.handleOnMouseLeave}
        >
          {this.state.hover || this.state.active ? (
            <div>
              {this.state.toolHover ? (
                <div
                  onMouseLeave={this.handleOnMouseLeaveTool}
                  style={{ ...toolStyle }}
                >
                  <button
                    onClick={() => {
                      callbackfromparent("delete", index, this);
                    }}
                    style={{
                      ...buttonStyle,
                      borderTopLeftRadius: "100%",
                      borderBottomLeftRadius: "100%"
                    }}
                  >
                    <i class="fas fa-trash-alt" />
                  </button>
                  <button
                    onClick={() => {
                      callbackfromparent("duplicate", index, this);
                    }}
                    style={buttonStyle}
                  >
                    <i class="far fa-copy" />
                  </button>
                  {connectDragSource(
                    <button style={buttonStyle}>
                      <i class="fas fa-arrows-alt" />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  onMouseOver={this.handleOnMouseOverTool}
                  style={{ ...handleStyle }}
                >
                  <i class="fas fa-ellipsis-h" />
                </div>
              )}
            </div>
          ) : null}
          {this.props.children}
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(Card);
