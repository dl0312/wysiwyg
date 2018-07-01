import React, { Component } from "react";
import { Editor } from "slate-react";
// import { Value } from "slate";
import ColumnItem from "./ColumnItem";
import classnames from "classnames";
import ItemTypes from "./ItemTypes";
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

const handleStyle = {
  backgroundColor: "#9c88ff",
  width: "2rem",
  height: "2rem",
  borderTopRightRadius: "100%",
  borderBottomRightRadius: "100%",
  marginRight: "0.75rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  position: "absolute",
  zIndex: "100",
  top: "50%",
  transform: "translate(44px,-16px)",
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
  zIndex: "100",
  position: "absolute",
  marginRight: "0.75rem",
  cursor: "-webkit-grab",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  top: "50%",
  transform: "translate(108px,-16px)",
  marginLeft: "-2px",
  right: "0px"
};

const cardSource = {
  beginDrag(props, monitor, component) {
    return { index: props.index };
  },
  endDrag(props, monitor, component) {
    console.log(props.index);
    return { index: props.index };
  }
  // canDrag(props, monitor) {},
  // isDragging(props, monitor) {}
};

class Container extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    index: PropTypes.array.isRequired,
    isDragging: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      active: false,
      toolHover: false
    };
  }

  showInner = selected => {
    if (this.props.OnDrag === "content") {
      switch (this.props.content) {
        case "BUTTON":
          return (
            <Button
              value={this.props.value}
              selected={selected}
              onChange={this.props.onChange}
            />
          );
        case "DIVIDER":
          return <Divider selected={selected} />;
        case "HTML":
          return (
            <Html
              value={this.props.value}
              selected={selected}
              onChange={this.props.onChange}
            />
          );
        case "IMAGE":
          return (
            <Image
              selected={selected}
              src={this.props.imageSrc}
              fullWidth={this.props.fullWidth}
              contentWidth={this.props.contentWidth}
            />
          );
        case "TEXT":
          return (
            <Text
              value={this.props.value}
              selected={selected}
              onChange={this.props.onChange}
            />
          );
        case "VIDEO":
          return (
            <Video
              selected={selected}
              src={this.props.videoSrc}
              contentWidth={this.props.contentWidth}
            />
          );
        case "SOCIAL":
          return <Social selected={selected} />;
        default:
          break;
      }
    } else if (this.props.OnDrag === "columnList") {
      return (
        <Column
          selected={selected}
          columnArray={this.props.content}
          columnListArray={this.props.columnListArray}
          index={this.props.index}
          callbackfromparent={this.props.callbackfromparent}
          handleDrop={this.props.handleDrop}
          moveCard={this.props.moveCard}
          handleOnChange={this.props.handleOnChange}
          selectedIndex={this.props.selectedIndex}
          hoveredIndex={this.props.hoveredIndex}
        />
      );
    }
  };

  handleOnMouseOver = event => {
    event.stopPropagation();
    this.props.callbackfromparent("mouseover", this.props.index);
    // this.setState({
    //   hover: true
    // });
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
    this.props.callbackfromparent("select", this.props.index);
  };

  handleOnMouseLeave = event => {
    event.stopPropagation();
    this.props.callbackfromparent("mouseleave", this.props.index);
  };

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDragPreview,
      // OnDrag,
      // content,
      // id,
      index,
      callbackfromparent,
      hoveredIndex,
      selectedIndex
    } = this.props;
    const opacity = isDragging ? 0.2 : 1;
    const hover = hoveredIndex
      ? hoveredIndex.length === index.length &&
        hoveredIndex.every((v, i) => v === index[i])
        ? true
        : false
      : false;
    const active = selectedIndex
      ? selectedIndex.length === index.length &&
        selectedIndex.every((v, i) => v === index[i])
        ? true
        : false
      : false;
    // console.log(this.props.index);
    // console.log(hoveredIndex);
    // console.log(index);
    return (
      connectDragPreview &&
      connectDragSource &&
      connectDragPreview(
        <div
          className={classnames(
            "container",
            hover ? "hover" : null,
            active ? "active" : null
          )}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              this.props.align !== undefined ? this.props.align : "center",
            position: "relative",
            padding: "10px",
            width: this.props.contentWidth
              ? `${this.props.contentWidth}px`
              : "100%",
            opacity
          }}
          onMouseOver={this.handleOnMouseOver}
          onMouseDown={this.handleOnMouseDown}
          onMouseLeave={this.handleOnMouseLeave}
        >
          {hover || active ? (
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
                    style={{ ...buttonStyle }}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                  <button
                    onClick={() => {
                      callbackfromparent("duplicate", index, this);
                    }}
                    style={buttonStyle}
                  >
                    <i className="far fa-copy" />
                  </button>
                  {connectDragSource(
                    <button
                      style={{
                        ...buttonStyle,
                        borderTopRightRadius: "100%",
                        borderBottomRightRadius: "100%"
                      }}
                    >
                      <i className="fas fa-arrows-alt" />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  onMouseOver={this.handleOnMouseOverTool}
                  style={{ ...handleStyle }}
                >
                  <i className="fas fa-ellipsis-h" />
                </div>
              )}
            </div>
          ) : null}
          {this.showInner(active)}
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
    console.log(this.props.selected);
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
          readOnly={this.props.selected ? false : true}
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
          style={{
            width: this.props.fullWidth ? this.props.contentWidth : "100%"
          }}
          src={this.props.src}
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
          width={this.props.contentWidth - 100}
          height={(this.props.contentWidth - 100) * 0.5625}
          src={`https://www.youtube.com/embed/${this.props.src}?ecver=1`}
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
      width: "30px",
      height: "30px",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 2px"
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
          <i className="fab fa-twitter" />
        </button>
        <button style={{ ...buttonStyle, backgroundColor: "#3b5998" }}>
          <i className="fab fa-facebook-f" />
        </button>
        <button
          style={{
            ...buttonStyle,
            background:
              "radial-gradient(circle at 33% 100%, #FED373 4%, #F15245 30%, #D92E7F 62%, #9B36B7 85%, #515ECF)"
          }}
        >
          <i className="fab fa-instagram" />
        </button>
        <button style={{ ...buttonStyle, backgroundColor: "#ed3124" }}>
          <i className="fab fa-youtube" />
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
      gridGap: "10px",
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
            moveCard={this.props.moveCard}
            handleOnChange={this.props.handleOnChange}
            selectedIndex={this.props.selectedIndex}
            hoveredIndex={this.props.hoveredIndex}
          />
        ))}
      </div>
    );
  }
}