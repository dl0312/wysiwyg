import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Query } from "react-apollo";
import { CATEGORIES } from "../../queries";

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 5px;
`;

const CategorySelectionContainer = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  width: 700px;
  height: 500px;
  margin: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 10px;
`;

const SearchInput = styled.input`
  width: 200px;
  margin-bottom: 5px;
  padding: 0 10px;
  height: 30px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const CategoryName = styled.div`
  margin-top: 5px;
  text-transform: uppercase;
  font-size: 10px;
  text-align: center;
`;

const WikiImage = styled.img`
  width: 50px;
  height: 50px;
  filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.5));
`;

const DataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

const Button = styled.div`
  text-transform: uppercase;
  text-align: center;
  padding: 5px 10px;
  margin: 5px 10px;
  border-radius: 5px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
`;

const SelectedListContainer = styled.div`
  transition: min-height 0.5s ease;
  min-height: 30px;
  width: 100%;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  border: 1px solid black;
  padding: 5px;
`;

const UpperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const SelectedContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 5px;
  border: 0.5px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  margin: 2px;
`;

const SelectedImg = styled.img`
  width: 20px;
  margin-right: 2px;
  border-radius: 2px;
`;

const SelectedTitle = styled.span`
  text-transform: uppercase;
  font-size: 10px;
  margin-right: 5px;
`;

const SelectedIcon = styled.i`
  font-size: 10px;
`;

class CategorySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategories: []
    };
  }

  handleonClick = category => {
    const { type, addIdToState } = this.props;
    const { selectedCategories } = this.state;
    const found = selectedCategories.find(({ id }) => {
      return id === category.id;
    });
    if (!found) {
      this.setState({
        selectedCategories: selectedCategories.concat({
          id: category.id,
          name: category.name,
          shownImageUrl:
            category.wikiImages[0] !== undefined
              ? category.wikiImages[0].shownImage.url
              : "https://image.freepik.com/free-icon/question-mark-inside-a-box-outline_318-51427.jpg"
        })
      });
      addIdToState(type, category.id);
    }
  };

  deleteSelected = category => {
    const { type, addIdToState, deleteIdToState } = this.props;
    let { selectedCategories } = this.state;
    const index = selectedCategories.findIndex(({ id }) => {
      return id === category.id;
    });
    console.log(index);
    selectedCategories.splice(index, 1);
    console.log();
    this.setState({
      selectedCategories
    });
    deleteIdToState(type, category.id);
  };

  render() {
    const { type, addIdToState } = this.props;
    const { selectedCategories } = this.state;
    return (
      <CategorySelectionContainer>
        <Helmet>
          <title>Wiki</title>
        </Helmet>
        <UpperContainer>
          <Button>{type}</Button>
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
                                    hoverImgJson:
                                      category.wikiImages[0].hoverImage,
                                    onImage: true
                                  })
                                }
                                onMouseMove={this.getPos}
                                onMouseOut={() => {
                                  this.setState({
                                    onImage: false
                                  });
                                }}
                                onClick={() => this.handleonClick(category)}
                              />
                            ) : (
                              <WikiImage
                                src={
                                  "https://image.freepik.com/free-icon/question-mark-inside-a-box-outline_318-51427.jpg"
                                }
                                onClick={() => this.handleonClick(category)}
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
        </UpperContainer>
        <SelectedListContainer>
          {selectedCategories.map(selectedCategory => {
            return (
              <SelectedContainer>
                <SelectedImg
                  src={selectedCategory.shownImageUrl}
                  alt={selectedCategory.name}
                />
                <SelectedTitle>{selectedCategory.name}</SelectedTitle>
                <SelectedIcon
                  className="fas fa-times"
                  onClick={() => this.deleteSelected(selectedCategory)}
                />
              </SelectedContainer>
            );
          })}
        </SelectedListContainer>
      </CategorySelectionContainer>
    );
  }
}

export default CategorySelection;
