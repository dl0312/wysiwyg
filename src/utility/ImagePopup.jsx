import React from "react";
import styled from "styled-components";

const PopupContainer = styled.div`
  display: ${props => (props.hover ? null : "none")};
  position: absolute;
  z-index: 999;
  left: ${props => props.left + 50}px;
  top: ${props => props.top}px;
  height: 350px;
`;

const PopupImage = styled.img``;

class ImagePopup extends React.Component {
  render() {
    return (
      <PopupContainer
        hover={this.props.url ? true : false}
        left={this.props.pos.x}
        top={this.props.pos.y}
      >
        <PopupImage src={this.props.url} />
      </PopupContainer>
    );
  }
}

export default ImagePopup;
