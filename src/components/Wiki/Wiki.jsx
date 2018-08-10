import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Query } from "react-apollo";
import ImagePopup from "../../utility/ImagePopup";
import Pos from "../../utility/Pos";
import { CATEGORIES } from "../../queries";

const WikiContainer = styled.div`
  padding: 20px 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 200px;
  margin-bottom: 30px;
  padding: 0 10px;
  height: 30px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

const WikiImage = styled.img`
  width: 70px;
  height: 70px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
`;

const DataContainer = styled.div`
  display: grid;
  grid-template-columns: 150px repeat(8, 1fr);
  grid-gap: 5px;
  height: 70px;
  margin: 2px 0;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.div`
  text-transform: uppercase;
  padding: 5px 10px;
  margin: 15px 10px;
  border-radius: 5px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
`;

const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const CategoryName = styled.div`
  margin: 5px 0;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: -0.5px;
`;

class Wiki extends React.Component {
  state = {
    keyword: "",
    hoverImgJson: null,
    onImage: false,
    pos: new Pos(0, 0)
  };

  getPos = e => {
    const pos = new Pos(e.clientX, e.clientY - 100);
    this.setState({ pos, onImage: true });
  };

  render() {
    const { pos, hoverImgJson, onImage } = this.state;
    return (
      <React.Fragment>
        <WikiContainer>
          <Buttons>
            <Button>add category</Button>
            <Button>add wikiimage</Button>
          </Buttons>
          <SearchInput
            type="text"
            onChange={e => {
              this.setState({ keyword: e.target.value });
            }}
          />
          <Query query={CATEGORIES} variables={{ keyword: this.state.keyword }}>
            {({ loading, data, error }) => {
              if (loading) return "loading";
              if (error) return `${error.message}`;
              return (
                <React.Fragment>
                  <Helmet>
                    <title>Wiki</title>
                  </Helmet>
                  <ListContainer>
                    {data.GetCategoriesByKeyword.categories.map(
                      (category, index) => (
                        <React.Fragment>
                          <DataContainer>
                            <Link
                              to={`/category/read/${category.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <CategoryContainer>
                                <CategoryName>{category.name}</CategoryName>
                              </CategoryContainer>
                            </Link>
                            {category.wikiImages.map(wikiImage => {
                              console.log(wikiImage);
                              return (
                                <React.Fragment>
                                  <WikiImage
                                    src={wikiImage.shownImage.url}
                                    alt={category.name}
                                    onMouseOver={() =>
                                      this.setState({
                                        hoverImgJson: wikiImage.hoverImage,
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
                                  <div>{wikiImage.clapsCount}</div>
                                  <div>{wikiImage.postsCount}</div>
                                </React.Fragment>
                              );
                            })}
                          </DataContainer>
                        </React.Fragment>
                      )
                    )}
                  </ListContainer>
                </React.Fragment>
              );
            }}
          </Query>
          <ImagePopup
            pos={pos}
            json={hoverImgJson ? hoverImgJson.slice(1, -1) : null}
            onImage={onImage}
          />
        </WikiContainer>
      </React.Fragment>
    );
  }
}
export default Wiki;
