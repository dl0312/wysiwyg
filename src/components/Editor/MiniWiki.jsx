import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { Query } from "react-apollo";
import ImagePopup from "../../utility/ImagePopup";
import { CATEGORIES_KEYWORD } from "../../queries";
import Pos from "../../utility/Pos";

const WikiContainer = styled.div`
  padding-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
`;

const SearchInput = styled.input`
  width: 60%;
  padding: 0 10px;
  height: 25px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const InputTypeContainer = styled.div`
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 6px;
`;

const InputIcon = styled.i`
  font-size: ${props => (props.small ? "15px" : "20px")};
  transition: opacity 0.5s ease;
  opacity: ${props => (props.isSelcted ? "1" : "0.2")};
  color: black;
  &:hover {
    opacity: ${props => (props.isSelcted ? null : "0.5")};
  }
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 75px);
  grid-gap: 10px;
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

const CategoryName = styled.div`
  margin-top: 5px;
  text-transform: uppercase;
  font-size: 10px;
  text-align: center;
`;

function insertImage(change, represent, hover, name, type, target) {
  if (target) {
    change.select(target);
  }

  change.insertInline({
    type: "clap-image",
    isVoid: true,
    data: { represent, hover, name, type }
  });
}

class MiniWiki extends React.Component {
  state = {
    keyword: "",
    hoverImgJson: null,
    pos: new Pos(0, 0),
    onImage: false,
    inputType: "MINI_IMG"
  };

  getPos = e => {
    const pos = new Pos(e.clientX - 1050, e.clientY - 100);
    console.log(pos);
    this.setState({ pos });
  };

  render() {
    const { inputType, pos, hoverImgJson, onImage } = this.state;
    return (
      <React.Fragment>
        <WikiContainer>
          <InputContainer>
            <SearchInput
              type="text"
              onChange={e => {
                this.setState({ keyword: e.target.value });
              }}
              placeholder="Category name"
            />
            <InputTypeContainer>
              <InputIcon
                onClick={() =>
                  this.setState({
                    inputType: "TEXT"
                  })
                }
                isSelcted={inputType === "TEXT"}
                className="fas fa-font"
              />
              <InputIcon
                onClick={() =>
                  this.setState({
                    inputType: "MINI_IMG"
                  })
                }
                isSelcted={inputType === "MINI_IMG"}
                className="fas fa-user-circle"
              />
              <InputIcon
                onClick={() =>
                  this.setState({
                    inputType: "NORMAL_IMG"
                  })
                }
                isSelcted={inputType === "NORMAL_IMG"}
                className="fas fa-image"
              />
            </InputTypeContainer>
          </InputContainer>
          <Query
            query={CATEGORIES_KEYWORD}
            variables={{ keyword: this.state.keyword }}
          >
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
                                onClick={() => {
                                  const represent =
                                    category.wikiImages[0].shownImage.url;
                                  const hover =
                                    category.wikiImages[0].hoverImage;
                                  console.log(this.props);
                                  let change = this.props.selectedContent.value
                                    .change()
                                    .call(
                                      insertImage,
                                      represent,
                                      hover,
                                      category.name,
                                      this.state.inputType
                                    );
                                  console.log(change);

                                  this.props.handleOnChange(
                                    change,
                                    this.props.selectedIndex,
                                    "TEXT",
                                    "TEXT_CHANGE"
                                  );
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
export default MiniWiki;
