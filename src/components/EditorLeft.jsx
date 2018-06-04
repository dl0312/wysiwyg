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
      builderTarget: null,
      columnTarget: null
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
    let currBuilder;
    let body = document.getElementById("body");

    if (this.props.OnDrag === "content") {
      // if data is content
      if (e.target.id === "container" || e.target.id === "body") {
        currBuilder = "builder";
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
        column = e.target;
        currBuilder = "smallbuilder";
        this.setState({
          columnTarget: e.target.children[0]
        });
        if (column.children[0]) {
          if (
            column.children[0].className === "smallbuilder" ||
            column.children[0].className === "smallbuilder target"
          ) {
            targetBuilder = 0;
          }
        }
      } else {
        // console.log(e.target);
        return;
      }

      if (this.state.prevBuilder === null) {
        // add curr builder
        if (currBuilder === "builder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            body.children[this.state.builderTarget].classList.add("target");
            this.setState({ prevBuilder: currBuilder });
          });
        } else if (currBuilder === "smallbuilder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            column.children[this.state.builderTarget].classList.add("target");
            this.setState({ prevBuilder: currBuilder });
          });
        }
      } else if (
        (this.state.builderTarget !== targetBuilder &&
          currBuilder === "builder") ||
        currBuilder === "smallbuilder"
      ) {
        // remove prev builder
        if (this.state.prevBuilder === "builder") {
          body.children[this.state.builderTarget].classList.remove("target");
        } else if (this.state.prevBuilder === "smallbuilder") {
          this.state.columnTarget.classList.remove("target");
        }

        this.setState({ prevBuilder: null });

        // add curr builder
        if (currBuilder === "builder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            body.children[this.state.builderTarget].classList.add("target");
            this.setState({ prevBuilder: currBuilder });
          });
        } else if (currBuilder === "smallbuilder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            column.children[this.state.builderTarget].classList.add("target");
            this.setState({ prevBuilder: currBuilder });
          });
        }
      }
    } else if (this.props.OnDrag === "columnList") {
      console.log(`this is column `);
      console.log(e.target);
      // if data is column

      if (e.target.id === "container" || e.target.id === "body") {
        currBuilder = "builder";
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
        if (currBuilder === "builder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            body.children[this.state.builderTarget].classList.add("target");
            this.setState({
              prevBuilder: currBuilder
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
        if (currBuilder === "builder") {
          this.setState({ builderTarget: targetBuilder }, () => {
            body.children[this.state.builderTarget].classList.add("target");
            this.setState({
              prevBuilder: currBuilder
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
    let body = document.getElementById("body");
    const div = document.createElement("div");
    div.classList.add("container");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.padding = "10px";
    div.style.border = "1px solid darkblue";
    div.innerHTML = data;

    if (e.target.id === "container" || e.target.id === "body") {
      body.children[this.state.builderTarget].classList.remove("target");

      if (this.state.prevBuilder === "builder") {
        if (this.props.OnDrag === "content") {
          body.children[this.state.builderTarget].replaceWith(div);
          body.children[this.state.builderTarget].insertAdjacentHTML(
            "afterend",
            `<div class="builder"></div>`
          );
          body.children[this.state.builderTarget].insertAdjacentHTML(
            "beforebegin",
            `<div class="builder"></div>`
          );
        } else if (this.props.OnDrag === "columnList") {
          body.children[this.state.builderTarget].insertAdjacentHTML(
            "afterend",
            data
          );
        }
      } else if (this.state.prevBuilder === "smallbuilder") {
        body.children[this.state.builderTarget].replaceWith(div);
      }
      // set state default
      this.setState({
        builderTarget: null,
        prevBuilder: null,
        columnTarget: null
      });
      return;
    } else if (e.target.className === "column") {
      if (this.props.OnDrag === "content") {
        e.target.replaceWith(div);
        // set state default

        this.setState({
          builderTarget: null,
          prevBuilder: null,
          columnTarget: null
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
