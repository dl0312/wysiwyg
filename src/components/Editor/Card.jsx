import React from "react";
import PropTypes from "prop-types";
import { DragSource, DropTarget } from "react-dnd";
import ItemTypes from "./ItemTypes";
import classnames from "classnames";
import styled from "styled-components";
import EditorDefaults from "./EditorDefaults";
import { findDOMNode } from "react-dom";
import { LAST_CHILD_TYPE_INVALID } from "slate-schema-violations";
import flow from "lodash.flow";

const style = {
  backgroundColor: "transparent",
  width: "99%",
  position: "relative",
  padding: "0.1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const Handle = styled.div`
  background-color: #9c88ff;
  width: 2rem;
  height: 2rem;
  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: absolute;
  top: 50%;
  transform: translate(2px, -16px);
  margin-left: -2px;
  right: 0px;
`;

const Button = styled.button`
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
  display: flex;
  position: absolute;
  margin-right: 0.75rem;
  cursor: -webkit-grab;
  align-items: center;
  justify-content: center;
  color: white;
  top: 50%;
  transform: translate(12px, -16px);
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
    if (type === ItemTypes.COLUMN) {
      let index = props.index;
      if (dropPosition === "over") {
        index -= 1;
        props.moveCard(monitor.getItem().index, index);
      } else if (dropPosition === "under") {
        // index += 1;
        props.moveCard(monitor.getItem().index, index);
      }
    } else if (type === ItemTypes.ROW) {
      let index = props.index;
      console.log(index);
      if (dropPosition === "over") {
        // index -= 1;
        console.log(index);
        props.handleDrop(monitor.getItem(), index);
      } else if (dropPosition === "under") {
        index += 1;
        console.log(index);
        props.handleDrop(monitor.getItem(), index);
      }
    }
  }
};

const cardSource = {
  beginDrag(props, monitor, component) {
    props.masterCallback("OnDrag", "columnList");
    return { index: props.index };
  },
  endDrag(props, monitor, component) {
    props.masterCallback("OnDrag", null);
    return { index: props.index };
  }
};

class Card extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
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
    this.props.callbackfromparent("mouseover", this.props.index);
  };

  handleOnMouseOverTool = event => {
    this.setState({
      toolHover: true
    });
  };

  handleOnMouseLeaveTool = event => {
    event.stopPropagation();
    this.setState({
      toolHover: false
    });
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
      connectDropTarget,
      connectDragPreview,
      index,
      isOver,
      callbackfromparent,
      selectedIndex,
      hoveredIndex
    } = this.props;
    const opacity = isDragging ? 0.2 : 1;
    const hover = hoveredIndex === index;
    const active = selectedIndex === index;

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDropTarget(
        connectDragPreview(
          <div
            className={classnames(
              "frame",
              hover ? "blockHover" : null,
              active ? "blockActive" : null
            )}
            style={{
              ...style,
              opacity,
              transition: "border 0.5s ease, opacity 0.5s ease",
              border: active
                ? "2px solid black"
                : hover
                  ? "2px solid grey"
                  : "2px solid transparent"
              // borderTop:
              //   this.state.hoverPosition === "over" && isOver
              //     ? "2px solid darkblue"
              //     : "2px solid transparent",
              // borderBottom:
              //   this.state.hoverPosition === "under" && isOver
              //     ? "2px solid darkblue"
              //     : "2px solid transparent"
            }}
            onMouseOver={this.handleOnMouseOver}
            onMouseDown={this.handleOnMouseDown}
            onMouseLeave={this.handleOnMouseLeave}
          >
            <Builder
              display={this.props.OnDrag === "columnList"}
              state={
                this.props.OnDrag === "columnList"
                  ? this.state.hoverPosition === "over" && isOver
                    ? "ISOVER"
                    : "ONDRAG"
                  : "INVISIBLE"
              }
              position="over"
            />
            {hover || active ? (
              <div>
                {this.state.toolHover ? (
                  <Tool onMouseLeave={this.handleOnMouseLeaveTool}>
                    <Button
                      onClick={() => {
                        callbackfromparent("delete", index, this);
                      }}
                      style={{
                        borderTopLeftRadius: "100%",
                        borderBottomLeftRadius: "100%"
                      }}
                    >
                      <i className="fas fa-trash-alt" />
                    </Button>
                    <Button
                      onClick={() => {
                        callbackfromparent("duplicate", index, this);
                      }}
                    >
                      <i className="far fa-copy" />
                    </Button>
                    {connectDragSource(
                      <div>
                        <Button>
                          <i className="fas fa-arrows-alt" />
                        </Button>
                      </div>
                    )}
                  </Tool>
                ) : (
                  <Handle onMouseOver={this.handleOnMouseOverTool}>
                    <i className="fas fa-ellipsis-h" />
                  </Handle>
                )}
              </div>
            ) : null}
            {this.props.children}
            <Builder
              display={this.props.OnDrag === "columnList"}
              state={
                this.props.OnDrag === "columnList"
                  ? this.state.hoverPosition === "under" && isOver
                    ? "ISOVER"
                    : "ONDRAG"
                  : "INVISIBLE"
              }
              position="under"
            />
          </div>
        )
      )
    );
  }
}

export default flow(
  DropTarget(
    [ItemTypes.COLUMN, ItemTypes.ROW],
    cardTarget,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    })
  ),
  DragSource(ItemTypes.COLUMN, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }))
)(Card);
