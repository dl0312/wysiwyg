import React from "react";
import EditorLeft from "./EditorLeft";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Editor } from "slate-react";

class UserView extends React.Component {
  render() {
    const { json } = this.props;
    const compArray = [];
    json.cards.map((item, index) => {
      switch (item.type) {
        case "columnList":
          compArray.push(
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
          break;
        default:
          break;
      }
    });
    return (
      <EditorLeft
        color={json.color}
        contentWidth={json.contentWidth}
        font={json.font}
      >
        <div style={{ marginTop: "30px" }} />
        {compArray}
      </EditorLeft>
    );
  }
}

export default UserView;

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
    const { greedy, isOver, isOverCurrent, contentWidth, cards } = this.props;
    let backgroundColor = cards.length === 1 ? "#f6e58d" : "white";
    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = "#b8e994";
    }

    const compArray = [];
    cards.map((item, index) => {
      switch (item.type) {
        case "content":
          compArray.push(
            <UserContainer
              type={item.type}
              value={item.value}
              imageSrc={item.imageSrc}
              videoSrc={item.videoSrc}
              content={item.content}
              index={this.props.index.concat(index)}
              key={index}
              align={item.align}
              fullWidth={item.fullWidth}
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

const handleStyle = {
  backgroundColor: "#9c88ff",
  width: "2rem",
  height: "2rem",
  borderTopRightRadius: "100%",
  borderBottomRightRadius: "100%",
  marginRight: "0.75rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  position: "absolute",
  zIndex: "100",
  top: "50%",
  transform: "translate(44px,-16px)",
  marginLeft: "-2px",
  right: "0px"
};

const buttonStyle = {
  border: "none",
  outline: "none",
  backgroundColor: "#9c88ff",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2rem",
  height: "2rem",
  marginBottom: "10px",
  cursor: "pointer"
};

const toolStyle = {
  display: "flex",
  zIndex: "100",
  position: "absolute",
  marginRight: "0.75rem",
  cursor: "-webkit-grab",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  top: "50%",
  transform: "translate(108px,-16px)",
  marginLeft: "-2px",
  right: "0px"
};

const cardSource = {
  beginDrag(props, monitor, component) {
    props.masterCallback("OnDrag", "content");
    return { index: props.index };
  },
  endDrag(props, monitor, component) {
    props.masterCallback("OnDrag", null);
    return { index: props.index };
  }
};

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
    if (this.props.type === "content") {
      switch (this.props.content) {
        case "BUTTON":
          return (
            <Button
              value={this.props.value}
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
          return (
            <Html
              value={this.props.value}
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
              src={this.props.imageSrc}
              fullWidth={this.props.fullWidth}
              contentWidth={this.props.contentWidth}
            />
          );
        case "TEXT":
          return (
            <Text
              value={this.props.value}
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
              src={this.props.videoSrc}
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

  handleOnMouseOver = event => {
    event.stopPropagation();
    this.props.callbackfromparent("mouseover", this.props.index);
  };

  handleOnMouseOverTool = event => {
    event.stopPropagation();
    this.setState({
      toolHover: true
    });
    // console.log(`tool in toolHover true`);
  };

  handleOnMouseLeaveTool = event => {
    event.stopPropagation();

    this.setState({
      toolHover: false
    });
    // console.log(`tool out toolHover true`);
  };

  handleOnMouseDown = event => {
    event.stopPropagation();
    this.props.callbackfromparent("select", this.props.index);
  };

  handleOnMouseLeave = event => {
    event.stopPropagation();
    this.props.callbackfromparent("mouseleave", this.props.index);
  };

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDragPreview,
      // OnDrag,
      // content,
      // id,
      index,
      callbackfromparent,
      hoveredIndex,
      selectedIndex
    } = this.props;
    const opacity = isDragging ? 0.2 : 1;
    const hover = hoveredIndex
      ? hoveredIndex.length === index.length &&
        hoveredIndex.every((v, i) => v === index[i])
        ? true
        : false
      : false;
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
            this.props.align !== undefined ? this.props.align : "center",
          position: "relative",
          padding: "10px",
          width: "100%",
          opacity
        }}
      >
        {this.showInner(active)}
      </div>
    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(this.props.selected);
    return (
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
          autoFocus
          value={this.props.value}
          readOnly={this.props.selected ? false : true}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
        />
      </div>
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
        <divs
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
          readOnly={false}
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
          alt="logo"
        />
      </div>
    );
  }
}

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
          autoFocus
          value={this.props.value}
          readOnly={this.props.selected ? false : true}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          renderNode={this.props.renderNode}
          renderMark={this.props.renderMark}
        />
      </div>
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
          src={`https://www.youtube.com/embed/${this.props.src}?ecver=1`}
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
