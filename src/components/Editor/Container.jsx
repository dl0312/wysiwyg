import React, { Component } from "react";
import { Editor } from "slate-react";
import classnames from "classnames";
import ItemTypes from "./ItemTypes";
import PropTypes from "prop-types";
import { DragSource, DropTarget } from "react-dnd";
import { Value, Block } from "slate";
import styled from "styled-components";
import { findDOMNode } from "react-dom";
import { LAST_CHILD_TYPE_INVALID } from "slate-schema-violations";
import flow from "lodash.flow";
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

const Builder = styled.div`
  /* display: ${props => (props.display ? "block" : "none")}; */
  position: absolute;
  z-index:${props => (props.state === "ISOVER" ? "999" : null)};
  top: ${props => (props.position === "over" ? "-4px" : null)};
  bottom: ${props => (props.position === "under" ? "-4px" : null)};
  text-align: center;
  color: white;
  background-color: ${props => {
    switch (props.state) {
      case "ONDRAG":
        return EditorDefaults.BUILDER_ONDRAG_COLOR;
      case "ISOVER":
        return EditorDefaults.BUILDER_ISOVER_COLOR;
      default:
        return "transparent";
    }
  }};
  border-radius: 5px;
  font-size: 12px;
  padding: 2px 10px;
  transition:  background-color 0.5s ease;
  width: 100%;
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

const cardTarget = {
  hover(props, monitor, component) {
    const isJustOverThisOne = monitor.isOver({ shallow: true });
    if (isJustOverThisOne) {
      const item = monitor.getItem();
      let dragIndex = monitor.getItem().index;
      if (
        monitor.getItemType() === "content" &&
        monitor.getItem().index === undefined
      ) {
        dragIndex = props.cards - 1;
      }
      const hoverIndex = props.index;
      // console.log(item.isNew + ", " + monitor.getItem().index);

      // console.log(dragIndex + ", " + hoverIndex);

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      const position =
        clientOffset.y < hoverBoundingRect.y + hoverMiddleY ? "over" : "under";

      if (position === "over") {
        component.setState({ hoverPosition: "over" });
      } else if (position === "under") {
        component.setState({ hoverPosition: "under" });
      }

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
      // props.moveCard(dragIndex, hoverIndex);

      // // Note: we're mutating the monitor item here!
      // // Generally it's better to avoid mutations,
      // // but it's good here for the sake of performance
      // // to avoid expensive index searches.
      // monitor.getItem().index = hoverIndex;
    }
  },

  drop(props, monitor, component) {
    component.setState({ hoverPosition: null });
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    const dropPosition =
      clientOffset.y < hoverBoundingRect.y + hoverMiddleY ? "over" : "under";
    console.log(clientOffset.y < hoverBoundingRect.y + hoverMiddleY);

    const type = monitor.getItemType();

    props.masterCallback("OnDrag", null);
    if (type === ItemTypes.CARD) {
      const index = props.index;
      if (dropPosition === "over") {
        // index[2] -= 1;
        props.moveCard(monitor.getItem().index, index);
      } else if (dropPosition === "under") {
        index[2] += 1;
        props.moveCard(monitor.getItem().index, index);
      }
    } else if (type === ItemTypes.CONTENT) {
      const index = props.index;
      console.log(index);
      if (dropPosition === "over") {
        // index[2] -= 1;
        console.log(index);
        props.handleDrop(monitor.getItem(), index);
      } else if (dropPosition === "under") {
        index[2] += 1;
        console.log(index);
        props.handleDrop(monitor.getItem(), index);
      }
    }
  }
};

const schema = {
  document: {
    last: { type: "paragraph" },
    normalize: (change, reason, { node, child }) => {
      switch (reason) {
        case LAST_CHILD_TYPE_INVALID: {
          const paragraph = Block.create("paragraph");
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
        default:
          return;
      }
    }
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
      hoverPosition: null,
      hover: false,
      active: false,
      toolHover: false
    };
  }

  showInner = active => {
    if (this.props.item.type === "content") {
      switch (this.props.item.content) {
        case "BUTTON":
          let value = null;
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
            this.props.handleOnChange(
              { value },
              this.props.index,
              "BUTTON",
              "TEXT_CHANGE"
            );
          } else {
            value = this.props.item.value;
          }
          return (
            <Button
              item={this.props.item}
              index={this.props.index}
              value={value}
              active={active}
              handleOnChange={this.props.handleOnChange}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "DIVIDER":
          return <Divider active={active} />;
        case "HTML":
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
            this.props.handleOnChange(
              { value },
              this.props.index,
              "BUTTON",
              "TEXT_CHANGE"
            );
          } else {
            value = this.props.item.value;
          }
          return (
            <Html
              value={value}
              index={this.props.index}
              active={active}
              handleOnChange={this.props.handleOnChange}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "IMAGE":
          return (
            <Image
              active={active}
              src={this.props.item.imageSrc}
              fullWidth={this.props.item.fullWidth}
              contentWidth={this.props.contentWidth}
            />
          );
        case "TEXT":
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
            this.props.handleOnChange(
              { value },
              this.props.index,
              "BUTTON",
              "TEXT_CHANGE"
            );
          } else {
            value = this.props.item.value;
          }
          return (
            <Text
              value={value}
              schema={schema}
              index={this.props.index}
              item={this.props.item}
              active={active}
              handleOnChange={this.props.handleOnChange}
              // onDropOrPaste={this.props.onDropOrPaste}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "VIDEO":
          return (
            <Video
              active={active}
              src={this.props.item.videoSrc}
              contentWidth={this.props.item.contentWidth}
            />
          );
        case "SOCIAL":
          return <Social active={active} />;
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
    // event.stopPropagation();
    this.setState({
      toolHover: true
    });
  };

  handleOnMouseLeaveTool = event => {
    event.stopPropagation();

    this.setState({
      toolHover: false
    });
    console.log(`tool out toolHover true`);
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
      connectDropTarget,
      index,
      callbackfromparent,
      hoveredIndex,
      selectedIndex,
      isOver
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
      connectDragSource &&
      connectDropTarget &&
      connectDropTarget(
        connectDragPreview(
          <div
            className={classnames(
              "container",
              hover ? "blockHover" : null,
              active ? "blockActive" : null
            )}
            item={this.props.item}
            style={
              {
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
                opacity,
                transition: "border 0.5s ease, opacity 0.5s ease",
                border: active
                  ? "2px solid black"
                  : hover
                    ? "2px solid grey"
                    : "2px solid transparent"
              }
              // borderTop:
              //   this.state.hoverPosition === "over" && isOver
              //     ? "2px solid darkblue"
              //     : "2px solid transparent",
              // borderBottom:
              //   this.state.hoverPosition === "under" && isOver
              //     ? "2px solid darkblue"
              //     : "2px solid transparent"
            }
            onMouseOver={this.handleOnMouseOver}
            onMouseDown={this.handleOnMouseDown}
            onMouseLeave={this.handleOnMouseLeave}
          >
            <Builder
              display={this.props.OnDrag === "content"}
              state={
                this.props.OnDrag === "content"
                  ? this.state.hoverPosition === "over" && isOver
                    ? "ISOVER"
                    : "ONDRAG"
                  : "INVISIBLE"
              }
              position="over"
            >
              {/* BLOCK HERE */}
            </Builder>
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
            <Builder
              display={this.props.OnDrag === "content"}
              state={
                this.props.OnDrag === "content"
                  ? this.state.hoverPosition === "under" && isOver
                    ? "ISOVER"
                    : "ONDRAG"
                  : "INVISIBLE"
              }
              position="under"
            >
              {/* BLOCK HERE */}
            </Builder>
          </div>
        )
      )
    );
  }
}

export default flow(
  DropTarget(
    [ItemTypes.CARD, ItemTypes.CONTENT],
    cardTarget,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    })
  ),
  DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }))
)(Container);

const ButtonContainer = styled.div`
  color: ${props =>
    `rgba(${props.textColor.r}, ${props.textColor.g}, ${props.textColor.b}, ${
      props.textColor.a
    })`};
  background-color: ${props =>
    `rgba(${props.backgroundColor.r}, ${props.backgroundColor.g}, ${
      props.backgroundColor.b
    }, ${props.backgroundColor.a})`};
  /* &:hover {
    background-color: ${props =>
      `rgba(${props.hoverColor.r}, ${props.hoverColor.g}, ${
        props.hoverColor.b
      }, ${props.textColor.a})`};
  } */
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
  pointer-events: text;
