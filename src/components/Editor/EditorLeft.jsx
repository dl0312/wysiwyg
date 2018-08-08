import React, { Component } from "react";
import styled from "styled-components";

const EditorLeftContainer = styled.div`
  overflow-y: auto;
  position: ${props => (props.view === "USER" ? "block" : "absolute")};
  bottom: 0px;
  right: 0px;
  left: 0px;
  top: ${props => {
    switch (props.view) {
      case "EDIT":
        return "51px";
      case "USER":
        return "0px";
      default:
        break;
    }
  }};
`;

const RealEditorContainer = styled.div`
  background-color: ${props =>
    `rgba(${props.backgroundColor.r}, ${props.backgroundColor.g}, ${
      props.backgroundColor.b
    }, ${props.backgroundColor.a})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => (props.view === "USER" ? null : "10px")};
`;

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // 기본상태의 에디터화면 id=container
    return (
      <EditorLeftContainer view={this.props.view}>
        <RealEditorContainer
          backgroundColor={this.props.color}
          fontFamily={this.props.font}
          id="container"
          view={this.props.view}
        >
          {this.props.children}
        </RealEditorContainer>
      </EditorLeftContainer>
    );
  }
}

export default EditorLeft;
