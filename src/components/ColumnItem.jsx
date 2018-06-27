import React, { Component } from "react";
import PropTypes from "prop-types";
import Builder from "./BlockBuilder";
import Card from "./Card";
import Container from "./Container";

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
      contentHover: false
    };
  }
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
      selectedCardsId,
      children,
      cards
    } = this.props;
    const { hasDropped, hasDroppedOnChild } = this.state;
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

    const compArray = [];
    console.log(cards);
    cards.map((item, index) => {
      switch (item.type) {
        case "builder":
          compArray.push(
            <Builder
              id={item.id}
              index={this.props.index.concat(index)}
              moveCard={this.moveCard}
              handleDrop={this.props.handleDrop}
            />
          );
          break;
        case "content":
          compArray.push(
            <Container
              value={item.value}
              OnDrag={item.OnDrag}
              content={item.content}
              callbackfromparent={this.props.callbackfromparent}
              index={this.props.index.concat(index)}
              key={index}
              onChange={({ value }) => {
                this.handleOnChange({ value }, index);
              }}
            />
          );
          break;
        default:
          break;
      }
    });

    return (
      <div className="column" style={columnStyle}>
        {compArray}
        {cards.length !== 1 ? null : (
          <div style={insertTextStyle}>
            INSERT<br />CONTENT
          </div>
        )}
      </div>
    );
  }
}

export default ColumnItem;
