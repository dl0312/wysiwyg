import React from "react";
import styled from "react-emotion";
import { media } from "../../config/_mixin";

export const Button = styled("span")`
  cursor: pointer;
  color: ${props =>
    props.reversed
      ? props.active
        ? "white"
        : "#aaa"
      : props.active
        ? "black"
        : "#ccc"};
  padding: 13px 10px;
  transition: padding 0.5s ease;
  ${media.desktop`padding: 10px 5px; font-size: 10px;`};
  ${media.tablet`padding: 13px 10px;`};
  ${media.phone`display: none;`};
`;

export const Menu = styled("div")`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

export const Toolbar = styled(Menu)`
  position: relative;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
  display: flex;
  transition: opacity 0.5s ease;
  opacity: ${props => (props.active ? "0" : "1")};
`;
