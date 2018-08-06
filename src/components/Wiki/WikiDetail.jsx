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
      pos: new Pos(0, 0)
    };
  }

  getPos = e => {
    const pos = new Pos(e.clientX, e.clientY - 100);
    console.log(pos);
    this.setState({ pos });
  };

  render() {
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
                  <WikiDetailContainer>
                    <CurrentCategoryContainer>
                      {category.wikiImages[0] ? (
                        <CurrentImg
                          src={category.wikiImages[0].shownImage.url}
                          alt={category.name}
                          onMouseOver={() =>
                            this.setState({
                              hoverImgJson: category.wikiImages[0].hoverImage
                            })
                          }
                          onMouseMove={this.getPos}
                          onMouseOut={() => {
                            this.setState({
                              hoverImgJson: null
                            });
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
                                  hoverImgJson: null
                                })
                              }
                              to={`/category/${category.parent.id}`}
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
                                        category.parent.wikiImages[0].hoverImage
                                    })
                                  }
                                  onMouseMove={this.getPos}
                                  onMouseOut={() => {
                                    this.setState({
                                      hoverImgJson: null
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
                        {category.children.map(
                          child => (
                            console.log(child),
                            (
                              <Link
                                onClick={() =>
                                  this.setState({
                                    hoverImgJson: null
                                  })
                                }
                                to={`/category/${child.id}`}
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
                                            child.wikiImages[0].hoverImage.url
                                        })
                                      }
                                      onMouseMove={this.getPos}
                                      onMouseOut={() => {
                                        this.setState({
                                          hoverImgJson: null
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
                            )
                          )
                        )}
                      </ChildrenContainer>
                    </ParentChildrenContainer>
                  </WikiDetailContainer>
                  {category.wikiImages[0] !== undefined ? (
                    <ImagePopup
                      follow={false}
                      json={category.wikiImages[0].hoverImage.slice(1, -1)}
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
          pos={this.state.pos}
          json={
            this.state.hoverImgJson
              ? this.state.hoverImgJson.slice(1, -1)
              : null
          }
        />
      </React.Fragment>
    );
  }
}

export default WikiDetail;
