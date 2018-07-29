import React from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import ItemTypes from "./ItemTypes";
import classnames from "classnames";
import styled from "styled-components";

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
  margin-right: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: absolute;
  top: 50%;
  transform: translate(12px, -16px);
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
      connectDragPreview,
      index,
      callbackfromparent,
      selectedIndex,
      hoveredIndex
    } = this.props;
    const opacity = isDragging ? 0.2 : 1;
    const hover = hoveredIndex === index;
    const active = selectedIndex === index;

    return (
      connectDragPreview &&
      connectDragSource &&
      connectDragPreview(
        <div
          style={{ ...style, opacity }}
          className={classnames(
            "frame",
            hover ? "blockHover" : null,
            active ? "blockActive" : null
          )}
          onMouseOver={this.handleOnMouseOver}
          onMouseDown={this.handleOnMouseDown}
          onMouseLeave={this.handleOnMouseLeave}
        >
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
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.COLUMN, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(Card);
