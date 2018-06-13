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

const update = require("immutability-helper");
const boxTarget = {
  hover(props, monitor, component) {
    const isJustOverThisOne = monitor.isOver({ shallow: true });
    if (!component.state.contentHover && isJustOverThisOne) {
      console.log(`hover on the editleft!`);
      component.handleDrop(monitor.getItem());
      component.setState({ contentHover: !component.state.contentHover });
    }
  },
  drop(props, monitor, component) {
    component.setState({ contentHover: !component.state.contentHover });

    // component.handleDrop(monitor.getItem());
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
        { id: 1, OnDrag: "content", content: "BUTTON" },
        { id: 2, OnDrag: "content", content: "DIVIDER" },
        { id: 3, OnDrag: "content", content: "HTML" },
        { id: 4, OnDrag: "content", content: "IMAGE" },
        { id: 5, OnDrag: "content", content: "TEXT" },
        { id: 6, OnDrag: "content", content: "TEXT" },
        { id: 7, OnDrag: "content", content: "TEXT" }
      ]
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

  addCard = orderItem => {
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
    let backgroundColor = "rgba(0,0,0,0.5)";
    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = "darkgreen";
    }
    return (
      connectDropTarget &&
      connectDropTarget(
        <div
          style={{ backgroundColor }} //   }, ${this.props.color.a})` //     this.props.color.b //   background: `rgba(${this.props.color.r}, ${this.props.color.g}, ${ // style={{
          // }}
          className={styles.editor}
          id="container"
          onDragOver={this.allowDrop}
          onDrop={this.handleOnDrop}
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
                addCard={this.addCard}
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

export default DropTarget(ItemTypes.CONTENT, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))(EditorLeft);
