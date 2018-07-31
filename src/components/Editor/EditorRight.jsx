import React, { Component, Fragment } from "react";
import ContentItem from "./ContentItem";
import RowItem from "./RowItem";
import SketchExample from "./SketchExample";
import styled from "styled-components";
import EditorDefaults from "./EditorDefaults";

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
  font-size: 15px;
`;

const MenuTitle = styled.div`
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
  border: 0.5px solid #d8d8d8;
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

const SwatchFont = styled.div`
  padding: 5px 10px;
  font-family: ${props => props.fontFamily};
`;

const PopOver = styled.div`
  position: absolute;
  margin-top: 5px;
  z-index: 3;
  background-color: white;
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

const FontColumnItem = styled.div`
  cursor: pointer;
  width: 150px;
  padding: 5px 10px;
  font-family: ${props => props.fontFamily};
`;

const ViewsContainer = styled.div`
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ViewIcon = styled.i`
  font-size: 20px;
  transition: opacity 0.5s ease;
  opacity: ${props => (props.isSelcted ? "1" : "0.2")};
  color: black;
  &:hover {
    opacity: ${props => (props.isSelcted ? null : "0.5")};
  }
`;

const fontFamily = [
  "Roboto",
  "Oxygen",
  "Times New Roman",
  "Segoe UI",
  "Open Sans",
  "Helvetica Neue",
  "Nanum Gothic",
  "Nanum Myeongjo",
  "Kirang Haerang",
  "Nanum Pen Script",
  "Do Hyeon",
  "Nanum Gothic Coding",
  "Sunflower",
  "Iropke Batang"
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
        return (
          <Body
            view={this.props.view}
            masterCallback={this.props.masterCallback}
          />
        );
      case 3:
        return (
          <Title
            title={this.props.title}
            masterCallback={this.props.masterCallback}
          />
        );
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
              <MenuTitle>CONTENT</MenuTitle>
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
              <MenuTitle>ROW</MenuTitle>
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
              <MenuTitle>BODY</MenuTitle>
            </MenuItem>
            <MenuItem
              style={{ background: this.myColor(3), color: this.fontColor(3) }}
              onClick={() => {
                this.toggle(3);
              }}
              onMouseOver={() => {
                this.hover(3);
              }}
              onMouseLeave={() => {
                this.leave(3);
              }}
            >
              <Icon className="fas fa-feather" />
              <MenuTitle>TITLE</MenuTitle>
            </MenuItem>
          </MenuColumn>
          {this.showSection()}
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
      view: this.props.view,
      contentWidth: EditorDefaults.WIDTH,
      font: EditorDefaults.FONT
    };
  }

  handleOnChange = () => {
    this.props.masterCallback("width", this.state.contentWidth);
  };

  handleOnClick = type => {
    if (type === "FontFamily") {
      this.setState({ displayFontFamily: !this.state.displayFontFamily });
    } else if (type === "View") {
      this.setState({ displayViews: !this.state.displayViews });
    }
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

  handleOnClickView = view => {
    this.setState({ view }, () =>
      this.props.masterCallback("view", this.state.view)
    );
  };

  render() {
    const { view } = this.state;
    return (
      <BodyContainer>
        <NavBar>GENERAL</NavBar>
        <BodyColumn>
          <Item>
            Background Color
            <SketchExample
              masterCallback={this.props.masterCallback}
              type="BodyBackgroundColor"
              color={EditorDefaults.BACKGROUND_COLOR}
            />
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
                <Swatch onClick={() => this.handleOnClick("FontFamily")}>
                  <SwatchFont fontFamily={this.state.font}>
                    {this.state.font}
                  </SwatchFont>
                </Swatch>
                {this.state.displayFontFamily ? (
                  <PopOver>
                    <FontColumn>
                      {fontFamily.map(font => (
                        <FontColumnItem
                          onClick={() =>
                            this.setState(
                              {
                                font
                              },
                              () => this.handleOnClickFont()
                            )
                          }
                          fontFamily={font}
                        >
                          {font}
                        </FontColumnItem>
                      ))}
                    </FontColumn>
                  </PopOver>
                ) : null}
              </div>
            </div>
          </Item>
          <Item>
            Editor View
            <ViewsContainer>
              <ViewIcon
                onClick={() => this.handleOnClickView("EDIT")}
                isSelcted={view === "EDIT"}
                className="fas fa-edit"
              />
              <ViewIcon
                onClick={() => this.handleOnClickView("USER")}
                isSelcted={view === "USER"}
                className="fas fa-eye"
              />
              <ViewIcon
                onClick={() => this.handleOnClickView("JSON")}
                isSelcted={view === "JSON"}
                className="fas fa-file-alt"
              />
            </ViewsContainer>
          </Item>
        </BodyColumn>
      </BodyContainer>
    );
  }
}

const FunctionColumn = styled.div`
  display: flex;
  flex-direction: ${props => props.dir};
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: ${props => (props.isLast ? null : "1px solid #cacaca")};
`;

const FunctionTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
`;

const UrlColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 0 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const UrlColumnInput = Input.extend`
  height: 33px;
`;

class Title extends Component {
  handleOnChange = e => {
    this.props.masterCallback("Title", e.target.value);
  };

  render() {
    return (
      <BodyContainer>
        <NavBar>GENERAL</NavBar>
        <BodyColumn>
          <FunctionColumn dir={"column"} isLast={true}>
            <FunctionTitleContainer>
              <Item style={{ height: "20px" }}>Title</Item>
            </FunctionTitleContainer>
            <UrlColumn>
              <UrlColumnInput
                type="text"
                onChange={this.handleOnChange}
                value={this.props.title}
              />
            </UrlColumn>
          </FunctionColumn>
          <Item>Category</Item>
        </BodyColumn>
      </BodyContainer>
    );
  }
}

export default EditorRight;
