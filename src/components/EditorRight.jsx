import React, { Component } from "react";
import styles from "./EditorRight.scss";
import reactCSS from "reactcss";

import { SketchPicker } from "react-color";

class EditorRight extends Component {
  state = {
    active: 0,
    hover: null
  };

  toggle = position => {
    if (this.state.active === position) {
      this.setState({ active: null });
    } else {
      this.setState({ active: position });
    }
  };

  hover = position => {
    if (this.state.hover === position) {
      this.setState({ hover: null });
    } else {
      this.setState({ hover: position });
    }
  };

  leave = position => {
    if (this.state.hover === position) {
      this.setState({ hover: null });
    }
  };

  myColor = position => {
    if (this.state.active === position) {
      return "#fafafa";
    }
    if (this.state.hover === position) {
      return "#c0c5c9";
    }
    return "";
  };

  fontColor = position => {
    if (this.state.active === position) {
      return "#505659";
    }
    if (this.state.hover === position) {
      return "#505659";
    }
    return "";
  };

  myCallback = dataFromChild => {
    console.log(dataFromChild);
    this.props.callbackfromparent(dataFromChild);
  };

  widthCallback = dataFromChild => {
    this.props.callbackfromparentwidth(dataFromChild);
  };

  showSection = () => {
    switch (this.state.active) {
      case 0:
        return <Content />;
        break;
      case 1:
        return <Row />;
        break;
      case 2:
        return (
          <Body
            callbackfromparent={this.myCallback.bind(this)}
            callbackfromparentwidth={this.widthCallback.bind(this)}
          />
        );
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className={styles.editorRight}>
        <ul className={styles.menuColumn}>
          <li
            style={{ background: this.myColor(0), color: this.fontColor(0) }}
            onClick={() => {
              this.toggle(0);
            }}
            onMouseOver={() => {
              this.hover(0);
            }}
            onMouseLeave={() => {
              this.leave(0);
            }}
            className={styles.menuItem}
          >
            <div className={styles.icon}>
              <i class="fas fa-th-large" />
            </div>
            <div className={styles.title}>CONTENT</div>
          </li>
          <li
            style={{ background: this.myColor(1), color: this.fontColor(1) }}
            onClick={() => {
              this.toggle(1);
            }}
            onMouseOver={() => {
              this.hover(1);
            }}
            onMouseLeave={() => {
              this.leave(1);
            }}
            className={styles.menuItem}
          >
            <div className={styles.icon}>
              <i class="fas fa-bars" />
            </div>
            <div className={styles.title}>ROW</div>
          </li>
          <li
            style={{ background: this.myColor(2), color: this.fontColor(2) }}
            onClick={() => {
              this.toggle(2);
            }}
            onMouseOver={() => {
              this.hover(2);
            }}
            onMouseLeave={() => {
              this.leave(2);
            }}
            className={styles.menuItem}
          >
            <div className={styles.icon}>
              <i class="fas fa-columns" />
            </div>
            <div className={styles.title}>BODY</div>
          </li>
        </ul>
        {this.showSection()}
      </div>
    );
  }
}

class Content extends Component {
  handleContentOnDragStart = e => {
    console.log(e);
    console.log(e.target.children[1].innerHTML);
    e.dataTransfer.setData(
      "text/html",
      "<div>" + e.target.children[1].innerHTML + "</div>"
    );
    // e.dataTransfer.drop.effect = "move";
    // e.dataTransfer.SetData("text/plain", v);
  };

  handleOnDragEnd = e => {
    e.preventDefault();
    console.log("ondragend: " + e);
  };

  render() {
    return (
      <div className={styles.contentBody}>
        <ul className={styles.contentColumn}>
          <li
            className={styles.item}
            draggable="true"
            onDragStart={this.handleContentOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.icon}>
              <i class="fas fa-square" />
            </div>
            <div className={styles.title}>BUTTON</div>
          </li>
          <li
            className={styles.item}
            draggable="true"
            onDragStart={this.handleContentOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.icon}>
              <i class="fas fa-divide" />
            </div>
            <div className={styles.title}>DIVIDER</div>
          </li>
          <li
            className={styles.item}
            draggable="true"
            onDragStart={this.handleContentOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.icon}>
              <i class="fas fa-code" />
            </div>
            <div className={styles.title}>HTML</div>
          </li>
          <li
            className={styles.item}
            draggable="true"
            onDragStart={this.handleContentOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.icon}>
              <i class="far fa-image" />
            </div>
            <div className={styles.title}>IMAGE</div>
          </li>
          <li
            className={styles.item}
            draggable="true"
            onDragStart={this.handleContentOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.icon}>
              <i class="fas fa-font" />
            </div>
            <div className={styles.title}>TEXT</div>
          </li>
        </ul>
      </div>
    );
  }
}

