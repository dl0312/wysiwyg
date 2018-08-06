import React from "react";
import styled from "styled-components";
import UserView from "../components/Editor/UserView";

const PopupContainer = styled.div`
  display: ${props => (props.hover ? null : "none")};
  position: absolute;
  z-index: 999;
  left: ${props => props.left + 50}px;
  top: ${props => props.top}px;
  border: 2px solid rgba(0, 0, 0, 0.5);
`;

const StaticContainer = styled.div`
  border: 2px solid rgba(0, 0, 0, 0.5);
`;

const PopupImage = styled.img``;

class ImagePopup extends React.Component {
  render() {
    console.log(this.props.json);
    console.log(JSON.parse(this.props.json));
    return this.props.follow === undefined ? (
      <PopupContainer
        hover={this.props.json ? true : false}
        left={this.props.pos.x}
        top={this.props.pos.y}
      >
        {this.props.json ? (
          <UserView json={JSON.parse(this.props.json)} />
        ) : null}
      </PopupContainer>
    ) : (
      <StaticContainer>
        {this.props.json ? (
          <UserView json={JSON.parse(this.props.json)} />
        ) : null}
      </StaticContainer>
    );
  }
}

export default ImagePopup;
