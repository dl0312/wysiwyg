import React from "react";
import styled from "styled-components";
import ItemTypes from "./ItemTypes";
import { DropTarget } from "react-dnd";
const InsertText = styled.div`
  height: 500px;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  font-family: "Open Sans", sans-serif;
  color: #2f3542;
  outline: 0.5px dashed #2f3542;
`;

const cardTarget = {
  drop(props, monitor) {
    const type = monitor.getItemType();
    props.masterCallback("OnDrag", null);
    console.log(type);
    console.log(monitor.getItem());
    console.log(props.index);
    if (type === ItemTypes.COLUMN) {
      props.moveCard(monitor.getItem().index, props.index);
    } else if (type === ItemTypes.ROW) {
      props.handleDrop(monitor.getItem(), props.index);
    }
  }
};

class EmptyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { connectDropTarget } = this.props;
    return (
      connectDropTarget &&
      connectDropTarget(
        <div style={{ width: "99%" }}>
          <InsertText>
            INSERT<br />COLUMN
          </InsertText>
        </div>
      )
    );
  }
}

export default DropTarget(
  [ItemTypes.ROW, ItemTypes.COLUMN],
  cardTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    didDrop: monitor.didDrop()
  })
)(EmptyCard);
