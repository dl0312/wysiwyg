import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { Query } from "react-apollo";
import { Editor } from "slate-react";
import { Value } from "slate";
import { POST } from "../../queries";
import PropTypes from "prop-types";
import EditorLeft from "../Editor/EditorLeft";
import ImagePopup from "../../utility/ImagePopup";
import Pos from "../../utility/Pos";

const DetailContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

const PostContainer = styled.div`
  width: 960px;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid black;
`;

const Title = styled.div`
  /* width: 100%; */
`;

const CountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CountText = styled.div`
  /* width: 100%; */
`;

const BodyContainer = styled.div`
  /* width: 100%; */
`;

const CommentsListContainer = styled.div`
  width: 100%;
`;

const CommentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

class Detail extends React.Component {
  state = {};

  render() {
    console.log(this.props.match.params.postId);
    return (
      <React.Fragment>
        <Query
          query={POST}
          variables={{ postId: this.props.match.params.postId }}
        >
          {({ loading, data, error }) => {
            console.log(loading);
            console.log(error);
            if (loading) return "loading";
            if (error) return `${error.message}`;
            console.log(data);
            const post = data.GetPostById.post;
            console.log(
              post.body
                .slice(1, -1)
                .split(",")
                .map(block => JSON.parse(block))
            );
            return (
              <React.Fragment>
                <Helmet>
                  <title>Detail</title>
                </Helmet>
                <DetailContainer>
                  <PostContainer>
                    <TitleContainer>
                      <Title>{post.title}</Title>
                      <CountContainer>
                        <CountText>{post.view}</CountText>
                        <CountText>{post.commentsCount}</CountText>
                        <CountText>{post.clapsCount}</CountText>
                      </CountContainer>
                    </TitleContainer>
                    <BodyContainer>
                      <EditorLeft
                        color={
                          post.color
                            ? post.color
                            : { r: "255", g: "255", b: "255", a: "1" }
                        }
                        contentWidth={
                          post.contentWidth ? post.contentWidth : null
                        }
                        font={post.font ? post.font : null}
                      >
                        <div style={{ marginTop: "30px" }} />
                        {JSON.parse(post.body).map((item, index) => {
                          if (item.type === "columnList") {
                            return (
                              <UserCard
                                inColumn={false}
                                cards={post.cards.length}
                                key={index}
                              >
                                <UserColumn
                                  columnArray={item.content}
                                  columnListArray={item.columnListArray}
                                  index={[index, 0, 0]}
                                  renderNode={this.renderNode}
                                  renderMark={this.renderMark}
                                  contentWidth={post.contentWidth}
                                />
                              </UserCard>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </EditorLeft>
                    </BodyContainer>
                    <CommentsListContainer>
                      {post.comments.map(comment => (
                        <CommentContainer>
                          <div>{comment.user.fullName}</div>
                          <div>{comment.body}</div>
                          <div>{comment.createdAt}</div>
                        </CommentContainer>
                      ))}
                    </CommentsListContainer>
                  </PostContainer>
                </DetailContainer>
              </React.Fragment>
            );
          }}
        </Query>
      </React.Fragment>
    );
  }
}

export default Detail;

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
