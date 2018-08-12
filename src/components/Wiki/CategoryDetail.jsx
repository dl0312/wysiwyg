import React from "react";
import { graphql, Mutation, Query } from "react-apollo";
import { Link } from "react-router-dom";
import { CATEGORY } from "../../queries";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import ImagePopup from "../../utility/ImagePopup";
import Pos from "../../utility/Pos";

const Subtitle = styled.div`
  font-size: 15px;
  font-weight: bolder;
  padding: 5px 10px;
  border-radius: 5px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
`;

const WikiEditContainer = styled.div`
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
`;

const ParentOrChildrenListContainer = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: ${props =>
    props.section === "parent" ? "1fr" : "repeat(4, 1fr)"};
  grid-gap: 2px;
`;

const ParentOrChildrenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 15px;
  border: 0.5px solid rgba(0, 0, 0, 0.5);
  border-radius: 10px;
`;

const ItemCard = styled.div`
  border: 0.5px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CurrentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CurrentImg = styled.img`
  width: 200px;
  margin: 5px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
`;

const Input = styled.input`
  width: 100%;
  padding: 0 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const CurrentName = styled.div`
  margin: 5px;
`;

const CurrentHoverContainer = styled.div``;

class CategoryDetail extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.data.GetCategoryById);
    this.state = {
      pos: new Pos(0, 0),
      name: "",
      parentId: [],
      childrenIds: [],
      shownImgUrl: "",
      hoverImgJson: "",
      onImage: false,
      category:
        props.data.GetCategoryById !== undefined
          ? props.data.GetCategoryById.category
          : null
    };
  }

  componentWillReceiveProps = nextProps => {
    console.log(nextProps);
    const {
      data: {
        GetCategoryById: { category, ok }
      }
    } = nextProps;
    if (category) {
      if (ok) {
        this.setState({ category }, () =>
          this.setState({
            name: this.state.category.name,
            parentIds: this.state.category.parent.map(parent => parent.id),
            childrenIds: this.state.category.children.map(child => child.id),
            shownImgUrl:
              this.state.category.wikiImages.length !== 0
                ? this.state.category.wikiImages[0].shownImage.url
                : null,
            hoverImgJson:
              this.state.category.wikiImages.length !== 0
                ? this.state.category.wikiImages[0].hoverImage
                : null
          })
        );
      }
    }
  };

  render() {
    const {
      pos,
      name,
      parentId,
      childrenIds,
      category,
      hoverImgJson,
      onImage
    } = this.state;
    return category ? (
      <React.Fragment>
        <Helmet>
          <title>{`category: ${name}`}</title>
        </Helmet>

        <WikiEditContainer>
          <ParentOrChildrenContainer>
            <Subtitle>PARENT</Subtitle>
            <ParentOrChildrenListContainer section="parent">
              {/* <Query query={CATEGORY} variables={{ categoryId: parentId }}>
                {({ loading, data, error }) => {
                  if (loading) return "loading";
                  if (error) return `${error.message}`;
                  return;
                }}
              </Query> */}
              {category.parent.map(parent => (
                <ItemCard>{parent.name}</ItemCard>
              ))}
            </ParentOrChildrenListContainer>
          </ParentOrChildrenContainer>
          <CurrentContainer>
            <Link to={`/category/edit/${category.id}`}>
              <button>edit</button>
            </Link>
            {category.wikiImages[0] ? (
              <React.Fragment>
                <CurrentImg
                  src={category.wikiImages[0].shownImage.url}
                  alt={category.name}
                  onMouseOver={() =>
                    this.setState({
                      hoverImgJson: category.wikiImages[0].hoverImage,
                      onImage: true
                    })
                  }
                  onMouseMove={this.getPos}
                  onMouseOut={() => {
                    this.setState({ onImage: false });
                  }}
                />
              </React.Fragment>
            ) : (
              <CurrentImg
                src={
                  "https://image.freepik.com/free-icon/question-mark-inside-a-box-outline_318-51427.jpg"
                }
              />
            )}
            <CurrentName>{category.name}</CurrentName>
            <CurrentHoverContainer>
              {category.wikiImages[0] !== undefined ? (
                <ImagePopup
                  pos={pos}
                  follow={false}
                  json={category.wikiImages[0].hoverImage.slice(1, -1)}
                  onImage={true}
                />
              ) : (
                <div>no hover image</div>
              )}
            </CurrentHoverContainer>
            <ImagePopup
              pos={pos}
              json={hoverImgJson ? hoverImgJson.slice(1, -1) : null}
              onImage={onImage}
            />
          </CurrentContainer>
          <ParentOrChildrenContainer>
            <Subtitle>CHILDREN</Subtitle>
            <ParentOrChildrenListContainer section="children">
              {category.children.map(child => (
                <ItemCard>{child.name}</ItemCard>
              ))}
            </ParentOrChildrenListContainer>
          </ParentOrChildrenContainer>
        </WikiEditContainer>
      </React.Fragment>
    ) : null;
  }
}

export default graphql(CATEGORY, {
  options: props => ({
    variables: { categoryId: props.match.params.categoryId }
  })
})(CategoryDetail);
