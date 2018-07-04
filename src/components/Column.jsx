import React, { Component } from "react";
import ColumnItem from "./ColumnItem";

export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const columnListStyle = {
      width: "100%",
      display: "grid",
      gridGap: "10px",
      gridTemplateColumns: this.props.columnArray.join("fr ") + "fr"
    };
    return (
      <div className="columnList" style={columnListStyle}>
        {this.props.columnListArray.map((columnList, index) => (
          <ColumnItem
            key={index}
            cards={columnList}
            index={this.props.index.slice(0, 1).concat(index)}
            callbackfromparent={this.props.callbackfromparent}
            handleDrop={this.props.handleDrop}
            moveCard={this.props.moveCard}
            handleOnChange={this.props.handleOnChange}
            selectedIndex={this.props.selectedIndex}
            hoveredIndex={this.props.hoveredIndex}
            contentWidth={this.props.contentWidth}
          />
        ))}
      </div>
    );
  }
}
