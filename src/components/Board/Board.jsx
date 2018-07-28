import React, { Component } from "react";
import styled from "styled-components";

const BoardContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
  font-family: "Open Sans", sans-serif;
`;

const TH = styled.th`
  border: 1px solid black;
  vertical-align: middle;
  text-align: center;
`;

const TD = styled.td`
  border: 1px solid black;
  vertical-align: middle;
  text-align: center;
`;

const BoardBox = styled.div`
  width: 960px;
  max-width: 960px;
  border-radius: 3px;
  border: 1px solid #8a0808;
`;

const CategoryImg = styled.img`
  width: 100%;
  display: block;
`;

const Table = styled.table`
  width: 100%;
  border: 1px solid black;
`;

const TableRow = styled.tr``;

const CategoryHeader = TH.extend`
  width: 60px;
`;

const CategoryData = TD.extend`
  width: 60px;
`;

const TitleHeader = TH.extend`
  width: 500px;
`;

const TitleData = TD.extend`
  width: 500px;
`;

const CreatorHeader = TH.extend`
  width: 70px;
`;

const CreatorData = TD.extend`
  width: 70px;
`;

const ClapHeader = TH.extend`
  width: 70px;
`;

const ClapData = TD.extend`
  width: 70px;
`;

const DateHeader = TH.extend`
  width: 100px;
`;

const DateData = TD.extend`
  width: 100px;
`;

const Comment = styled.span`
  color: #e74c3c;
`;

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [
        {
          category: {
            name: "JAX",
            img: "https://www.mobafire.com/images/avatars/jax-classic.png"
          },
          title: "How to kill Darius",
          username: "Gun",
          clap_count: 3,
          comment_count: 3,
          time: "2018.07.29"
        },
        {
          category: {
            name: "AHRI",
            img: "https://www.mobafire.com/images/avatars/ahri-midnight.png"
          },
          title: "How to kill Darius",
          username: "Gun",
          clap_count: 3,
          comment_count: 3,
          time: "2018.07.29"
        },
        {
          category: {
            name: "JAX",
            img: "https://www.mobafire.com/images/avatars/jax-classic.png"
          },
          title: "How to kill Darius",
          username: "Gun",
          clap_count: 3,
          comment_count: 3,
          time: "2018.07.29"
        },
        {
          category: {
            name: "JAX",
            img: "https://www.mobafire.com/images/avatars/jax-classic.png"
          },
          title: "How to kill Darius",
          username: "Gun",
          clap_count: 3,
          comment_count: 3,
          time: "2018.07.29"
        }
      ]
    };
  }
  render() {
    return (
      <BoardContainer>
        <BoardBox>
          <Table>
            <TableRow>
              <CategoryHeader>CATEGORY</CategoryHeader>
              <TitleHeader>TITLE</TitleHeader>
              <CreatorHeader>CREATOR</CreatorHeader>
              <ClapHeader>CLAP</ClapHeader>
              <DateHeader>DATE</DateHeader>
            </TableRow>
            {this.state.posts.map(post => (
              <TableRow>
                <CategoryData>
                  <CategoryImg
                    src={post.category.img}
                    alt={post.category.name}
                  />
                </CategoryData>
                <TitleData>
                  {post.title} <Comment>[{post.comment_count}]</Comment>
                </TitleData>
                <CreatorData>{post.username}</CreatorData>
                <ClapData>{post.clap_count}</ClapData>
                <DateData>{post.time}</DateData>
              </TableRow>
            ))}
          </Table>
        </BoardBox>
      </BoardContainer>
    );
  }
}

export default Board;
