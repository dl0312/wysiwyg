import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { Query } from "react-apollo";
import ImagePopup from "../../utility/ImagePopup";
import { CATEGORIES } from "../../queries";

const WikiContainer = styled.div`
  padding: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 100px;
  margin-bottom: 30px;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 100px;
  grid-gap: 10px;
`;

const WikiImage = styled.img`
  width: 50px;
  height: 50px;
`;

const DataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CategoryName = styled.div`
  margin: 5px 0;
  text-transform: uppercase;
  font-size: 10px;
`;

class MiniWiki extends React.Component {
  state = {
    keyword: "",
    hoverImgUrl: null
  };

  render() {
    return (
      <React.Fragment>
        <WikiContainer>
          <SearchInput
            type="text"
            onChange={e => {
              this.setState({ keyword: e.target.value });
            }}
          />
          <Query query={CATEGORIES} variables={{ keyword: this.state.keyword }}>
            {({ loading, data, error }) => {
              if (loading) return "loading";
              if (error) return "something happened";
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
                            {category.wikiImages[0] ? (
                              <WikiImage
                                src={category.wikiImages[0].shownImage.url}
                                alt={category.name}
                                onMouseOver={() =>
                                  this.setState({
                                    hoverImgUrl:
                                      category.wikiImages[0].hoverImage.url
                                  })
                                }
                                onMouseOut={() => {
                                  this.setState({
                                    hoverImgUrl: null
                                  });
                                }}
                              />
                            ) : (
                              <WikiImage
                                src={
                                  "https://image.freepik.com/free-icon/question-mark-inside-a-box-outline_318-51427.jpg"
                                }
                              />
                            )}
                            <CategoryName>{category.name}</CategoryName>
                          </DataContainer>
                        </React.Fragment>
                      )
                    )}
                  </ListContainer>
                </React.Fragment>
              );
            }}
          </Query>
          <ImagePopup left="0" top="0" url={this.state.hoverImgUrl} />
        </WikiContainer>
      </React.Fragment>
    );
  }
}
export default MiniWiki;
