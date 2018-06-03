import React, { Component, Fragment } from "react";
import styles from "./EditorLeft.scss";

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curserX: null,
      curserY: null,
      builder: []
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
    if (e.target.id === "container") {
      const body = e.target.children[0];
      while (body.children[i]) {
        if (body.children[i].className === "builder") {
          if (body.children[i].getBoundingClientRect().top - e.clientY > 0) {
            console.log(body.children[i]);
            body.children[i].style = { height: "100px" };
            return;
          }
        }
        i++;
      }
    }
    this.setState({ curserX: e.clientX, curserY: e.clientY });
  };

  handleOnDrop = e => {
    console.log("ondrop: " + e.object);
    e.preventDefault();
    var data = e.dataTransfer.getData("text/html");
    console.log("data: " + data);
    console.log("target: " + e.target);
    let i = 0;
    if (e.target.id === "container") {
      const body = e.target.children[0];
      while (body.children[i]) {
        if (body.children[i].className === "builder") {
          console.log(
            "builder top: " + body.children[i].getBoundingClientRect().top
          );
          if (
            body.children[i].getBoundingClientRect().top - this.state.curserY
          ) {
            console.log("this is target builder: " + body.children[i]);
            body.children[i].insertAdjacentHTML("beforeend", data);
            return;
          }
        }
        i++;
      }
    } else if (e.target.id === "body") {
      e.target.insertAdjacentHTML("beforeend", data);
    } else if (e.target.className === "column") {
      if (data.className === "content") {
        e.target.insertAdjacentHTML("beforeend", data);
      }
    }
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
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EditorLeft;
