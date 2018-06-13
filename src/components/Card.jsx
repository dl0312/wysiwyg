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
import { Editor } from "slate-react";
import { Value } from "slate";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white"
};

const handleStyle = {
  backgroundColor: "green",
  width: "1rem",
  height: "1rem",
  display: "inline-block",
  marginRight: "0.75rem",
  cursor: "move"
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
    const isJustOverThisOne = monitor.isOver({ shallow: true });
    if (isJustOverThisOne) {
      const item = monitor.getItem();
      let dragIndex = monitor.getItem().index;
      if (item.isNew && monitor.getItem().index === undefined) {
        console.log(`added!`);
        dragIndex = props.cards - 1;
      }
      const hoverIndex = props.index;
      console.log(item.isNew + ", " + monitor.getItem().index);

      console.log(dragIndex + ", " + hoverIndex);

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
  }
};

class Card extends React.Component {
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
      isOver,
      OnDrag,
      content
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDropTarget(
        connectDragSource(
          connectDragPreview(
            <div style={{ ...style, opacity }}>
              {connectDragSource(<div style={handleStyle} />)}
              <Container OnDrag={OnDrag} content={content} />
            </div>
          )
        )
      )
    );
  }
}

export default flow(
  DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(
    [ItemTypes.CARD, ItemTypes.CONTENT],
    cardTarget,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    })
  )
)(Card);

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showInner = () => {
    if (this.props.OnDrag === "content") {
      switch (this.props.content) {
        case "BUTTON":
          return <Button selected={this.props.selected} />;
        case "DIVIDER":
          return <Divider selected={this.props.selected} />;
        case "HTML":
          return <Html selected={this.props.selected} />;
        case "IMAGE":
          return <Image selected={this.props.selected} />;
        case "TEXT":
          return <Text selected={this.props.selected} />;
        default:
          break;
      }
    } else if (this.props.OnDrag === "columnList") {
      return (
        <Column
          selected={this.props.selected}
          columnArray={this.props.content}
        />
      );
    }
  };

  render() {
    return (
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          position: "relative"
        }}
      >
        {this.showInner()}
      </div>
    );
  }
}

class Button extends Component {
  constructor(props) {
    super(props);
    const initialValue = Value.fromJSON({
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
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

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
          value={this.state.value}
          readOnly={false}
          onChange={this.onChange}
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
      <div
        className="content"
        style={{
          width: "100%",
          borderBottom: "1px solid #BBBBBB"
        }}
      />
    );
  }
}

class Html extends Component {
  constructor(props) {
    super(props);
    const initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: "block",
            marks: {
              b: "bold"
            },
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [
                  {
                    text: "Hello, world!"
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

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
          value={this.state.value}
          readOnly={false}
          onChange={this.onChange}
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
          src="https://i.pinimg.com/originals/93/43/86/934386f5a1752c1769537e7cc053d422.gif"
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
    const initialValue = Value.fromJSON({
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
                    text: "A line of text in a paragraph."
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

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
        <Editor value={this.state.value} onChange={this.onChange} />
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
      height: "100px",
      display: "grid",
      gridTemplateColumns: this.props.columnArray.join("fr ") + "fr"
    };
    const columnStyle = {
      outline: "0.5px dashed darkblue",
      backgroundColor: "#9dc3d3",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
    return (
      <div className="columnList" style={columnListStyle}>
        {this.props.columnArray.map(() => (
          <div className="column" style={columnStyle}>
            Insert Content
          </div>
        ))}
      </div>
    );
  }
}
