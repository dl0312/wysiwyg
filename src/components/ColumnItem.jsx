import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./ColumnItem.scss";

import ColumnCard from "./ColumnCard";
import flow from "lodash.flow";
import ItemTypes from "./ItemTypes";

import {
  DropTarget,
  connectDropTarget,
  DragDropContext,
  DropTargetMonitor
} from "react-dnd";
import { Transform } from "stream";
const update = require("immutability-helper");

const boxTarget = {
  drop(props, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild && !props.greedy) {
      return;
    }

    component.setState({
      hasDropped: true,
      hasDroppedOnChild
    });
    component.handleDrop(monitor.getItem());

    // const hasDroppedOnChild = monitor.didDrop();
    // if (hasDroppedOnChild && !props.greedy) {
    //   return;
    // }
    // component.setState({
    //   hasDropped: true,
    //   hasDroppedOnChild
    // });
  }
};

class ColumnItem extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool.isRequired,
    greedy: PropTypes.bool,
    children: PropTypes.node
  };
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      hasDropped: false,
      hasDroppedOnChild: false,
      contentHover: false,
      cards: this.props.columnList
    };
  }

  handleDrop = orderItem => {
    // var joined = this.state.cards.concat(orderItem);
    // this.setState({ cards: joined });
    if (!!orderItem) {
      console.log(orderItem);
      orderItem = { id: this.state.cards.length + 1, ...orderItem };
      console.log([orderItem]);
      this.setState({
        cards: update(this.state.cards, { $push: [orderItem] })
      });
      console.log(this.state.cards);
    }
  };

  moveCard = (dragIndex, hoverIndex) => {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    );
  };

  render() {
    // 기본상태의 에디터화면 id=container, id=body
    const {
      greedy,
      isOver,
      isOverCurrent,
      connectDropTarget,
      children
    } = this.props;
    const { cards, hasDropped, hasDroppedOnChild } = this.state;
    let backgroundColor = cards.length === 0 ? "#f6e58d" : "white";
    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = "#b8e994";
    }
    const columnStyle = {
      outline: "0.5px dashed #8c7ae6",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor
    };

    const insertTextStyle = {
      height: "100px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      color: "#5758BB"
    };

    return (
      connectDropTarget &&
      connectDropTarget(
        <div className="column" style={columnStyle}>
          {cards.length !== 0 ? null : (
            <div style={insertTextStyle}>
              INSERT<br />CONTENT
            </div>
          )}
          {cards.map((card, index) => (
            <ColumnCard
              inColumn={true}
              cards={this.state.cards.length}
              key={card.id}
              index={index}
              id={card.id}
              OnDrag={card.OnDrag}
              content={card.content}
              moveCard={this.moveCard}
            />
          ))}
        </div>
      )
    );
  }
}

export default DropTarget(ItemTypes.CONTENT, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))(ColumnItem);
