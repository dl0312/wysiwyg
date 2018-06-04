import React, { Component, Fragment } from "react";
import styles from "./EditorLeft.scss";
import "./EditorLeft.css";

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curserX: null,
      curserY: null,
      prevBuilder: null,
      currBuilder: null,
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
    let column;
    var data = e.dataTransfer.getData("text/html");
    const body = document.getElementById("body");

    if (this.props.OnDrag === "content") {
      console.log(`this is content`);

      // if data is content
      if (e.target.className === "column") {
        console.log("!column");
        console.log(e.target);
        console.log(
          `${this.state.prevBuilder},${this.state.currBuilder},${
            this.state.builderTarget
          }`
        );
        column = e.target;
      } else {
        console.log(e.target);
        return;
        if (this.state.prevBuilder === "builder") {
          body.children[this.state.builderTarget].classList.remove("target");
        } else if (this.state.prevBuilder === "smallbuilder") {
          column.children[this.state.builderTarget].classList.remove("target");
        }
        this.setState({ prevBuilder: null });
      }

      if (e.target.id === "container" || e.target.id === "body") {
        this.setState({ currBuilder: "builder" });
        while (body.children[i]) {
          if (
            body.children[i].className === "builder" ||
            body.children[i].className === "builder target"
          ) {
            const gap = Math.abs(
              body.children[i].getBoundingClientRect().top - e.clientY
            );
            if (gap < minGap) {
              minGap = gap;
              targetBuilder = i;
            }
          }
          i++;
        }
      } else if (e.target.className === "column") {
        if (column.children[0]) {
          if (
            column.children[0].className === "smallbuilder" ||
            column.children[0].className === "smallbuilder target"
          ) {
            this.setState({ currBuilder: "smallbuilder" });
            targetBuilder = 0;
          }
        }
      }

      if (this.state.prevBuilder === null) {
        // add curr builder
        if (this.state.currBuilder === "builder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            body.children[this.state.builderTarget].classList.add("target");
            this.setState({ prevBuilder: this.state.currBuilder });
          });
        } else if (this.state.currBuilder === "smallbuilder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            column.children[this.state.builderTarget].classList.add("target");
            this.setState({ prevBuilder: this.state.currBuilder });
          });
        }
      } else if (this.state.builderTarget !== targetBuilder) {
        // remove prev builder
        if (this.state.prevBuilder === "builder") {
          body.children[this.state.builderTarget].classList.remove("target");
        } else if (this.state.prevBuilder === "smallbuilder") {
          column.children[this.state.builderTarget].classList.remove("target");
        }

        this.setState({ prevBuilder: null });

        // add curr builder
        if (this.state.currBuilder === "builder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            body.children[this.state.builderTarget].classList.add("target");
            this.setState({ prevBuilder: this.state.currBuilder });
          });
        } else if (this.state.currBuilder === "smallbuilder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            column.children[this.state.builderTarget].classList.add("target");
            this.setState({ prevBuilder: this.state.currBuilder });
          });
        }
      }
    } else if (this.props.OnDrag === "columnList") {
      // if data is column

      if (e.target.id === "container" || e.target.id === "body") {
        this.setState({ currBuilder: "builder" });
        while (body.children[i]) {
          if (
            body.children[i].className === "builder" ||
            body.children[i].className === "builder target"
          ) {
            const gap = Math.abs(
              body.children[i].getBoundingClientRect().top - e.clientY
            );
            if (gap < minGap) {
              minGap = gap;
              targetBuilder = i;
            }
          }
          i++;
        }
      } else {
        return;
      }

      if (this.state.builderTarget === null) {
        // add curr builder
        if (this.state.currBuilder === "builder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            body.children[this.state.builderTarget].classList.add("target");
            this.setState({
              prevBuilder: this.state.currBuilder
            });
          });
        }
      } else if (this.state.builderTarget !== targetBuilder) {
        // remove prev builder
        if (this.state.prevBuilder === "builder") {
          body.children[this.state.builderTarget].classList.remove("target");
        }
        this.setState({ prevBuilder: null });

        // add curr builder
        if (this.state.currBuilder === "builder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            body.children[this.state.builderTarget].classList.add("target");
            this.setState({
              prevBuilder: this.state.currBuilder
            });
          });
        }
      }
    }
    this.setState({ curserX: e.clientX, curserY: e.clientY });
  };

  handleOnDrop = e => {
    e.preventDefault();
    var data = e.dataTransfer.getData("text/html");
    const body = document.getElementById("body");

    if (e.target.id === "container" || e.target.id === "body") {
      body.children[this.state.builderTarget].classList.remove("target");
      body.children[this.state.builderTarget].insertAdjacentHTML(
        "afterend",
        data
      );
      // set state default
      this.setState({
        builderTarget: null,
        prevBuilder: null,
        currBuilder: null
      });
      return;
    } else if (e.target.className === "column") {
      if (this.props.OnDrag === "content") {
        e.target.children[this.state.builderTarget].replaceWith(data);
        // set state default

        this.setState({
          builderTarget: null,
          prevBuilder: null,
          currBuilder: null
        });
      }
      return;
    } else {
      // set state default
      this.setState({
        builderTarget: null,
        prevBuilder: null,
        currBuilder: null
      });
      return;
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
            <img src={require("../images/claptitle2.png")} />
            <div className="builder" />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EditorLeft;
