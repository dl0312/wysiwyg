import React, { Component } from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import ColumnItem from "./ColumnItem";
import classnames from "classnames";
import ItemTypes from "./ItemTypes";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
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
import flow from "lodash.flow";

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
    return {
      component
    };
  },
  endDrag(props, monitor, component) {
    console.log(component);
    return { component };
  }
  // canDrag(props, monitor) {},
  // isDragging(props, monitor) {}
};

class Container extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool,
    id: PropTypes.any.isRequired,
    selected: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      active: false,
      toolHover: false,
      value: Value.fromJSON({
        document: {
          nodes: [
            {
              object: "block",
              type: "paragraph",
              nodes: [
                {
                  object: "text",
                  leaves: [
                    {
                      text: "CLICK ME!"
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
    };
  }

  showInner = () => {
    if (this.props.OnDrag === "content") {
      switch (this.props.content) {
        case "BUTTON":
          return (
            <Button
              value={this.props.value}
              selected={this.props.selected}
              onChange={this.props.onChange}
            />
          );
        case "DIVIDER":
          return <Divider selected={this.props.selected} />;
        case "HTML":
          return (
            <Html
              value={this.props.value}
              selected={this.props.selected}
              onChange={this.props.onChange}
            />
          );
        case "IMAGE":
          return <Image selected={this.props.selected} />;
        case "TEXT":
          return (
            <Text
              value={this.props.value}
              selected={this.props.selected}
              onChange={this.props.onChange}
            />
          );
        case "VIDEO":
          return <Video selected={this.props.selected} />;
        case "SOCIAL":
          return <Social selected={this.props.selected} />;
        default:
          break;
      }
    } else if (this.props.OnDrag === "columnList") {
      return (
        <Column
          selected={this.props.selected}
          columnArray={this.props.content}
          columnListArray={this.props.columnListArray}
          index={this.props.index}
          callbackfromparent={this.props.callbackfromparent}
          handleDrop={this.props.handleDrop}
        />
      );
    }
  };

  handleOnMouseOver = event => {
    event.stopPropagation();
    this.setState({
      hover: true
    });
    // console.log(`card in hover true`);
  };

  handleOnMouseOverTool = event => {
    event.stopPropagation();
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
  };

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      OnDrag,
      content,
      id,
      index,
      callbackfromparent,
      contentWidth
    } = this.props;
    const opacity = isDragging ? 0.2 : 1;
    // console.log(this.props.index);

    return (
      connectDragPreview &&
      connectDragSource &&
      connectDragPreview(
        <div
          className={classnames(
            "container",
            this.state.hover ? "hover" : null,
            this.state.active ? "active" : null
          )}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "10px",
            width: `${this.props.contentWidth}px`,
            opacity
          }}
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
                      console.log(index);
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
          {this.showInner()}
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(Container);

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="content"
        style={{
          color: "white",
          backgroundColor: "#3AAEE0",
          textAlign: "center",
          lineHeight: "120%",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent",
          borderRadius: "4px",
          paddingTop: "10px",
          paddingRight: "20px",
          paddingLeft: "20px",
          paddingBottom: "10px"
        }}
      >
        <Editor
          value={this.props.value}
          readOnly={false}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

class Divider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="content" style={{ width: "100%", padding: "20px" }}>
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid black"
          }}
        />
      </div>
    );
  }
}

class Html extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="content"
        style={{
          color: "#373A3C",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <Editor
          value={this.props.value}
          readOnly={false}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        className="content"
        style={{
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <img
          src="https://media.giphy.com/media/26BoDtH35vKPiELnO/giphy.gif"
          alt="logo"
        />
      </div>
    );
  }
}

class Text extends Component {
  constructor(props) {
    super(props);
    this.props = {
      selected: false
    };
    this.state = {};
  }

  render() {
    return (
      <div
        className="content"
        style={{
          color: "black",
          textAlign: "left",
          lineHeight: "140%",
          paddingTop: "10px",
          paddingRight: "10px",
          paddingLeft: "10px",
          paddingBottom: "10px"
        }}
      >
        <Editor
          value={this.props.value}
          readOnly={false}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        className="content"
        style={{
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/TRmdXDH9b1s?ecver=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }
}

class Social extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const buttonStyle = {
      borderRadius: "100%",
      border: "none",
      color: "white",
      width: "40px",
      height: "40px",
      fontSize: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 5px"
    };
    return (
      <div
        className="content"
        style={{
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent",
          display: "flex"
        }}
      >
        <button style={{ ...buttonStyle, backgroundColor: "#1da1f2" }}>
          <i class="fab fa-twitter" />
        </button>
        <button style={{ ...buttonStyle, backgroundColor: "#3b5998" }}>
          <i class="fab fa-facebook-f" />
        </button>
        <button
          style={{
            ...buttonStyle,
            background:
              "radial-gradient(circle at 33% 100%, #FED373 4%, #F15245 30%, #D92E7F 62%, #9B36B7 85%, #515ECF)"
          }}
        >
          <i class="fab fa-instagram" />
        </button>
        <button style={{ ...buttonStyle, backgroundColor: "#ed3124" }}>
          <i class="fab fa-youtube" />
        </button>
      </div>
    );
  }
}

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const columnListStyle = {
      width: "100%",
      display: "grid",
      gridTemplateColumns: this.props.columnArray.join("fr ") + "fr"
    };
    return (
      <div className="columnList" style={columnListStyle}>
        {this.props.columnListArray.map((columnList, index) => (
          <ColumnItem
            key={index}
            cards={columnList}
            index={this.props.index.slice(0, 1).concat(index)}
            callbackfromparent={this.props.callbackfromparent}
            handleDrop={this.props.handleDrop}
          />
        ))}
      </div>
    );
  }
}
