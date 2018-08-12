import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { compose, graphql, Query } from "react-apollo";
import { CATEGORY_SELECTION } from "../../queries";

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 5px;
  margin: 5px 0;
`;

const CategorySelectionContainer = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  width: 400px;
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
      keyword: "",
      selectedCategories: this.props.selectedCategories
    };
  }

  componentWillReceiveProps = nextProps => {
    console.log(nextProps);
    this.setState({ selectedCategories: nextProps.selectedCategories });
  };

  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      "shouldComponentUpdate: " +
        JSON.stringify(nextProps) +
        " " +
        JSON.stringify(nextState)
    );
    return true;
  }

  handleonClick = category => {
    const { selectedCategories } = this.state;
    const { type, addIdToState } = this.props;
    const found = selectedCategories.find(({ id }) => {
      return id === category.id;
    });
    if (!found) {
      addIdToState(type, category.id);
    }
  };

  deleteSelected = category => {
    const { type, deleteIdToState } = this.props;
    deleteIdToState(type, category.id);
  };

  render() {
    const { type } = this.props;
    const { selectedCategories, keyword } = this.state;
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
              e.preventDefault();
              this.setState({ keyword: e.target.value });
            }}
          />
          <Query
            query={CATEGORY_SELECTION}
            variables={{
              keyword,
              categoriesIds: selectedCategories
            }}
            key={type}
          >
            {({ loading, data, error }) => {
              if (loading) return "loading";
              if (error) return `${error.message}`;
              console.log(data);
              return (
                <React.Fragment>
                  <ListContainer>
                    {data.GetCategoriesByKeyword.categories.map(
                      (category, index) => (
                        <React.Fragment key={index}>
                          <DataContainer
                            onClick={() => this.handleonClick(category)}
                          >
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
                  <SelectedListContainer>
                    {data.GetCategoriesByIds.categories.map(
                      (category, index) => {
                        return (
                          <SelectedContainer key={index}>
                            {/* <SelectedImg
                                  src={category.wikiImages[0].shownImage.url}
                                  alt={category.name}
                                /> */}
                            <SelectedTitle>{category.name}</SelectedTitle>
                            <SelectedIcon
                              className="fas fa-times"
                              onClick={() => this.deleteSelected(category)}
                            />
                          </SelectedContainer>
                        );
                      }
                    )}
                  </SelectedListContainer>
                </React.Fragment>
              );
            }}
          </Query>
        </UpperContainer>
      </CategorySelectionContainer>
    );
  }
}

export default CategorySelection;
