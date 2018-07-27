import React, { Component, Fragment } from "react";
import styles from "./EditorRight.scss";
import reactCSS from "reactcss";
import ContentItem from "./ContentItem";
import RowItem from "./RowItem";
import BlockOptions from "./BlockOptions";
import { SketchPicker } from "react-color";
import styled from "styled-components";

const Container = styled.div`
  color: #505659;
  position: relative;
`;

const MenuColumn = styled.ul`
  color: #abacad;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 45px;
  background-color: #d6d9dc;
`;

const MenuItem = styled.li`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: -webkit-grab;
`;

const Icon = styled.i`
  font-size: 20px;
`;

const Title = styled.div`
  margin-left: 5px;
  font-size: 12px;
  font-weight: 600;
`;

const ContentBody = styled.div`
  padding: 15px;
`;

const ContentColumn = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
`;

const RowBody = styled.div`
  padding: 25px;
`;

const BodyContainer = styled.div`
  padding-top: 2px;
`;

const NavBar = styled.div`
  padding: 0 20px;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  color: rgb(81, 97, 103);
  background-color: rgb(234, 234, 234);
`;

const BodyColumn = styled.ul`
  height: 0px;
  padding: 0 20px;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  font-weight: 600;
  color: #8f9699;
`;

const Indicator = styled.input`
  height: 30px;
  text-align: center;
  width: 45px;
  border: none;
  border-top: 0.4px solid #d8d8d8;
  border-bottom: 0.4px solid #d8d8d8;
`;

const Operator = styled.button`
  height: 30px;
  width: 25px;
  border: none;
  background-color: #fff;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border: 0.4px solid #d8d8d8;
  outline: none;
`;

const Swatch = styled.div`
  width: 150px;
  padding: 5px;
  background-color: #fff;
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  cursor: pointer;
`;

const PopOver = styled.div`
  position: absolute;
  margin-top: 5px;
  z-index: 2;
`;

const FontColumn = styled.div`
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border: none;
  border-radius: 3px;
  border: 0.4px solid #d8d8d8;
  padding: 5px 0;
