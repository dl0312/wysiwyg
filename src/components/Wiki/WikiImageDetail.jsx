import React from "react";
import { Query } from "react-apollo";
import { CATEGORY } from "../../queries";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import ImagePopup from "../../utility/ImagePopup";
import Pos from "../../utility/Pos";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  font-family: "Nanum Gothic";
`;

const WikiDetailContainer = styled.div`
  width: 960px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CurrentCategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CurrentImg = styled.img`
  width: 200px;
  margin: 5px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
`;

const CurrentName = styled.div`
  font-size: 25px;
`;

const ParentChildrenContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 600px;
`;

const ParentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px 0;
  width: 100%;
`;

const ParentImg = styled.img`
  width: 75px;
  margin: 5px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
`;

const ParentName = styled.div``;

const ChildrenContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
`;

const ChildContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px 0;
`;

const ChildImg = styled.img`
  width: 75px;
  margin: 5px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
`;

const Subtitle = styled.div`
  font-size: 15px;
  font-weight: bolder;
  padding: 5px 10px;
  border-radius: 5px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
`;

const ChildName = styled.div`
  text-align: center;
`;

const CurrentHoverImg = styled.div``;

class WikiDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverImgJson: null,
      pos: new Pos(0, 0),
      onImage: false
    };
  }

  getPos = e => {
    const pos = new Pos(e.clientX, e.clientY - 100);
    this.setState({ pos });
  };

  render() {
    const { pos, hoverImgJson, onImage } = this.state;
    return (
      <React.Fragment>
        <Query
          query={CATEGORY}
          variables={{ categoryId: this.props.match.params.categoryId }}
        >
          {({ loading, data, error }) => {
            if (loading) return "loading";
            if (error) return `${error.message}`;
            const category = data.GetCategoryById.category;
            return (
              <React.Fragment>
                <Helmet>
                  <title>Wiki Detail: {category.name}</title>
                </Helmet>

                <PageContainer>
                  <Subtitle
                    style={{
                      right: "50px",
                      top: "120px",
                      position: "absolute"
                    }}
                  >
                    <Link
                      to={`/category/edit/${category.id}`}
                      style={{
                        textDecoration: "none"
                      }}
                      onClick={() =>
                        this.setState({
                          onImage: false
                        })
                      }
                    >
                      EDIT
                    </Link>
                  </Subtitle>
                  <WikiDetailContainer>
                    <CurrentCategoryContainer>
                      {category.wikiImages[0] ? (
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
                      ) : (
                        <CurrentImg
                          src={
                            "https://image.freepik.com/free-icon/question-mark-inside-a-box-outline_318-51427.jpg"
                          }
                        />
                      )}
                      <CurrentName>{category.name}</CurrentName>
                    </CurrentCategoryContainer>
                    <ParentChildrenContainer>
                      <Subtitle>PARENT</Subtitle>
                      <ParentContainer>
                        {category.parent ? (
                          <React.Fragment>
                            <Link
                              onClick={() =>
                                this.setState({
                                  onImage: false
                                })
                              }
                              to={`/category/read/${category.parent.id}`}
                              style={{
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                              }}
                            >
                              {category.parent.wikiImages[0] ? (
                                <ParentImg
                                  src={
                                    category.parent.wikiImages[0].shownImage.url
                                  }
                                  alt={category.parent.name}
                                  onMouseOver={() =>
                                    this.setState({
                                      hoverImgJson:
                                        category.parent.wikiImages[0]
                                          .hoverImage,
                                      onImage: true
                                    })
                                  }
                                  onMouseMove={this.getPos}
                                  onMouseOut={() => {
                                    this.setState({
                                      onImage: false
                                    });
                                  }}
                                />
                              ) : (
                                <ParentImg
                                  src={
                                    "https://image.freepik.com/free-icon/question-mark-inside-a-box-outline_318-51427.jpg"
                                  }
                                />
                              )}
                              <ParentName>{category.parent.name}</ParentName>
                            </Link>
                          </React.Fragment>
                        ) : null}
                      </ParentContainer>
                      <Subtitle>CHILDREN</Subtitle>
                      <ChildrenContainer>
                        {category.children.map(child => (
                          <Link
                            onClick={() =>
                              this.setState({
                                onImage: false
                              })
                            }
                            to={`/category/read/${child.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <ChildContainer>
                              {child.wikiImages[0] ? (
                                <ChildImg
                                  src={child.wikiImages[0].shownImage.url}
                                  alt={child.name}
                                  onMouseOver={() =>
                                    this.setState({
                                      hoverImgJson:
                                        child.wikiImages[0].hoverImage,
                                      onImage: true
                                    })
                                  }
                                  onMouseMove={this.getPos}
                                  onMouseOut={() => {
                                    this.setState({
                                      onImage: false
                                    });
                                  }}
                                />
                              ) : (
                                <ChildImg
                                  src={
                                    "https://image.freepik.com/free-icon/question-mark-inside-a-box-outline_318-51427.jpg"
                                  }
                                />
                              )}
                              <ChildName>{child.name}</ChildName>
                            </ChildContainer>
                          </Link>
                        ))}
                      </ChildrenContainer>
                    </ParentChildrenContainer>
                  </WikiDetailContainer>
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
                </PageContainer>
              </React.Fragment>
            );
          }}
        </Query>
        <ImagePopup
          pos={pos}
          json={hoverImgJson ? hoverImgJson.slice(1, -1) : null}
          onImage={onImage}
        />
      </React.Fragment>
    );
  }
}

export default WikiDetail;
