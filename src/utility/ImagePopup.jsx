import React from "react";
import styled from "styled-components";

const PopupContainer = styled.div`
  display: ${props => (props.hover ? null : "none")};
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.height};
  height: 350px;
`;

const PopupImage = styled.img``;

class ImagePopup extends React.Component {
  render() {
    return (
      <PopupContainer
        hover={this.props.url ? true : false}
        left={this.props.left}
        top={this.props.height}
      >
        <PopupImage src={this.props.url} />
      </PopupContainer>
    );
  }
}

export default ImagePopup;
