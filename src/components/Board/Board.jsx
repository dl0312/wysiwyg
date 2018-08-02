import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import db from "../Editor/db";

const BoardContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  font-family: "Open Sans", sans-serif;
  background-color: white;
`;

const TH = styled.th`
  border: 2px solid black;
  vertical-align: middle;
  text-align: center;
  border-radius: 3px;
  background-color: white;
`;

const TD = styled.td`
  border: 1px solid black;
  vertical-align: middle;
  text-align: center;
  border-radius: 3px;
  background-color: white;
`;

const BoardBox = styled.div`
  width: 700px;
  max-width: 960px;
`;

const CategoryImg = styled.img`
  width: 100%;
  display: block;
`;

const Table = styled.table`
  width: 100%;
  display: grid;
  grid-gap: 2px;
  grid-template-rows: 60px;
`;

const TableRow = styled.tr`
  display: grid;
  grid-template-columns: 60px auto 120px;
  grid-gap: 2px;
`;

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
  font-size: 12px;
  margin: 0 5px;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  color: white;
  font-size: 15px;
  float: left;
  width: 100%;
  font-weight: bolder;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #63748f;
  padding-bottom: 5px;
  display: flex;
  justify-content: flex-start;
`;

const SubTitle = styled.div`
  color: #63748f;
  font-size: 11px;
  line-height: 1em;
  float: left;
  width: 100%;
`;

const TitleRow = TD.extend`
  text-align: left;
  padding: 10px 10px;
  vertical-align: top;
`;
const CountRow = TD.extend`
  width: 120px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CountTitle = styled.div`
  font-size: 10px;
`;

const Indicator = styled.div`
  width: 100px;
  border: 2px solid grey;
  height: 15px;
  border-radius: 5px;
  margin: 5px 0;
  align-items: center;
`;

const FlexBox = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <BoardContainer>
        <BoardBox>
          <Table>
            {db.Posts.map((post, index) => (
              <TableRow>
                <CategoryData>
                  <CategoryImg
                    src={post.category.img}
                    alt={post.category.name}
                  />
                </CategoryData>
                <TitleRow>
                  <Title>
                    <Link
                      to={`/read/${index}`}
                      style={{ textDecoration: "none" }}
                    >
                      {post.title}
                    </Link>
                    <Comment>[{post.comment_count}]</Comment>
                  </Title>
                  <SubTitle>
                    Guide by {post.username} updated {post.time}
                  </SubTitle>
                </TitleRow>
                <CountRow>
                  <FlexBox>
                    <CountTitle>CLAPS: {post.clap_count}</CountTitle>
                    <Indicator />
                    <CountTitle>VIEWS: {post.view}</CountTitle>
                  </FlexBox>
                </CountRow>
              </TableRow>
            ))}
          </Table>
        </BoardBox>
      </BoardContainer>
    );

    // <BoardContainer>
    //   <BoardBox>
    //     <Table>
    //       <TableRow>
    //         <CategoryHeader>CATEGORY</CategoryHeader>
    //         <TitleHeader>TITLE</TitleHeader>
    //         <CreatorHeader>CREATOR</CreatorHeader>
    //         <ClapHeader>CLAP</ClapHeader>
    //         <DateHeader>DATE</DateHeader>
    //       </TableRow>
    //       {this.state.posts.map(post => (
    //         <TableRow>
    //           <CategoryData>
    //             <CategoryImg
    //               src={post.category.img}
    //               alt={post.category.name}
    //             />
    //           </CategoryData>
    //           <TitleData>
    //             {post.title} <Comment>[{post.comment_count}]</Comment>
    //           </TitleData>
    //           <CreatorData>{post.username}</CreatorData>
    //           <ClapData>{post.clap_count}</ClapData>
    //           <DateData>{post.time}</DateData>
    //         </TableRow>
    //       ))}
    //     </Table>
    //   </BoardBox>
    // </BoardContainer>
  }
}

export default Board;
