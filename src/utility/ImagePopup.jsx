import React from "react";
import styled from "styled-components";
import HoverView from "./HoverView";

const PopupContainer = styled.div`
  display: ${props => (props.hover ? null : "none")};
  position: absolute;
  z-index: 999;
  left: ${props => props.left + 50}px;
  top: ${props => props.top}px;

  /* border-radius: 10px; */
`;

const StaticContainer = styled.div`
  /* border: 2px solid rgba(0, 0, 0, 0.5); */
`;

const PopupImage = styled.img``;

class ImagePopup extends React.Component {
  render() {
    const {
      json,
      pos: { x, y },
      onImage
    } = this.props;
    return this.props.follow === undefined ? (
      <PopupContainer hover={onImage ? true : false} left={x} top={y}>
        {onImage ? <HoverView json={JSON.parse(this.props.json)} /> : null}
      </PopupContainer>
    ) : (
      <StaticContainer>
        {onImage ? <HoverView json={JSON.parse(this.props.json)} /> : null}
      </StaticContainer>
    );
  }
}

export default ImagePopup;
