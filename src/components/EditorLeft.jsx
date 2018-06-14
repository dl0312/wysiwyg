import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./EditorLeft.scss";
import "./EditorLeft.css";

import Card from "./Card";
import flow from "lodash.flow";
import ItemTypes from "./ItemTypes";

import {
  DropTarget,
  connectDropTarget,
  DragDropContext,
  DropTargetMonitor
} from "react-dnd";
import { Motion, spring } from "react-motion";

const update = require("immutability-helper");
const boxTarget = {
  drop(props, monitor, component) {
    // component.setState({ contentHover: !component.state.contentHover });
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

class EditorLeft extends Component {
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
      cards: [
        {
          id: 1,
          OnDrag: "columnList",
          content: [1, 1, 1],
          columnListArray: [
            [{ id: 1, OnDrag: "content", content: "BUTTON" }],
            [],
            []
          ]
        },
        { id: 2, OnDrag: "content", content: "BUTTON" },
        { id: 3, OnDrag: "content", content: "DIVIDER" },
        { id: 4, OnDrag: "content", content: "HTML" },
        { id: 5, OnDrag: "content", content: "IMAGE" },
        { id: 6, OnDrag: "content", content: "TEXT" },
        { id: 7, OnDrag: "content", content: "TEXT" }
      ]
    };
  }

  handleDrop = hoverItem => {
    // var joined = this.state.cards.concat(orderItem);
    // this.setState({ cards: joined });
    if (!!hoverItem) {
      hoverItem = { id: this.state.cards.length + 1, ...hoverItem };
      this.setState({ hoverItem });
      console.log([hoverItem]);
      this.setState({
        cards: update(this.state.cards, { $push: [hoverItem] })
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
    let backgroundColor = `rgba(${this.props.color.r}, ${this.props.color.g}, ${
      this.props.color.b
    }, ${this.props.color.a})`;
    console.log(`Editleft: ${isOverCurrent} + ${isOver} + ${greedy}`);
    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = "#b8e994";
    }
    return (
      connectDropTarget &&
      connectDropTarget(
        <div
          style={{ backgroundColor }}
          className={styles.editor}
          id="container"
        >
          <div
            style={{
              width: `${this.props.contentWidth}px`,
              fontFamily: `${this.props.font}`
            }}
            id="body"
            className={styles.practice}
          >
            {cards.map((card, index) => (
              <Card
                inColumn={false}
                columnListArray={card.columnListArray}
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
        </div>
      )
    );
  }
}

export default DropTarget(
  [ItemTypes.CONTENT, ItemTypes.ROW],
  boxTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true })
  })
)(EditorLeft);
