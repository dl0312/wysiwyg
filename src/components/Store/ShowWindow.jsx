import React from "react";
import styled from "styled-components";

const ShowWindowGridBox = styled.div`
  width: 960px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 15px;
  padding: 15px;
`;

const ProductContainer = styled.div`
  font-family: "Nanum Gothic", sans-serif;
`;
const ImgCropper = styled.div`
  height: 250px;
  width: 250px;
  overflow: hidden;
`;
const ProductImg = styled.img`
  width: ${props => (props.isSquare ? "250px" : "400px")};
  margin-left: ${props => (props.isSquare ? null : "-100px")};
`;
const ProductCategory = styled.div``;
const ProductPrice = styled.div``;
const ProductName = styled.div``;

class ShowWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        {
          name: "펄스 건 이즈리얼",
          price: 100,
          category: ["LOL", "스킨"],
          src: "https://i.ytimg.com/vi/XVMvQBg4Ywg/maxresdefault.jpg",
          isSquare: false
        },
        {
          name: "죽음의 사도 신드라",
          price: 100,
          category: ["LOL", "스킨"],
          src:
            "https://steemitimages.com/DQmduzyEfQQr8tQmt6DDBUisir27TNh4555ta3KT9QunfzN/22538870_2097329293618917_5899395857112380266_o%20(1).jpg",
          isSquare: false
        },
        {
          name: "마법공학 애니",
          price: 100,
          category: ["LOL", "스킨"],
          src: "http://cfile220.uf.daum.net/image/222D013556D79B770CE163",
          isSquare: false
        },
        {
          name: "슈퍼갤럭시 니달리",
          price: 100,
          category: ["LOL", "스킨"],
          src:
            "http://images.kbench.com:8080/kbench/article/2017_10/k182606p1n1.jpg",
          isSquare: false
        },
        {
          name: "PUBG ROOTING BOX",
          price: 50,
          category: ["PUBG", "ROOTING BOX"],
          src: "https://pubgshowcase.com/img/crates/biker-crate.png",
          isSquare: true
        }
      ]
    };
  }

  render() {
    const { products } = this.state;
    return (
      // products.map((product,index)=> {
      //     return

      // }
      <React.Fragment>
        <ShowWindowGridBox>
          {products.map((product, index) => {
            return (
              <ProductContainer>
                <ImgCropper>
                  <ProductImg
                    isSquare={product.isSquare}
                    src={product.src}
                    alt={product.name}
                  />
                </ImgCropper>
                <ProductCategory>{product.category}</ProductCategory>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price} CP</ProductPrice>
              </ProductContainer>
            );
          })}
        </ShowWindowGridBox>
      </React.Fragment>
    );
  }
}

export default ShowWindow;
