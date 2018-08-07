import React, { Component } from "react";
import PropTypes from "prop-types";
import ItemTypes from "./ItemTypes";
import { DropTarget } from "react-dnd";
import styled from "styled-components";

const Bar = styled.div`
  width: 100%;
  outline: darkblue solid 1px;
`;

const Builder = styled.div`
  text-align: center;
  color: white;
  background-color: darkblue;
  border-radius: 5px;
  font-size: 12px;
  padding: 2px 10px;
  position: absolute;
`;

const BuilderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  height: 10px;
  opacity: ${props => props.opacity};
`;

const builderTarget = {
  drop(props, monitor) {
    const type = monitor.getItemType();
    props.masterCallback("OnDrag", null);
    if (type === ItemTypes.CARD) {
      props.moveCard(monitor.getItem().index, props.index);
    } else if (type === ItemTypes.CONTENT) {
      props.handleDrop(monitor.getItem(), props.index);
    }
  }
};

class BlockBuilder extends Component {
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
      ? this.props.OnDrag !== "content"
        ? "0"
        : "0.5"
      : "1";
    return (
      connectDropTarget &&
      connectDropTarget(
        <div style={{ width: "100%" }}>
          <BuilderContainer opacity={opacity}>
            <Builder>BLOCK HERE</Builder>
            <Bar />
          </BuilderContainer>
        </div>
      )
    );
  }
}

export default DropTarget(
  [ItemTypes.CONTENT, ItemTypes.CARD],
  builderTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    didDrop: monitor.didDrop()
  })
)(BlockBuilder);
