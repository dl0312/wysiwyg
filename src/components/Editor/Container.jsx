import React, { Component } from "react";
import { Editor } from "slate-react";
import classnames from "classnames";
import ItemTypes from "./ItemTypes";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import { Value } from "slate";
import styled from "styled-components";
import EditorDefaults from "./EditorDefaults";

const Handle = styled.div`
  background-color: #9c88ff;
  width: 2rem;
  height: 2rem;
  border-top-right-radius: 100%;
  border-bottom-right-radius: 100%;
  margin-right: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: absolute;
  top: 50%;
  right: 0px;
  margin-left: -2px;
  z-index: 100;
  transform: translate(44px, -16px);
`;

const ButtonOption = styled.button`
  border: none;
  outline: none;
  background-color: #9c88ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-bottom: 10px;
  cursor: pointer;
`;

const Tool = styled.div`
  z-index: 100;
  display: flex;
  position: absolute;
  margin-right: 0.75rem;
  cursor: -webkit-grab;
  align-items: center;
  justify-content: center;
  color: white;
  top: 50%;
  transform: translate(108px, -16px);
  margin-left: -2px;
  right: 0px;
`;

const cardSource = {
  beginDrag(props, monitor, component) {
    props.masterCallback("OnDrag", "content");
    return { index: props.index };
  },
  endDrag(props, monitor, component) {
    props.masterCallback("OnDrag", null);
    return { index: props.index };
  }
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
    if (this.props.item.type === "content") {
      switch (this.props.item.content) {
        case "BUTTON":
          let value = null;
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
          } else {
            value = this.props.item.value;
          }
          return (
            <Button
              item={this.props.item}
              value={value}
              selected={selected}
              onChange={this.props.onChange}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "DIVIDER":
          return <Divider selected={selected} />;
        case "HTML":
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
          } else {
            value = this.props.item.value;
          }
          return (
            <Html
              value={value}
              selected={selected}
              onChange={this.props.onChange}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "IMAGE":
          return (
            <Image
              selected={selected}
              src={this.props.item.imageSrc}
              fullWidth={this.props.item.fullWidth}
              contentWidth={this.props.contentWidth}
            />
          );
        case "TEXT":
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
          } else {
            value = this.props.item.value;
          }
          return (
            <Text
              value={value}
              item={this.props.item}
              selected={selected}
              onChange={this.props.onChange}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "VIDEO":
          return (
            <Video
              selected={selected}
              src={this.props.item.videoSrc}
              contentWidth={this.props.item.contentWidth}
            />
          );
        case "SOCIAL":
          return <Social selected={selected} />;
        default:
          break;
      }
    }
  };

  handleOnMouseOver = event => {
    event.stopPropagation();
    this.props.callbackfromparent("mouseover", this.props.index);
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
    return (
      connectDragPreview &&
      connectDragSource &&
      connectDragPreview(
        <div
          className={classnames(
            "container",
            hover ? "blockHover" : null,
            active ? "blockActive" : null
          )}
          item={this.props.item}
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            padding: "10px",
            width: "100%",
            justifyContent:
              this.props.item.content === "TEXT" ||
              this.props.item.content === "BUTTON" ||
              this.props.item.content === "HTML" ||
              this.props.item.content === "IMAGE" ||
              this.props.item.content === "VIDEO"
                ? this.props.item.align
                  ? this.props.item.align
                  : "center"
                : "center",
            opacity
          }}
          onMouseOver={this.handleOnMouseOver}
          onMouseDown={this.handleOnMouseDown}
          onMouseLeave={this.handleOnMouseLeave}
        >
          {hover || active ? (
            <div>
              {this.state.toolHover ? (
                <Tool onMouseLeave={this.handleOnMouseLeaveTool}>
                  <ButtonOption
                    onClick={() => {
                      console.log(index);
                      callbackfromparent("delete", index, this);
                    }}
                  >
                    <i className="fas fa-trash-alt" />
                  </ButtonOption>
                  <ButtonOption
                    onClick={() => {
                      callbackfromparent("duplicate", index, this);
                    }}
                  >
                    <i className="far fa-copy" />
                  </ButtonOption>
                  {connectDragSource(
                    <button
                      style={{
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
                        cursor: "pointer",
                        borderTopRightRadius: "100%",
                        borderBottomRightRadius: "100%"
                      }}
                    >
                      <i className="fas fa-arrows-alt" />
                    </button>
                  )}
                </Tool>
              ) : (
                <Handle onMouseOver={this.handleOnMouseOverTool}>
                  <i className="fas fa-ellipsis-h" />
                </Handle>
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

const ButtonContainer = styled.div`
  color: ${props =>
    `rgba(${props.textColor.r}, ${props.textColor.g}, ${props.textColor.b}, ${
      props.textColor.a
    })`};
  background-color: ${props =>
    `rgba(${props.backgroundColor.r}, ${props.backgroundColor.g}, ${
      props.textColor.b
    }, ${props.backgroundColor.a})`};
  &:hover {
    background-color: ${props =>
      `rgba(${props.hoverColor.r}, ${props.hoverColor.g}, ${
        props.hoverColor.b
      }, ${props.textColor.a})`};
  }
  text-align: center;
  line-height: 120%;
  border-top: 0 solid transparent;
  border-right: 0 solid transparent;
  border-left: 0 solid transparent;
  border-bottom: 0 solid transparent;
  border-radius: 4px;
  padding-top: 10px;
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: 10px;
`;

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props.item);
    return (
      <ButtonContainer
        textColor={this.props.item.textColor}
        backgroundColor={this.props.item.backgroundColor}
        hoverColor={this.props.item.hoverColor}
      >
        <Editor
          autoFocus
          value={this.props.value}
          readOnly={this.props.selected ? false : true}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
        />
      </ButtonContainer>
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
          autoFocus
          value={this.props.value}
          readOnly={false}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
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

const TextContainer = styled.div``;

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
          textAlign: this.props.item.textAlign
            ? this.props.item.textAlign
            : "left",
          lineHeight: "140%",
          paddingTop: "10px",
          paddingRight: "10px",
          paddingLeft: "10px",
          paddingBottom: "10px"
        }}
      >
        <Editor
          autoFocus
          value={this.props.value}
          readOnly={this.props.selected ? false : true}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
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
          position: "relative",
          width: "100%",
          height: "0",
          paddingBottom: "56.25%",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <iframe
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%"
          }}
          width="560"
          height="315"
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
