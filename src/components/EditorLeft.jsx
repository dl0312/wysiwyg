import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { Editor } from "slate-react";
import { Value } from "slate";
import styles from "./EditorLeft.scss";
import "./EditorLeft.css";

class EditorLeft extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      curserX: null,
      curserY: null,
      prevBuilder: null,
      builderTarget: null,
      columnTarget: null,
      blocks: [<div className="builder" />],
      hoverTarget: null,
      selectedTarget: null
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
    const data = e.dataTransfer.getData("text");
    const div = document.createElement("div");
    const target = this.state.prevBuilder;
    console.log(this.myRef.current);
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
        div.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <Container OnDrag={this.props.OnDrag} content={data} />
        );
        this.state.prevBuilder.replaceWith(div);
      } else if (this.props.OnDrag === "columnList") {
        this.state.prevBuilder.insertAdjacentHTML(
          "afterend",
          `<div class="builder"></div>`
        );
        this.state.prevBuilder.insertAdjacentHTML(
          "beforebegin",
          `<div class="builder"></div>`
        );
        console.log(data);
        div.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <Container OnDrag={this.props.OnDrag} columnArray={data} />
        );
        this.state.prevBuilder.replaceWith(div);
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
        this.state.prevBuilder.replaceWith(
          <Container OnDrag={this.props.OnDrag} content={data} />
        );

        // set state default
        this.setState({
          builderTarget: null,
          prevBuilder: null,
          columnTarget: null
        });
        return;
      }
    }
  };

  handleOnMouseOver = position => {
    if (this.state.selectedTarget !== position) {
      this.setState({ hoverTarget: position });
    }
  };

  handleOnMouseLeave = position => {
    if (this.state.hoverTarget) {
      this.setState({ hoverTarget: null });
    }
  };

  handleOnMouseDown = position => {
    this.setState({ hoverTarget: null, selectedTarget: position });
  };

  render() {
    // 기본상태의 에디터화면 id=container, id=body, builder 1개
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
            {/* {this.state.blocks.map(block => {
              return block;
            })} */}
            <Builder />
            <Container
              OnDrag="content"
              content="BUTTON"
              position="1"
              hover={this.state.hoverTarget === "1" ? true : false}
              selected={this.state.selectedTarget === "1" ? true : false}
              MouseOver={this.handleOnMouseOver.bind(this)}
              MouseLeave={this.handleOnMouseLeave.bind(this)}
              MouseDown={this.handleOnMouseDown.bind(this)}
            />
            <Builder />
            <Container
              OnDrag="content"
              content="DIVIDER"
              position="2"
              hover={this.state.hoverTarget === "2" ? true : false}
              selected={this.state.selectedTarget === "2" ? true : false}
              MouseOver={this.handleOnMouseOver.bind(this)}
              MouseLeave={this.handleOnMouseLeave.bind(this)}
              MouseDown={this.handleOnMouseDown.bind(this)}
            />
            <Builder />
            <Container
              OnDrag="content"
              content="HTML"
              position="3"
              hover={this.state.hoverTarget === "3" ? true : false}
              selected={this.state.selectedTarget === "3" ? true : false}
              MouseOver={this.handleOnMouseOver.bind(this)}
              MouseLeave={this.handleOnMouseLeave.bind(this)}
              MouseDown={this.handleOnMouseDown.bind(this)}
            />
            <Builder />
            <Container
              OnDrag="content"
              content="IMAGE"
              position="4"
              hover={this.state.hoverTarget === "4" ? true : false}
              selected={this.state.selectedTarget === "4" ? true : false}
              MouseOver={this.handleOnMouseOver.bind(this)}
              MouseLeave={this.handleOnMouseLeave.bind(this)}
              MouseDown={this.handleOnMouseDown.bind(this)}
            />
            <Builder />
            <Container
              OnDrag="content"
              content="TEXT"
              position="5"
              hover={this.state.hoverTarget === "5" ? true : false}
              selected={this.state.selectedTarget === "5" ? true : false}
              MouseOver={this.handleOnMouseOver.bind(this)}
              MouseLeave={this.handleOnMouseLeave.bind(this)}
              MouseDown={this.handleOnMouseDown.bind(this)}
            />
            <Builder />
            {/* <img src={require("../images/claptitle2.png")} />
            <div className="builder" /> */}
          </div>
        </div>
      </Fragment>
    );
  }
}

