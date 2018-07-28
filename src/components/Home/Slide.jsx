import React from "react";
import styled from "styled-components";

class Slide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideNum: 1,
      slides: [
        {
          title: "league of legend",
          src:
            "http://news.cdn.leagueoflegends.com/public/images/misc/Background.jpg"
        },
        {
          title: "world of warcraft",
          src:
            "https://mms.businesswire.com/media/20160908005460/en/543308/5/WorldofWarcraftLegion_Illidan_Art.jpg?download=1"
        },
        {
          title: "pubg",
          src:
            "https://cdn-www.bluestacks.com/bs-images/battle-ground_banner.jpg"
        },
        {
          title: "onmyoji",
          src: "https://pbs.twimg.com/media/DM-oPseUEAIglCP.jpg"
        },
        {
          title: "tera m",
          src:
            "http://www.gameinsight.co.kr/news/photo/201711/14730_24283_254.jpg"
        }
      ]
    };
  }

  componentDidMount() {
    setInterval(() => this.imgChange("arrow", 1), 5000);
  }

  imgChange = (type, imgNum) => {
    console.log(type);
    const MAX_SLIDE_IMAGE = this.state.slides.length;
    if (type === "dot") {
      this.setState({ slideNum: imgNum });
    } else if (type === "arrow") {
      if (imgNum === -1) {
        if (this.state.slideNum - 1 === -1) {
          this.setState({ slideNum: MAX_SLIDE_IMAGE - 1 });
        } else {
          this.setState({ slideNum: this.state.slideNum - 1 });
        }
      } else if (imgNum === 1) {
        if (this.state.slideNum + 1 === MAX_SLIDE_IMAGE) {
          this.setState({ slideNum: 0 });
        } else {
          this.setState({ slideNum: this.state.slideNum + 1 });
        }
      }
    }
  };

  render() {
    const { slideNum, slides } = this.state;
    return (
      <React.Fragment>
        <SlideContainer>
          {slides.map((slide, index) => {
            return (
              <div>
                <SlideImage
                  src={slide.src}
                  alt={slide.title}
                  isSelect={slideNum === index ? true : false}
                />
                <SlideText isSelect={slideNum === index ? true : false}>
                  {slide.title}
                </SlideText>
              </div>
            );
          })}
          <SlideButton onClick={() => this.imgChange("arrow", -1)} dir="left">
            <i className="fas fa-chevron-circle-left" />
          </SlideButton>
          <SlideButton onClick={() => this.imgChange("arrow", 1)} dir="right">
            <i className="fas fa-chevron-circle-right" />
          </SlideButton>
          <DotIndex className="w3-display-bottommiddle">
            {slides.map((slide, index) => {
              return (
                <Dot
                  onClick={() => this.imgChange("dot", index)}
                  isSelect={slideNum === index ? true : false}
                />
              );
            })}
          </DotIndex>
        </SlideContainer>
      </React.Fragment>
    );
  }
}

const SlideContainer = styled.div`
  width: 100%;
  height: 800px;
  position: relative;
  z-index: 1;
  top: 0px;
  overflow: hidden;
`;

const SlideImage = styled.img`
  width: 1920px;
  position: absolute;
  z-index: 1;
  top: 0px;
  filter: brightness(50%);
  transition: opacity 1s ease;
  opacity: ${props => (props.isSelect ? "1" : "0")};
  animation-duration: 30s;
  animation-name: animation;
  animation-iteration-count: infinite;
  @keyframes animation {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const SlideText = styled.div`
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: ${props => (props.isSelect ? "1" : "0")};
  font-size: 30px;
  font-weight: 100;
  border: 1px solid white;
  text-transform: uppercase;
  padding: 10px;
  color: white;
`;

const SlideButton = styled.button`
  color: white;
  padding: 10px;
  position: absolute;
  z-index: 2;
  border: none;
  background-color: transparent;
  font-size: 25px;
  left: ${props => (props.dir === "left" ? "0px" : null)};
  right: ${props => (props.dir === "right" ? "0px" : null)};
  transition: opacity 0.5s ease;
  opacity: 0.5;
  top: 45%;
  outline: none;
  &:hover {
    opacity: 1;
  }
`;

const DotIndex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 100px;
  z-index: 2;
  bottom: 350px;
`;

const Dot = styled.button`
  border-radius: 100%;
  width: 13px;
  height: 13px;
  border: 1px solid white;
  transition: background-color 0.5s ease;
  background-color: ${props => (props.isSelect ? "white" : "transparent")};
  outline: none;

  &:hover {
    background-color: white;
  }
`;

export default Slide;
