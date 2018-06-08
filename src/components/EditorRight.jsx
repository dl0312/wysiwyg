import React, { Component, Fragment } from "react";
import styles from "./EditorRight.scss";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

const fontFamily = [
  "Roboto",
  "Oxygen",
  "Times New Roman",
  "Segoe UI",
  "Open Sans",
  "Helvetica Neue"
];

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

  fontCallback = dataFromChild => {
    this.props.callbackfromparentfont(dataFromChild);
  };

  dragCallback = dataFromChild => {
    this.props.callbackfromparentdrag(dataFromChild);
  };

  showSection = () => {
    switch (this.state.active) {
      case 0:
        return (
          <Content callbackfromparentdrag={this.dragCallback.bind(this)} />
        );
      case 1:
        return <Row callbackfromparentdrag={this.dragCallback.bind(this)} />;
      case 2:
        return (
          <Body
            callbackfromparent={this.myCallback.bind(this)}
            callbackfromparentwidth={this.widthCallback.bind(this)}
            callbackfromparentfont={this.fontCallback.bind(this)}
          />
        );
      default:
        break;
    }
  };

  render() {
    return (
      <Fragment>
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
        <Blockoption />
      </Fragment>
    );
  }
}

class Blockoption extends Component {
  render() {
    return (
      <div className={styles.blockOption}>
        <div className={styles.header}>
          <div className={styles.blockName}>CONTENT</div>
          <div className={styles.btnColumn}>
            <button className={styles.btn}>
              <i class="fas fa-trash-alt" />
            </button>
            <button className={styles.btn}>
              <i class="fas fa-copy" />
            </button>
            <button className={styles.btn}>
              <i class="fas fa-angle-down" />
            </button>
          </div>
        </div>
        <div className={styles.optionRows}>
          <div className={styles.optionHeader}>
            <div className={styles.optionTitle}>LINK</div>
            <button className={styles.btn}>
              <i class="fas fa-angle-up" />
            </button>
          </div>
          <div className={styles.btnLinkColumn}>
            <div className={styles.title}>Button Link</div>
            <div className={styles.case}>Same Tag</div>
          </div>
          <div className={styles.urlColumn}>
            <button className={styles.btn}>URL</button>
            <input type="text" />
          </div>
          <div className={styles.header}>
            <div className={styles.optionTitle}>COLORS</div>
            <div className={styles.btn}>
              <i class="fas fa-angle-up" />
            </div>
            <div className={styles.colorColumn}>
              <div className={styles.item}>
                <div className={styles.title}>Text Color</div>
                <div className={styles.color}>ㅁ</div>
              </div>
              <div className={styles.item}>
                <div className={styles.title}>Background Color</div>
                <div className={styles.color}>ㅁ</div>
              </div>
              <div className={styles.item}>
                <div className={styles.title}>Hover Color</div>
                <div className={styles.color}>ㅁ</div>
              </div>{" "}
            </div>
          </div>
          <div className={styles.header}>
            <div className={styles.optionTitle}>SPACING</div>
            <div className={styles.btn}>
              <i class="fas fa-angle-up" />
            </div>
            <div className={styles.btnLinkColumn}>
              <div className={styles.title}>Button Link</div>
              <div className={styles.case}>Same Tag</div>
            </div>
            <div className={styles.urlColumn}>
              <button className={styles.btn}>URL</button>
              <input type="text" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Content extends Component {
  handleContentOnDragStart = e => {
    console.log(e.target.children[1].innerHTML);
    this.props.callbackfromparentdrag("content");
    e.dataTransfer.setData("text", e.target.children[1].innerHTML);
  };

  handleOnDragEnd = e => {
    e.preventDefault();
    this.props.callbackfromparentdrag(null);
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
    console.log(e.target);

    this.props.callbackfromparentdrag("columnList");

    const columnArray = [];
    let i = 0;

    while (e.target.children[i]) {
      columnArray.push(e.target.children[i].innerHTML);
      i++;
    }

    e.dataTransfer.setData(
      "text",
      columnArray
        .map(ratio => ratio + "fr")
        .reduce((prev, curr) => prev + " " + curr)
    );
  };

  handleOnDragEnd = e => {
    console.log(e.target);

    e.preventDefault();
    this.props.callbackfromparentdrag(null);
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
  constructor(props) {
    super(props);
    this.state = {
      displayFontFamily: false,
      contentWidth: 600,
      font: "Segoe UI"
    };
  }

  myCallback = dataFromChild => {
    console.log(dataFromChild);
    this.props.callbackfromparent(dataFromChild);
    this.setState({ displayFontFamily: false });
  };

  handleOnChange = () => {
    console.log("in body comp width: " + this.state.contentWidth);
    this.props.callbackfromparentwidth(this.state.contentWidth);
  };

  handleOnClick = () => {
    console.log("popup!!!");
    this.setState({ displayFontFamily: !this.state.displayFontFamily });
  };

  handleOnClickFont = () => {
    this.props.callbackfromparentfont(this.state.font);
  };

  render() {
    return (
      <div className={styles.bodyBody}>
        <div className={styles.nav}>
          <div className={styles.navBar}>
            <div className={styles.title}>GENERAL</div>
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
                      {
                        this.state.contentWidth > 400
                          ? this.setState(
                              {
                                contentWidth: this.state.contentWidth - 50
                              },
                              () => this.handleOnChange()
                            )
                          : null;
                      }
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
                      {
                        this.state.contentWidth < 1100
                          ? this.setState(
                              {
                                contentWidth: this.state.contentWidth + 50
                              },
                              () => this.handleOnChange()
                            )
                          : null;
                      }
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
              <div className={styles.func}>
                <div>
                  <div className={styles.swatch} onClick={this.handleOnClick}>
                    <div
                      style={{ fontFamily: `${this.state.font}` }}
                      className={styles.font}
                    >
                      {this.state.font}
                    </div>
                  </div>
                  {this.state.displayFontFamily ? (
                    <div className={styles.popover}>
                      <div className={styles.fontColumn}>
                        {fontFamily.map(font => (
                          <div
                            className={styles.title}
                            onClick={() =>
                              this.setState(
                                {
                                  font
                                },
                                () => this.handleOnClickFont()
                              )
                            }
                            style={{ fontFamily: `${font}` }}
                          >
                            {font}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
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

  handleOnClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
    this.props.callbackfromparent(this.state.color);
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.setState({ color: color.rgb }, () =>
      this.props.callbackfromparent(this.state.color)
    );
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
        <div style={styles.swatch} onClick={this.handleOnClick}>
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