`;

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = change => {
    const operation = change.operations.toJS();
    console.log(operation);
    this.props.handleOnChange(
      change,
      this.props.index,
      "BUTTON",
      "TEXT_CHANGE"
    );
  };

  render() {
    return (
      <ButtonContainer
        textColor={this.props.item.textColor}
        backgroundColor={this.props.item.backgroundColor}
        hoverColor={this.props.item.hoverColor}
      >
        <Editor
          value={this.props.value}
          readOnly={false}
          onChange={this.onChange}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
          autoCorrect={false}
          spellCheck={false}
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
          borderBottom: "0 solid transparent",
          width: this.props.fullWidth ? "100%" : null
        }}
      >
        <img
          style={{
            width: "100%"
          }}
          src={this.props.src}
          alt="logo"
        />
      </div>
    );
  }
}

const TextContainer = styled.div`
  color: ${props =>
    `rgba(${props.textColor.r}, ${props.textColor.g}, ${props.textColor.b}, ${
      props.textColor.a
    })`};
  text-align: ${props => props.textAlign};
  line-height: 140%;
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
`;

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = change => {
    const operation = change.operations.toJS();
    this.props.handleOnChange(change, this.props.index, "TEXT", "TEXT_CHANGE");
  };

  render() {
    return (
      <TextContainer
        textColor={this.props.item.textColor}
        textAlign={
          this.props.item.textAlign ? this.props.item.textAlign : "left"
        }
      >
        <Editor
          style={{
            color: "rgba(0,0,0,1)",
            fontFamily: "Nanum Gotic",
            fontSize: "16px",
            wordBreak: "break-word"
          }}
          schema={this.props.schema}
          value={this.props.value}
          readOnly={false}
          onChange={this.onChange}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
          autoCorrect={false}
          spellCheck={false}
        />
      </TextContainer>
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
          title="youtube"
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
