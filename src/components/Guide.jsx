import React, { Component } from "react";
import Box from "./Box";
import Drag from "./Drag";
import styles from "./Guide.scss";
import { render } from "react-dom";
import Container from "./Container";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

class Guide extends Component {
  render() {
    return (
      <div>
        <Box />
        <Drag />
      </div>
    );
  }
}

export default Guide;
