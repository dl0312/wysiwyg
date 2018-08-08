import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "./Container";
import styled from "styled-components";
import EmptyContainer from "./EmptyContainer";

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
    const { contentWidth, cards, connectDropTarget } = this.props;
    let backgroundColor = cards.length === 1 ? "transparent" : "transparent";

    return (
      <Column hasBlock={cards.length !== 0} bgc={backgroundColor}>
        {cards.map((item, index) => {
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
              moveCard={this.props.moveCard}
              handleDrop={this.props.handleDrop}
              OnDrag={this.props.OnDrag}
              onDropOrPaste={this.props.onDropOrPaste}
            />
          );
        })}
        {cards.length !== 0 ? null : (
          <EmptyContainer
            index={this.props.index}
            masterCallback={this.props.masterCallback}
            moveCard={this.props.moveCard}
            handleDrop={this.props.handleDrop}
            OnDrag={this.props.OnDrag}
          />
        )}
      </Column>
    );
  }
}

export default ColumnItem;
