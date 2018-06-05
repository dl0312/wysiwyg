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
    let targetCnt = -1;
    let targetBuilder;
    let minGap = 1000;
    let column;
    let currBuilder;
    let body = document.getElementById("body");

    if (this.props.OnDrag === "content") {
      // if data is content
      if (e.target.id === "container" || e.target.id === "body") {
        // currBuilder = "builder";
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
              targetCnt = i;
            }
          }
          i++;
        }
        if (targetCnt == null) {
          return;
        }
        targetBuilder = body.children[targetCnt];
      } else if (e.target.className === "builder") {
        targetBuilder = e.target;
      } else if (e.target.className === "column") {
        column = e.target;
        // currBuilder = "smallbuilder";
        while (column.children[i]) {
          if (
            column.children[i].className === "smallbuilder" ||
            column.children[i].className === "smallbuilder target"
          ) {
            const gap = Math.abs(
              column.children[i].getBoundingClientRect().top - e.clientY
            );
            if (gap < minGap) {
              minGap = gap;
              targetCnt = i;
            }
          }
          i++;
        }
        if (targetCnt == null) {
          return;
        }
        targetBuilder = column.children[targetCnt];
      } else if (e.target.className === "smallbuilder") {
        targetBuilder = e.target;
      } else {
        // console.log(e.target);
        return;
      }

      if (this.state.prevBuilder === null) {
        // add curr builder
        console.log(targetBuilder);
        if (targetBuilder.className === "builder") {
          targetBuilder.classList.add("target");
          console.log(targetBuilder);
          this.setState({ prevBuilder: targetBuilder });
        } else if (targetBuilder.className === "smallbuilder") {
          targetBuilder.classList.add("target");
          console.log(targetBuilder);
          this.setState({ prevBuilder: targetBuilder });
        }
      } else if (this.state.prevBuilder !== targetBuilder) {
        // remove prev builder
        this.state.prevBuilder.classList.remove("target");
        this.setState({ prevBuilder: null });

        // add curr builder
        if (targetBuilder.className === "builder") {
          targetBuilder.classList.add("target");
          this.setState({ prevBuilder: targetBuilder });
        } else if (targetBuilder.className === "smallbuilder") {
          targetBuilder.classList.add("target");
          this.setState({ prevBuilder: targetBuilder });
        }
      }
    } else if (this.props.OnDrag === "columnList") {
      console.log(`this is column `);
      console.log(e.target);
      // if data is column

      if (e.target.id === "container" || e.target.id === "body") {
        // currBuilder = "builder";
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
              targetCnt = i;
            }
          }
          i++;
        }
        targetBuilder = body.children[targetCnt];
      } else if (e.target.className === "builder") {
        targetBuilder = e.target;
      } else {
        return;
      }

      if (this.state.prevBuilder === null) {
        // add curr builder
        targetBuilder.classList.add("target");
        this.setState({ prevBuilder: targetBuilder });
      } else if (this.state.prevBuilder !== targetBuilder) {
        // remove prev builder
        this.state.prevBuilder.classList.remove("target");
        this.setState({ prevBuilder: null });

        // add curr builder
        targetBuilder.classList.add("target");
        this.setState({ prevBuilder: targetBuilder });
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
    // div.style.border = "1px solid red";
    div.innerHTML = data;
    console.log(this.state.prevBuilder);
    if (this.state.prevBuilder.className === "builder target") {
      this.state.prevBuilder.classList.remove("target");
      if (this.props.OnDrag === "content") {
        this.state.prevBuilder.insertAdjacentHTML(
          "afterend",
          `<div class="builder"></div>`
        );
        this.state.prevBuilder.insertAdjacentHTML(
          "beforebegin",
          `<div class="builder"></div>`
        );
        this.state.prevBuilder.replaceWith(div);
      } else if (this.props.OnDrag === "columnList") {
        this.state.prevBuilder.insertAdjacentHTML("afterend", data);
      }
      // set state default
      this.setState({
        builderTarget: null,
        prevBuilder: null,
        columnTarget: null
      });
      return;
    } else if (this.state.prevBuilder.className === "smallbuilder target") {
      this.state.prevBuilder.classList.remove("target");

      if (this.props.OnDrag === "content") {
        this.state.prevBuilder.insertAdjacentHTML(
          "afterend",
          `<div class="smallbuilder"></div>`
        );
        this.state.prevBuilder.insertAdjacentHTML(
          "beforebegin",
          `<div class="smallbuilder"></div>`
        );
        this.state.prevBuilder.replaceWith(div);

        // set state default
        this.setState({
          builderTarget: null,
          prevBuilder: null,
          columnTarget: null
        });
        return;
      }
    }

    // if (e.target.id === "container" || e.target.id === "body") {
    //   this.state.prevBuilder.classList.remove("target");

    //   if (this.props.OnDrag === "content") {
    //     this.state.prevBuilder.insertAdjacentHTML(
    //       "afterend",
    //       `<div class="builder"></div>`
    //     );
    //     this.state.prevBuilder.insertAdjacentHTML(
    //       "beforebegin",
    //       `<div class="builder"></div>`
    //     );
    //     this.state.prevBuilder.replaceWith(div);
    //   } else if (this.props.OnDrag === "columnList") {
    //     this.state.prevBuilder.insertAdjacentHTML("afterend", data);
    //   }

    //   // set state default
    //   this.setState({
    //     builderTarget: null,
    //     prevBuilder: null,
    //     columnTarget: null
    //   });
    //   return;
    // } else if (e.target.className === "column") {
    //   if (this.props.OnDrag === "content") {
    //     this.state.prevBuilder.insertAdjacentHTML(
    //       "afterend",
    //       `<div class="smallbuilder"></div>`
    //     );
    //     this.state.prevBuilder.insertAdjacentHTML(
    //       "beforebegin",
    //       `<div class="smallbuilder"></div>`
    //     );
    //     this.state.prevBuilder.replaceWith(div);

    //     // set state default
    //     this.setState({
    //       builderTarget: null,
    //       prevBuilder: null,
    //       columnTarget: null
    //     });
    //   }
    //   return;
    // } else if (
    //   e.target.className === "smallbuilder" ||
    //   e.target.className === "smallbuilder target"
    // ) {
    //   if (this.props.OnDrag === "content") {
    //     this.state.prevBuilder.insertAdjacentHTML(
    //       "afterend",
    //       `<div class="smallbuilder"></div>`
    //     );
    //     this.state.prevBuilder.insertAdjacentHTML(
    //       "beforebegin",
    //       `<div class="smallbuilder"></div>`
    //     );
    //     this.state.prevBuilder.replaceWith(div);

    //     // set state default
    //     this.setState({
    //       builderTarget: null,
    //       prevBuilder: null,
    //       columnTarget: null
    //     });
    //   }
    //   return;
    // } else {
    //   // set state default
    //   this.setState({
    //     builderTarget: null,
    //     prevBuilder: null,
    //     currBuilder: null
    //   });
    //   return;
    // }
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
            {/* <img src={require("../images/claptitle2.png")} />
            <div className="builder" /> */}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EditorLeft;