`;

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
    active: this.props.rightMenu,
    hover: null
  };

  toggle = position => {
    if (this.state.active === position) {
      this.props.masterCallback("rightMenu", null);
    } else {
      this.props.masterCallback("rightMenu", position);
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
    if (this.props.rightMenu === position) {
      return "#fafafa";
    }
    if (this.state.hover === position) {
      return "#c0c5c9";
    }
    return "";
  };

  fontColor = position => {
    if (this.props.rightMenu === position) {
      return "#505659";
    }
    if (this.state.hover === position) {
      return "#505659";
    }
    return "";
  };

  showSection = () => {
    switch (this.props.rightMenu) {
      case 0:
        return <Content masterCallback={this.props.masterCallback} />;
      case 1:
        return <Row masterCallback={this.props.masterCallback} />;
      case 2:
        return <Body masterCallback={this.props.masterCallback} />;
      default:
        break;
    }
  };

  render() {
    return (
      <Fragment>
        <Container>
          <MenuColumn>
            <MenuItem
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
            >
              <Icon className="fas fa-th-large" />
              <Title>CONTENT</Title>
            </MenuItem>
            <MenuItem
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
            >
              <Icon className="fas fa-bars" />
              <Title>ROW</Title>
            </MenuItem>
            <MenuItem
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
            >
              <Icon className="fas fa-columns" />
              <Title>BODY</Title>
            </MenuItem>
          </MenuColumn>
          {this.showSection()}
          <BlockOptions
            handleOnChange={this.props.handleOnChange}
            selectedIndex={this.props.selectedIndex}
            selectedContent={this.props.selectedContent}
            showSelected={this.props.showSelected}
            OnChangeCards={this.props.OnChangeCards}
          />
        </Container>
      </Fragment>
    );
  }
}

class Content extends Component {
  state = {
    contentItems: [
      { icon: "fas fa-square", name: "BUTTON" },
      { icon: "fas fa-divide", name: "DIVIDER" },
      { icon: "fas fa-code", name: "HTML" },
      { icon: "fas fa-image", name: "IMAGE" },
      { icon: "fas fa-font", name: "TEXT" },
      { icon: "fab fa-youtube", name: "VIDEO" },
      { icon: "fab fa-hubspot", name: "SOCIAL" },
      { icon: "fas fa-bars", name: "BANNER" },
      { icon: "fas fa-ellipsis-h", name: "MENU" }
    ]
  };

  addItem = name => {
    console.log(`adding name: ` + name);
  };

  render() {
    return (
      <ContentBody>
        <ContentColumn>
          {this.state.contentItems.map((item, index) => (
            <ContentItem
              key={index}
              item={item}
              icon={item.icon}
              name={item.name}
              handleDrop={name => this.addItem(name)}
              masterCallback={this.props.masterCallback}
            />
          ))}
        </ContentColumn>
      </ContentBody>
    );
  }
}

class Row extends Component {
  state = {
    rowItems: [
      { array: [1] },
      { array: [1, 1] },
      { array: [1, 1, 1] },
      { array: [1, 1, 1, 1] },
      { array: [1, 2] },
      { array: [2, 1] },
      { array: [1, 2, 1, 2] }
    ]
  };

  addItem = name => {
    console.log(`adding name: ` + name);
  };

  render() {
    return (
      <RowBody>
        {this.state.rowItems.map((item, index) => (
          <RowItem
            key={index}
            item={item}
            array={item.array}
            handleDrop={name => this.addItem(name)}
            masterCallback={this.props.masterCallback}
          />
        ))}
      </RowBody>
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

  handleOnChange = () => {
    this.props.masterCallback("width", this.state.contentWidth);
  };

  handleOnClick = () => {
    this.setState({ displayFontFamily: !this.state.displayFontFamily });
  };

  handleOperatorOnClick = operator => {
    if (operator === "-") {
      if (this.state.contentWidth > 400) {
        this.setState(
          {
            contentWidth: this.state.contentWidth - 50
          },
          () => this.handleOnChange()
        );
      }
    } else if (operator === "+") {
      if (this.state.contentWidth < 800)
        this.setState(
          {
            contentWidth: this.state.contentWidth + 50
          },
          () => this.handleOnChange()
        );
    }
  };

  handleOnClickFont = () => {
    this.props.masterCallback("font", this.state.font);
  };

  render() {
    return (
      <BodyContainer>
        <NavBar>GENERAL</NavBar>
        <BodyColumn>
          <Item>
            Background Color
            <SketchExample masterCallback={this.props.masterCallback} />
          </Item>
          <Item>
            Content Width
            <div>
              <Operator onClick={() => this.handleOperatorOnClick("-")}>
                -
              </Operator>
              <Indicator value={this.state.contentWidth} readOnly="true" />
              <Operator onClick={() => this.handleOperatorOnClick("+")}>
                +
              </Operator>
            </div>
          </Item>
          <Item>
            Font Family
            <div className="func">
              <div>
                <Swatch onClick={this.handleOnClick}>
                  <div
                    style={{
                      padding: "5px 10px",
                      fontFamily: `${this.state.font}`
                    }}
                    className={styles.font}
                  >
                    {this.state.font}
                  </div>
                </Swatch>
                {this.state.displayFontFamily ? (
                  <PopOver>
                    <FontColumn>
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
                          style={{
                            fontFamily: `${font}`,
                            cursor: "pointer",
                            width: "150px",
                            padding: "5px 10px"
                          }}
                        >
                          {font}
                        </div>
                      ))}
                    </FontColumn>
                  </PopOver>
                ) : null}
              </div>
            </div>
          </Item>
        </BodyColumn>
      </BodyContainer>
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
    this.props.masterCallback("backgroundColor", this.state.color);
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.setState({ color: color.rgb }, () =>
      this.props.masterCallback("backgroundColor", this.state.color)
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