class Builder extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      active: false
    };
  }

  render() {
    return (
      <Fragment>
        <div className="builder" />
      </Fragment>
    );
  }
}

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exist: true
    };
  }

  showInner = () => {
    if (this.props.OnDrag === "content") {
      switch (this.props.content) {
        case "BUTTON":
          return <Button selected={this.props.selected} />;
        case "DIVIDER":
          return <Divider selected={this.props.selected} />;
        case "HTML":
          return <Html selected={this.props.selected} />;
        case "IMAGE":
          return <Image selected={this.props.selected} />;
        case "TEXT":
          return <Text selected={this.props.selected} />;
        default:
          break;
      }
    } else if (this.props.OnDrag === "columnList") {
      return (
        <Column
          selected={this.props.selected}
          columnArray={this.props.columnArray}
        />
      );
    }
  };

  handleOnMouseOver = () => {
    this.props.MouseOver(this.props.position);
    if (!this.props.selected) {
      this.setState({ hover: true });
    }
  };

  handleOnMouseDown = () => {
    this.props.MouseDown(this.props.position);
  };

  handleOnMouseLeave = () => {
    this.props.MouseLeave(this.props.position);
  };

  handleOutline = () => {
    if (this.props.selected) {
      return "2px solid #4CB9EA";
    } else if (this.props.hover) {
      return "2px solid #7aabc0";
    } else {
      return null;
    }
  };

  handleOnClickDelBtn = () => {
    this.setState({ exist: false });
  };

  handleOnClickDupBtn = () => {};

  render() {
    return this.state.exist ? (
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          position: "relative",
          outline: this.handleOutline()
        }}
        onMouseOver={this.handleOnMouseOver}
        onMouseDown={this.handleOnMouseDown}
        onMouseLeave={this.handleOnMouseLeave}
      >
        <div className="layout">
          {this.props.selected ? <div className="editor" /> : null}
          {this.props.hover ? <div className="object">content</div> : null}
          {this.props.hover || this.props.selected ? (
            <div
              style={{
                backgroundColor: this.props.selected ? "#4cb9ea" : null
              }}
              className="position"
            >
              <i class="fas fa-arrows-alt" />
            </div>
          ) : null}
          {this.props.selected ? (
            <div className="utilBtn">
              <button
                onClick={() => this.handleOnClickDelBtn()}
                className="btn"
              >
                <i class="fas fa-trash-alt" />
              </button>
              <button className="btn">
                <i class="fas fa-copy" />
              </button>
            </div>
          ) : null}
        </div>
        {this.showInner()}
      </div>
    ) : null;
  }
}

class Button extends Component {
  constructor(props) {
    super(props);
    const initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: "block",
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [
                  {
                    text: "CLICK ME!"
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return !this.props.selected ? (
      <div
        className="content"
        style={{
          color: "white",
          backgroundColor: "#3AAEE0",
          textAlign: "center",
          lineHeight: "120%",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent",
          borderRadius: "4px",
          paddingTop: "10px",
          paddingRight: "20px",
          paddingLeft: "20px",
          paddingBottom: "10px"
        }}
      >
        <Editor
          value={this.state.value}
          readOnly={true}
          onChange={this.onChange}
        />
      </div>
    ) : (
      <div
        className="content"
        style={{
          color: "white",
          backgroundColor: "#3AAEE0",
          textAlign: "center",
          lineHeight: "120%",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent",
          borderRadius: "4px",
          paddingTop: "10px",
          paddingRight: "20px",
          paddingLeft: "20px",
          paddingBottom: "10px"
        }}
      >
        <Editor
          value={this.state.value}
          readOnly={false}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

class Divider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="content"
        style={{
          width: "100%",
          borderBottom: "1px solid #BBBBBB"
        }}
      />
    );
  }
}

class Html extends Component {
  constructor(props) {
    super(props);
    const initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: "block",
            marks: {
              b: "bold"
            },
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [
                  {
                    text: "Hello, world!"
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return !this.props.selected ? (
      <div
        className="content"
        style={{
          color: "#373A3C",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <Editor
          value={this.state.value}
          readOnly={true}
          onChange={this.onChange}
        />
      </div>
    ) : (
      <div
        className="content"
        style={{
          color: "#373A3C",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <Editor
          value={this.state.value}
          readOnly={false}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        className="content"
        style={{
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <img
          src="https://media.giphy.com/media/Ov7lAOUsu4Yo0/giphy.gif"
          alt="logo"
        />
      </div>
    );
  }
}

class Text extends Component {
  constructor(props) {
    super(props);
    this.props = {
      selected: false
    };
    const initialValue = Value.fromJSON({
      document: {
        nodes: [
          {
            object: "block",
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [
                  {
                    text: "A line of text in a paragraph."
                  }
                ]
              }
            ]
          }
        ]
      }
    });
    this.state = { value: initialValue };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return !this.props.selected ? (
      <div
        className="content"
        style={{
          color: "black",
          textAlign: "left",
          lineHeight: "140%",
          paddingTop: "10px",
          paddingRight: "10px",
          paddingLeft: "10px",
          paddingBottom: "10px"
        }}
      >
        <Editor
          value={this.state.value}
          readOnly={true}
          onChange={this.onChange}
        />
      </div>
    ) : (
      <div
        className="content"
        style={{
          color: "black",
          textAlign: "left",
          lineHeight: "140%",
          paddingTop: "10px",
          paddingRight: "10px",
          paddingLeft: "10px",
          paddingBottom: "10px"
        }}
      >
        <Editor value={this.state.value} onChange={this.onChange} />
      </div>
    );
  }
}

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <div
          className="columnList"
          style={{
            width: "100%",
            height: "100px",
            display: "grid",
            gridTemplateColumns: this.props.columnArray
          }}
        >
          {this.props.columnArray
            .split(" ")
            .map(() => (
              <div
                className="column"
                style={{
                  outline: "0.5px dashed darkblue",
                  backgroundColor: "#9dc3d3",
                  textAlign: "center"
                }}
              >
                <div className="smallbuilder" />Insert Content
              </div>
            ))
            .reduce((prev, curr) => prev + curr)}
        </div>
        <div className="builder" />
      </Fragment>
    );
  }
}

export default EditorLeft;
