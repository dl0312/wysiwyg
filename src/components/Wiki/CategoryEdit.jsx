import React from "react";
import styled from "styled-components";
import { CATEGORY } from "../../queries";
import { ADD_CATEGORY } from "../../queries";
import { graphql, Mutation, Query } from "react-apollo";
import { Link } from "react-router-dom";
import CategorySelection from "./CategorySelection";

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 30px;
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
const CategoryAddContainer = FlexBox.extend`
  width: 100%;
`;

const CategorySelectionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SendIcon = styled.button``;

class CategoryEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      parentIds: [],
      childrenIds: []
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
            childrenIds: this.state.category.children.map(child => child.id)
          })
        );
      }
    }
  };

  addIdToState = (type, id) => {
    if (type === "parent") {
      this.setState({ parentIds: this.state.parentIds.concat(id) });
    } else if (type === "children") {
      this.setState({
        childrenIds: this.state.childrenIds.concat(id)
      });
    }
  };

  deleteIdToState = (type, id) => {
    if (type === "parent") {
      let { parentIds } = this.state;
      const index = parentIds.findIndex;
      parentIds.splice(index, 1);
      this.setState({ parentIds });
    } else if (type === "children") {
      let { childrenIds } = this.state;
      const index = childrenIds.findIndex;
      childrenIds.splice(index, 1);
      this.setState({ childrenIds });
    }
  };

  render() {
    const { name, parentIds, childrenIds } = this.state;
    console.log(name);
    console.log(parentIds);
    console.log(childrenIds);
    return (
      <Mutation mutation={ADD_CATEGORY}>
        {(AddCategory, { data }) => (
          <CategoryAddContainer>
            <SearchInput
              type="text"
              value={name}
              onChange={e => {
                this.setState({ name: e.target.value });
              }}
            />
            <CategorySelectionsContainer>
              <CategorySelection
                addIdToState={this.addIdToState}
                deleteIdToState={this.deleteIdToState}
                type="parent"
                selectedCategoris={parentIds}
              />
              <CategorySelection
                addIdToState={this.addIdToState}
                deleteIdToState={this.deleteIdToState}
                type="children"
                selectedCategoris={childrenIds}
              />
            </CategorySelectionsContainer>
            {/* <Link to="/wiki"> */}
            <SendIcon
              onClick={() =>
                parentIds.length === 0 && childrenIds.length === 0
                  ? AddCategory({
                      variables: {
                        name
                      }
                    })
                  : parentIds.length === 1 && childrenIds.length === 0
                    ? AddCategory({
                        variables: {
                          name,
                          parentIds
                        }
                      })
                    : parentIds.length === 0 && childrenIds.length === 1
                      ? AddCategory({
                          variables: {
                            name,
                            childrenIds
                          }
                        })
                      : parentIds.length === 1 && childrenIds.length === 1
                        ? AddCategory({
                            variables: {
                              name,
                              parentIds,
                              childrenIds
                            }
                          })
                        : null
              }
            >
              Send
            </SendIcon>
            {/* </Link> */}
          </CategoryAddContainer>
        )}
      </Mutation>
    );
  }
}

export default graphql(CATEGORY, {
  options: props => ({
    variables: { categoryId: props.match.params.categoryId }
  })
})(CategoryEdit);
