import React from "react";
import ReactJson from "react-json-view";
import styled from "styled-components";

const JsonViewContainer = styled.div`
  padding: 30px;
`;

class JsonView extends React.Component {
  render() {
    return (
      <JsonViewContainer>
        <ReactJson collapsed={3} src={this.props.json} />
      </JsonViewContainer>
    );
  }
}

export default JsonView;