class Row extends Component {
  handleRowOnDragStart = e => {
    const columnArray = [];
    let i = 0;
    while (e.target.children[i]) {
      columnArray.push(e.target.children[i].innerHTML);
      i++;
    }
    console.log(e);
    console.log(columnArray);
    e.dataTransfer.setData(
      "text/html",
      `<div style="
      width: 100%;
      height: 100px; 
      display: grid;
      grid-template-columns: ${columnArray
        .map(ratio => ratio + "fr")
        .reduce((prev, curr) => prev + " " + curr)};
    ">` +
        columnArray
          .map(
            (ratio, index) => `<div class="column" style="
      border: 1px solid black; ">${ratio}</div>`
          )
          .reduce((prev, curr) => prev + curr) +
        "</div>"
    );
  };

  handleOnDragEnd = e => {
    e.preventDefault();
    console.log("ondragend: " + e);
  };

  render() {
    return (
      <div className={styles.rowBody}>
        <div className={styles.rowRow}>
          <div
            className={styles.item}
            draggable="true"
            onDragStart={this.handleRowOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.box}>1</div>
          </div>
          <div
            className={styles.item}
            draggable="true"
            onDragStart={this.handleRowOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.box}>1</div>
            <div className={styles.box}>1</div>
          </div>
          <div
            className={styles.item}
            draggable="true"
            onDragStart={this.handleRowOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.box}>1</div>
            <div className={styles.box}>1</div>
            <div className={styles.box}>1</div>
          </div>
          <div
            className={styles.item}
            draggable="true"
            onDragStart={this.handleRowOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.box}>1</div>
            <div className={styles.box}>1</div>
            <div className={styles.box}>1</div>
            <div className={styles.box}>1</div>
          </div>
          <div
            className={styles.item}
            draggable="true"
            onDragStart={this.handleRowOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.box}>1</div>
            <div className={styles.box}>2</div>
          </div>
          <div
            className={styles.item}
            draggable="true"
            onDragStart={this.handleRowOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.box}>2</div>
            <div className={styles.box}>1</div>
          </div>
          <div
            className={styles.item}
            draggable="true"
            onDragStart={this.handleRowOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          >
            <div className={styles.box}>1</div>
            <div className={styles.box}>2</div>
            <div className={styles.box}>1</div>
            <div className={styles.box}>2</div>
          </div>
        </div>
      </div>
    );
  }
}

class Body extends Component {
  state = {
    contentWidth: 600
  };

  myCallback = dataFromChild => {
    console.log(dataFromChild);
    this.props.callbackfromparent(dataFromChild);
  };

  handleOnChange = () => {
    console.log("in body comp width: " + this.state.contentWidth);
    this.props.callbackfromparentwidth(this.state.contentWidth);
  };

  render() {
    return (
      <div className={styles.bodyBody}>
        <div className={styles.nav}>
          <div className={styles.navBar}>
            <div className={styles.title}>GENERAL</div>
            <div className={styles.arrow}>▲</div>
          </div>
          <ul className={styles.column}>
            <li className={styles.item}>
              <div className={styles.subtitle}>Background Color</div>
              <div className={styles.func}>
                <SketchExample
                  callbackfromparent={this.myCallback.bind(this)}
                />
              </div>
            </li>
            <li className={styles.item}>
              <div className={styles.subtitle}>Content Width</div>
              <div className={styles.func}>
                <div className={styles.index}>
                  <button
                    onClick={() => {
                      this.setState(
                        {
                          contentWidth: this.state.contentWidth - 100
                        },
                        () => this.handleOnChange()
                      );
                    }}
                    className={styles.minusBtn}
                  >
                    -
                  </button>
                  <input
                    className={styles.num}
                    value={this.state.contentWidth}
                    readOnly="true"
                  />
                  <button
                    onClick={() => {
                      this.setState(
                        {
                          contentWidth: this.state.contentWidth + 100
                        },
                        () => this.handleOnChange()
                      );
                    }}
                    className={styles.plusBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            </li>
            <li className={styles.item}>
              <div className={styles.subtitle}>Font Family</div>
              <div className={styles.func}>ㅁ</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

class SketchExample extends Component {
  state = {
    displayColorPicker: false,
    color: {
      r: "255",
      g: "255",
      b: "255",
      a: "1"
    }
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.setState({ color: color.rgb });
    this.props.callbackfromparent(this.state.color);
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${
            this.state.color.b
          }, ${this.state.color.a})`
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer"
        },
        popover: {
          position: "absolute",
          marginTop: "5px",
          marginLeft: "-175px",
          zIndex: "2"
        },
        cover: {
          position: "relative",
          top: "0px",
          right: "100px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default EditorRight;
