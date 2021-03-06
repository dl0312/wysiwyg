import React from "react";
import EditorLeft from "../components/Editor/EditorLeft";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Editor } from "slate-react";
import { Value } from "slate";
import { Link } from "react-router-dom";

const ClapImage = styled.img`
  width: ${props => (props.small ? "20px" : null)};
  margin-left: ${props => (props.small ? "2px" : null)};
  margin-right: ${props => (props.small ? "2px" : null)};
  max-width: 100%;
  max-height: 20em;
  margin-bottom: ${props => (props.small ? "-4px" : null)};
  box-shadow: ${props => (props.selected ? "0 0 0 2px blue;" : "none")};
`;

const ClapImageContainer = styled.span`
  margin-left: ${props => (props.small ? "2px" : null)};
  margin-right: ${props => (props.small ? "2px" : null)};
  cursor: pointer;
`;

const ClapImageText = styled.span`
  font-weight: bolder;
  color: #dbb74c;
`;

const HoverBorder = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.5);
  outline: 0.5px solid black;
`;

class HoverView extends React.Component {
  renderNode = props => {
    const { attributes, children, node, isFocused } = props;

    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "clap-image":
        {
          const represent_src = node.data.get("represent");
          const hover_src = node.data.get("hover");
          const name = node.data.get("name");
          const type = node.data.get("type");
          switch (type) {
            case "TEXT":
              return (
                <ClapImageContainer
                  onMouseOver={() =>
                    this.setState({
                      hoverImgJson: hover_src
                    })
                  }
                  onMouseMove={this.getPos}
                  onMouseOut={() => {
                    this.setState({ hoverImgJson: null });
                  }}
                  small={true}
                >
                  <ClapImageText>{name}</ClapImageText>
                </ClapImageContainer>
              );
            case "MINI_IMG":
              return (
                <ClapImageContainer
                  onMouseOver={() =>
                    this.setState({
                      hoverImgJson: hover_src
                    })
                  }
                  onMouseMove={this.getPos}
                  onMouseOut={() => {
                    this.setState({ hoverImgJson: null });
                  }}
                  small={true}
                >
                  <ClapImage
                    small={true}
                    src={represent_src}
                    alt={"hover"}
                    selected={isFocused}
                    {...attributes}
                  />
                  <ClapImageText>{name}</ClapImageText>
                </ClapImageContainer>
              );
            case "NORMAL_IMG":
              return (
                <ClapImage
                  src={represent_src}
                  alt={"hover"}
                  selected={isFocused}
                  onMouseOver={() =>
                    this.setState({
                      hoverImgJson: hover_src
                    })
                  }
                  onMouseMove={this.getPos}
                  onMouseOut={() => {
                    this.setState({ hoverImgJson: null });
                  }}
                  {...attributes}
                />
              );
            default:
              break;
          }
        }
        break;
      default:
        break;
    }
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = props => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case "font-family":
        return (
          <span style={{ fontFamily: mark.data.get("fontFamily") }}>
            {children}
          </span>
        );
      case "font-size":
        return (
          <span style={{ fontSize: mark.data.get("fontSize") }}>
            {children}
          </span>
        );
      case "font-color":
        return (
          <span
            style={{
              color: `rgba(${mark.data.get("fontColor").rgb.r},
              ${mark.data.get("fontColor").rgb.g},
              ${mark.data.get("fontColor").rgb.b},
              ${mark.data.get("fontColor").rgb.a})`
            }}
          >
            {children}
          </span>
        );
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return;
    }
  };

  render() {
    const { json } = this.props;

    if (json.cards.length === 1) {
      if (json.cards[0].columnListArray[0].length === 1) {
        if (
          json.cards[0].columnListArray[0][0].content === "IMAGE" ||
          json.cards[0].columnListArray[0][0].content === "VIDEO"
        ) {
          return (
            <React.Fragment>
              {json.cards.map((item, index) => {
                if (item.type === "columnList") {
                  return (
                    <UserCard
                      inColumn={false}
                      cards={json.cards.length}
                      key={index}
                      hoveredIndex={json.hoveredIndex}
                    >
                      <UserColumn
                        columnArray={item.content}
                        columnListArray={item.columnListArray}
                        index={[index, 0, 0]}
                        renderNode={this.renderNode}
                        renderMark={this.renderMark}
                        contentWidth={json.contentWidth}
                      />
                    </UserCard>
                  );
                } else {
                  return null;
                }
              })}
            </React.Fragment>
          );
        }
      }
    }
    return (
      <HoverBorder>
        <EditorLeft
          color={json.color}
          contentWidth={json.contentWidth}
          font={json.font}
          view="USER"
        >
          {json.cards.map((item, index) => {
            if (item.type === "columnList") {
              return (
                <UserCard
                  inColumn={false}
                  cards={json.cards.length}
                  key={index}
                  hoveredIndex={json.hoveredIndex}
                >
                  <UserColumn
                    columnArray={item.content}
                    columnListArray={item.columnListArray}
                    index={[index, 0, 0]}
                    renderNode={this.renderNode}
                    renderMark={this.renderMark}
                    contentWidth={json.contentWidth}
                  />
                </UserCard>
              );
            } else {
              return null;
            }
          })}
        </EditorLeft>
      </HoverBorder>
    );
  }
}

export default HoverView;

const style = {
  backgroundColor: "transparent",
  width: "99%",
  position: "relative",
  padding: "0.1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isDragging } = this.props;
    const opacity = isDragging ? 0.2 : 1;

    return (
      <div style={{ ...style, opacity }} className="frame">
        {this.props.children}
      </div>
    );
  }
}

class UserColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const columnListStyle = {
      width: this.props.contentWidth,
      display: "grid",
      gridGap: "10px",
      gridTemplateColumns: this.props.columnArray.join("fr ") + "fr"
    };
    return (
      <div className="columnList" style={columnListStyle}>
        {this.props.columnListArray.map((columnList, index) => (
          <UserColumnItem
            key={index}
            cards={columnList}
            index={this.props.index.slice(0, 1).concat(index)}
            renderNode={this.props.renderNode}
            renderMark={this.props.renderMark}
            contentWidth={this.props.contentWidth}
          />
        ))}
      </div>
    );
  }
}

const Column = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

class UserColumnItem extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool.isRequired,
    greedy: PropTypes.bool,
    children: PropTypes.node
  };
  constructor(props) {
    super(props);
    this.state = {
      hasDropped: false,
      hasDroppedOnChild: false,
      contentHover: false
    };
  }

  render() {
    // 기본상태의 에디터화면 id=container, id=body
    const { contentWidth, cards } = this.props;

    const compArray = [];
    cards.map((item, index) => {
      switch (item.type) {
        case "content":
          compArray.push(
            <UserContainer
              item={item}
              index={this.props.index.concat(index)}
              key={index}
              contentWidth={contentWidth}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
          break;
        default:
          break;
      }
    });

    return <Column>{compArray}</Column>;
  }
}

class UserContainer extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    index: PropTypes.array.isRequired,
    isDragging: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      active: false,
      toolHover: false
    };
  }

  showInner = selected => {
    if (this.props.item.type === "content") {
      switch (this.props.item.content) {
        case "BUTTON":
          let value = null;
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
          } else {
            value = this.props.item.value;
          }
          return (
            <Button
              item={this.props.item}
              value={value}
              selected={selected}
              onChange={this.props.onChange}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "DIVIDER":
          return <Divider selected={selected} />;
        case "HTML":
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
          } else {
            value = this.props.item.value;
          }
          return (
            <Html
              value={value}
              selected={selected}
              onChange={this.props.onChange}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "IMAGE":
          return (
            <Image
              selected={selected}
              src={this.props.item.imageSrc}
              alt={this.props.item.alt}
              link={this.props.item.link}
              fullWidth={this.props.item.fullWidth}
              contentWidth={this.props.contentWidth}
            />
          );
        case "TEXT":
          if (!Value.isValue(this.props.item.value)) {
            value = Value.fromJSON(this.props.item.value);
          } else {
            value = this.props.item.value;
          }
          return (
            <Text
              value={value}
              item={this.props.item}
              selected={selected}
              onChange={this.props.onChange}
              onKeyDown={this.props.onKeyDown}
              renderNode={this.props.renderNode}
              renderMark={this.props.renderMark}
            />
          );
        case "VIDEO":
          return (
            <Video
              selected={selected}
              src={this.props.item.videoSrc}
              contentWidth={this.props.contentWidth}
            />
          );
        case "SOCIAL":
          return <Social selected={selected} />;
        default:
          break;
      }
    }
  };

  render() {
    const { index, selectedIndex } = this.props;
    const active = selectedIndex
      ? selectedIndex.length === index.length &&
        selectedIndex.every((v, i) => v === index[i])
        ? true
        : false
      : false;
    return (
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            this.props.item.content === "TEXT" ||
            this.props.item.content === "BUTTON" ||
            this.props.item.content === "HTML" ||
            this.props.item.content === "IMAGE" ||
            this.props.item.content === "VIDEO"
              ? this.props.item.align
                ? this.props.item.align
                : "center"
              : "center",
          position: "relative",
          padding: "10px",
          width: "100%"
        }}
      >
        {this.showInner(active)}
      </div>
    );
  }
}

const ButtonContainer = styled.div`
  color: ${props =>
    `rgba(${props.textColor.r}, ${props.textColor.g}, ${props.textColor.b}, ${
      props.textColor.a
    })`};
  background-color: ${props =>
    `rgba(${props.backgroundColor.r}, ${props.backgroundColor.g}, ${
      props.backgroundColor.b
    }, ${props.backgroundColor.a})`};
  &:hover {
    background-color: ${props =>
      `rgba(${props.hoverColor.r}, ${props.hoverColor.g}, ${
        props.hoverColor.b
      }, ${props.textColor.a})`};
  }
  transition: background-color 0.5s ease;
  text-align: center;
  line-height: 120%;
  border-top: 0 solid transparent;
  border-right: 0 solid transparent;
  border-left: 0 solid transparent;
  border-bottom: 0 solid transparent;
  border-radius: 4px;
  padding-top: 10px;
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: 10px;
  cursor: pointer;
