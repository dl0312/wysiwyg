import React, { Component } from "react";
import PropTypes from "prop-types";
import Builder from "./BlockBuilder";
import Container from "./Container";
import styled from "styled-components";

const Column = styled.div`
  outline: 0.5px dashed #8c7ae6;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  outline: ${props =>
    props.hasBlock ? "0px solid black" : "0.5px dashed #8c7ae6"};
  background-color: ${props => props.bgc};
`;

const InsertText = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -10px;
  font-weight: 600;
  color: #5758bb;
`;

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
    this.state = {
      hasDropped: false,
      hasDroppedOnChild: false,
      contentHover: false
    };
  }

  render() {
    // 기본상태의 에디터화면 id=container, id=body
    const { greedy, isOver, isOverCurrent, contentWidth, cards } = this.props;
    let backgroundColor = cards.length === 1 ? "#f6e58d" : "white";
    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = "#b8e994";
    }

    const compArray = [];
    cards.map((item, index) => {
      switch (item.type) {
        case "builder":
          compArray.push(
            <Builder
              id={item.id}
              index={this.props.index.concat(index)}
              moveCard={this.props.moveCard}
              handleDrop={this.props.handleDrop}
              OnDrag={this.props.OnDrag}
              masterCallback={this.props.masterCallback}
            />
          );
          break;
        case "content":
          compArray.push(
            <Container
              type={item.type}
              value={item.value}
              imageSrc={item.imageSrc}
              videoSrc={item.videoSrc}
              content={item.content}
              callbackfromparent={this.props.callbackfromparent}
              selectedIndex={this.props.selectedIndex}
              hoveredIndex={this.props.hoveredIndex}
              index={this.props.index.concat(index)}
              key={index}
              align={item.align}
              fullWidth={item.fullWidth}
              contentWidth={contentWidth}
              onChange={({ value }) => {
                this.props.handleOnChange(
                  { value },
                  this.props.index.concat(index),
                  item.content,
                  "change"
                );
              }}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
              masterCallback={this.props.masterCallback}
            />
          );
          break;
        default:
          break;
      }
    });

    return (
      <Column hasBlock={cards.length !== 1} bgc={backgroundColor}>
        {compArray}
        {cards.length !== 1 ? null : (
          <InsertText>
            INSERT<br />CONTENT
          </InsertText>
        )}
      </Column>
    );
  }
}

export default ColumnItem;