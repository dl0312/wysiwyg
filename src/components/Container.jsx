import React, { Component } from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import ColumnItem from "./ColumnItem";

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showInner = () => {
    if (this.props.OnDrag === "content") {
      switch (this.props.content) {
        case "BUTTON":
          return <Button selected={this.props.selected} />;
        case "DIVIDER":
          return <Divider selected={this.props.selected} />;
        case "HTML":
          return <Html selected={this.props.selected} />;
        case "IMAGE":
          return <Image selected={this.props.selected} />;
        case "TEXT":
          return <Text selected={this.props.selected} />;
        default:
          break;
      }
    } else if (this.props.OnDrag === "columnList") {
      return (
        <Column
          selected={this.props.selected}
          columnArray={this.props.content}
          columnListArray={this.props.columnListArray}
        />
      );
    }
  };

  render() {
    return (
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          position: "relative"
        }}
      >
        {this.showInner()}
      </div>
    );
  }
}

class Button extends Component {
  constructor(props) {
    super(props);
    const initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: "block",
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [
                  {
                    text: "CLICK ME!"
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return (
      <div
        className="content"
        style={{
          color: "white",
          backgroundColor: "#3AAEE0",
          textAlign: "center",
          lineHeight: "120%",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent",
          borderRadius: "4px",
          paddingTop: "10px",
          paddingRight: "20px",
          paddingLeft: "20px",
          paddingBottom: "10px"
        }}
      >
        <Editor
          value={this.state.value}
          readOnly={false}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

class Divider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="content"
        style={{
          width: "100%",
          borderBottom: "1px solid #BBBBBB"
        }}
      />
    );
  }
}

class Html extends Component {
  constructor(props) {
    super(props);
    const initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: "block",
            marks: {
              b: "bold"
            },
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [
                  {
                    text: "Hello, world!"
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return (
      <div
        className="content"
        style={{
          color: "#373A3C",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <Editor
          value={this.state.value}
          readOnly={false}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        className="content"
        style={{
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <img
          src="https://i.pinimg.com/originals/93/43/86/934386f5a1752c1769537e7cc053d422.gif"
          alt="logo"
        />
      </div>
    );
  }
}

class Text extends Component {
  constructor(props) {
    super(props);
    this.props = {
      selected: false
    };
    const initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: "block",
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [
                  {
                    text: "A line of text in a paragraph."
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return (
      <div
        className="content"
        style={{
          color: "black",
          textAlign: "left",
          lineHeight: "140%",
          paddingTop: "10px",
          paddingRight: "10px",
          paddingLeft: "10px",
          paddingBottom: "10px"
        }}
      >
        <Editor value={this.state.value} onChange={this.onChange} />
      </div>
    );
  }
}

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const columnListStyle = {
      width: "100%",
      display: "grid",
      gridTemplateColumns: this.props.columnArray.join("fr ") + "fr"
    };
    // console.log(this.props.columnListArray);
    return (
      <div className="columnList" style={columnListStyle}>
        {this.props.columnListArray.map((columnList, index) => (
          <ColumnItem key={index} columnList={columnList} />
        ))}
      </div>
    );
  }
}
