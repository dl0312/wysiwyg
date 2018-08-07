import React, { Component } from "react";
import styled from "styled-components";

const EditorLeftContainer = styled.div`
  height: 800px;
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
`;

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // 기본상태의 에디터화면 id=container
    return (
      <EditorLeftContainer>
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
