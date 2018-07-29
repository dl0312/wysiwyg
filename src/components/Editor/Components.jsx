import React from "react";
import styled from "react-emotion";

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
  margin: 0 30px;
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
