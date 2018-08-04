import React, { Component } from "react";
import PropTypes from "prop-types";
import Builder from "./BlockBuilder";
import Container from "./Container";
import styled from "styled-components";

const Column = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  outline: ${props =>
    props.hasBlock ? "0px solid black" : "0.5px dashed #2f3542"};
  background-color: ${props => props.bgc};
`;

const InsertText = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -10px;
  font-size: 15px;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
  color: #2f3542;
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
    const { contentWidth, cards } = this.props;
    let backgroundColor = cards.length === 1 ? "transparent" : "transparent";

    return (
      <Column hasBlock={cards.length !== 1} bgc={backgroundColor}>
        {cards.map((item, index) => {
          if (item.type === "builder") {
            return (
              <Builder
                id={item.id}
                index={this.props.index.concat(index)}
                moveCard={this.props.moveCard}
                handleDrop={this.props.handleDrop}
                OnDrag={this.props.OnDrag}
                masterCallback={this.props.masterCallback}
              />
            );
          } else if (item.type === "content") {
            return (
              <Container
                item={item}
                callbackfromparent={this.props.callbackfromparent}
                selectedIndex={this.props.selectedIndex}
                hoveredIndex={this.props.hoveredIndex}
                index={this.props.index.concat(index)}
                key={index}
                contentWidth={contentWidth}
                handleOnChange={this.props.handleOnChange.bind(this)}
                renderNode={this.props.renderNode}
                renderMark={this.props.renderMark}
                masterCallback={this.props.masterCallback}
                onDropOrPaste={this.props.onDropOrPaste}
              />
            );
          } else {
            return null;
          }
        })}
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
