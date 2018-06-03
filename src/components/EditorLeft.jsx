import React, { Component, Fragment } from "react";
import styles from "./EditorLeft.scss";
import "./EditorLeft.css";

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curserX: null,
      curserY: null,
      builder: [],
      builderTarget: null
    };
  }

  onEditorStateChange = editorState => {
    console.log(editorState);
    this.setState({
      editorState
    });
  };

  // uploadImageCallBack = file => {
  //   return new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open("POST", "https://api.imgur.com/3/image");
  //     xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
  //     const data = new FormData();
  //     data.append("image", file);
  //     xhr.send(data);
  //     xhr.addEventListener("load", () => {
  //       const response = JSON.parse(xhr.responseText);
  //       resolve(response);
  //     });
  //     xhr.addEventListener("error", () => {
  //       const error = JSON.parse(xhr.responseText);
  //       reject(error);
  //     });
  //   });
  // };

  allowDrop = e => {
    e.preventDefault();
    let i = 0;
    let targetBuilder = -1;
    let minGap = 1000;
    let body;
    let column;
    var data = e.dataTransfer.getData("text/html");

    if (e.target.id === "container") {
      body = e.target.children[0];
    } else if (e.target.id === "body") {
      body = e.target;
    } else if (e.target.className === "column") {
      column = e.target;
    } else {
      console.log(e.target);
      return;
    }

    if (e.target.id === "container" || e.target.id === "body") {
      while (body.children[i]) {
        if (
          body.children[i].className === "builder" ||
          body.children[i].className === "builder target"
        ) {
          const gap = Math.abs(
            body.children[i].getBoundingClientRect().top - e.clientY
          );
          if (gap < minGap) {
            console.log(i + ", " + gap + ", " + minGap);
            minGap = gap;
            targetBuilder = i;
          }
        }
        i++;
      }
    } else if (e.target.className === "column") {
      if (data.className === "content") {
        while (column.children[i]) {
          if (
            column.children[i].className === "smallbuilder" ||
            column.children[i].className === "smallbuilder target"
          ) {
            const gap = Math.abs(
              column.children[i].getBoundingClientRect().left - e.clientX
            );
            if (gap < minGap) {
              console.log(i + ", " + gap + ", " + minGap);
              minGap = gap;
              targetBuilder = i;
            }
          }
          i++;
        }
      }
    }
    console.log("targetbuilder: " + targetBuilder + "min Gap: " + minGap);
    if (this.state.builderTarget === null) {
      this.setState({ builderTarget: targetBuilder }, () =>
        body.children[this.state.builderTarget].classList.add("target")
      );
    } else if (this.state.builderTarget !== targetBuilder) {
      body.children[this.state.builderTarget].classList.remove("target");
      this.setState({ builderTarget: targetBuilder }, () =>
        body.children[targetBuilder].classList.add("target")
      );
    }
    this.setState({ curserX: e.clientX, curserY: e.clientY });
  };

  handleOnDrop = e => {
    console.log("ondrop: " + e.object);
    e.preventDefault();
    var data = e.dataTransfer.getData("text/html");
    console.log("data: " + data);
    let body;
    if (e.target.id === "container") {
      body = e.target.children[0];
    } else if (e.target.id === "body") {
      body = e.target;
    } else if (e.target.className === "column") {
      if (data.className === "content") {
        e.target.insertAdjacentHTML("beforeend", data);
        this.setState({ builderTarget: null });
      }
      return;
    } else {
      return;
    }
    body.children[this.state.builderTarget].classList.remove("target");
    body.children[this.state.builderTarget].insertAdjacentHTML(
      "afterend",
      data
    );
    this.setState({ builderTarget: null });
    return;
  };

  render() {
    return (
      <Fragment>
        <div
          style={{
            background: `rgba(${this.props.color.r}, ${this.props.color.g}, ${
              this.props.color.b
            }, ${this.props.color.a})`
          }}
          className={styles.editor}
          id="container"
          onDragOver={this.allowDrop}
          onDrop={this.handleOnDrop}
        >
          <div
            style={{
              width: `${this.props.contentWidth}px`,
              fontFamily: `${this.props.font}`
            }}
            id="body"
            className={styles.practice}
          >
            <div className="builder" />
            <img src={require("../images/claptitle2.png")} />
            <div className="builder" />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EditorLeft;