`;

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ButtonContainer
        textColor={this.props.item.textColor}
        backgroundColor={this.props.item.backgroundColor}
        hoverColor={this.props.item.hoverColor}
        onClick={() => window.open(this.props.item.link, "_blank")}
      >
        <Editor
          autoFocus
          value={this.props.value}
          readOnly={true}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
        />
      </ButtonContainer>
    );
  }
}

class Divider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="content" style={{ width: "100%", padding: "20px" }}>
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid black"
          }}
        />
      </div>
    );
  }
}

class Html extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
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
          autoFocus
          value={this.props.value}
          readOnly={true}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
        />
      </div>
    );
  }
}

class Image extends React.Component {
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
          style={{
            width: this.props.fullWidth ? this.props.contentWidth : "100%"
          }}
          src={this.props.src}
          alt={this.props.alt}
        />
      </div>
    );
  }
}

const TextContainer = styled.div`
  color: black;
  text-align: ${props => props.textAlign};
  line-height: 140%;
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
`;

class Text extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      selected: false
    };
    this.state = {};
  }

  render() {
    return (
      <TextContainer
        textAlign={
          this.props.item.textAlign ? this.props.item.textAlign : "left"
        }
      >
        <Editor
          autoFocus
          value={this.props.value}
          readOnly={true}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
        />
      </TextContainer>
    );
  }
}

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        className="content"
        style={{
          position: "relative",
          width: "100%",
          height: "0",
          paddingBottom: "56.25%",
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent"
        }}
      >
        <iframe
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%"
          }}
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${
            this.props.src
          }?autoplay=1&showinfo=0&controls=0&modestbranding=1
`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }
}

class Social extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const buttonStyle = {
      borderRadius: "100%",
      border: "none",
      color: "white",
      width: "30px",
      height: "30px",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 2px"
    };
    return (
      <div
        className="content"
        style={{
          borderTop: "0 solid transparent",
          borderRight: "0 solid transparent",
          borderLeft: "0 solid transparent",
          borderBottom: "0 solid transparent",
          display: "flex"
        }}
      >
        <button style={{ ...buttonStyle, backgroundColor: "#1da1f2" }}>
          <i className="fab fa-twitter" />
        </button>
        <button style={{ ...buttonStyle, backgroundColor: "#3b5998" }}>
          <i className="fab fa-facebook-f" />
        </button>
        <button
          style={{
            ...buttonStyle,
            background:
              "radial-gradient(circle at 33% 100%, #FED373 4%, #F15245 30%, #D92E7F 62%, #9B36B7 85%, #515ECF)"
          }}
        >
          <i className="fab fa-instagram" />
        </button>
        <button style={{ ...buttonStyle, backgroundColor: "#ed3124" }}>
          <i className="fab fa-youtube" />
        </button>
      </div>
    );
  }
}
