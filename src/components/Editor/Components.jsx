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
  margin: 0 20px;
  transition: margin 0.5s ease;
  ${media.desktop`margin: 0 10px;`};
  ${media.tablet`margin: 0 15px;`};
  ${media.phone`display: none;`};
`;

export const Icon = styled(({ className, ...rest }) => {
  return <span className={`material-icons ${className}`} {...rest} />;
})`
  font-size: 18px;
  vertical-align: text-bottom;
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
  padding: 15px 15px;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
  display: flex;
  transition: opacity 0.5s ease;
  opacity: ${props => (props.active ? "0" : "1")};
`;
