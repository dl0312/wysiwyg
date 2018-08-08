import React, { Component } from "react";
import styled from "styled-components";

const EditorLeftContainer = styled.div`
  height: ${props =>
    props.view === "EDIT"
      ? "585px"
      : props.view === "USER"
        ? "637px"
        : "585px"};
  overflow-y: auto;
`;

const RealEditorContainer = styled.div`
  background-color: ${props =>
    `rgba(${props.backgroundColor.r}, ${props.backgroundColor.g}, ${
      props.backgroundColor.b
    }, ${props.backgroundColor.a})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
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
        >
          {this.props.children}
        </RealEditorContainer>
      </EditorLeftContainer>
    );
  }
}

export default EditorLeft;
