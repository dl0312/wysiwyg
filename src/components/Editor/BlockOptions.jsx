import React, { Component } from "react";
import styled from "styled-components";
import SketchExample from "./SketchExample";
import ImagePopup from "../../utility/ImagePopup";
import { CATEGORIES } from "../../queries";
import Wiki from "./MiniWiki";

const BlockOptionContainer = styled.div`
  position: absolute;
  top: ${props => (props.isSelected ? "45px" : "900px")};
  bottom: 0px;
  right: 0px;
  width: 25%;
  min-width: 400px;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  color: #505659;
  transition: top 0.5s ease, opacity 0.5s ease, height 0.5s ease;
  opacity: ${props => (props.isSelected ? "1" : "0")};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  height: 45px;
  box-shadow: 0px 1px 5px #888;
`;

const ButtonTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
`;

const ButtonColumn = styled.div`
  display: flex;
  flex-direction: row;
`;

const Button = styled.button`
  font-size: 16px;
  width: 35px;
  border: none;
  border-left: 1px solid #e6e6e6;
  background-color: #fff;
  height: 45px;
`;

const OptionRows = styled.div`
  padding-top: 5px;
`;

const Option = styled.div``;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: rgb(234, 234, 234);
`;

const OptionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: rgb(81, 97, 103);
`;

const MinimizeButton = styled.button`
  border: none;
  background-color: transparent;
`;

const FeatureColumn = styled.div`
  padding: 0 20px;
  font-size: 12px;
`;

const FunctionTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
`;

const FunctionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f9699;
  font-weight: 600;
`;

const UrlColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const ImageSrc = Input.extend`
  height: 33px;
`;

const UrlColumnInput = Input.extend`
  height: 33px;
  border-top-right-radius: ${props => (props.hasRightButton ? 0 : null)};
  border-bottom-right-radius: ${props => (props.hasRightButton ? 0 : null)};
`;

const HtmlInput = styled.textarea`
  width: 100%;
  border: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  height: 250px;
  &:focus {
    outline: none;
  }
`;

const FunctionColumn = styled.div`
  display: flex;
  flex-direction: ${props => props.dir};
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: ${props => (props.isLast ? null : "1px solid #cacaca")};
`;

const ActionColumn = styled.div``;

const Align = styled.button`
  background-color: #fff;
  border: none;
  padding: 5px 7px;
  margin-right: 5px;
  border-radius: 3px;
  color: #505659;
  cursor: pointer;
  transition: opacity 0.5s ease;
  opacity: ${props => (props.isSelected ? "1" : "0.2")};
  border: 0.5px solid #8f9699;
  &:hover {
    opacity: ${props => (props.isSelected ? null : "0.5")};
  }
  &:focus {
    outline: none;
  }
`;

const ToggleContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
`;

const Toggle = styled.input`
  display: none;
  &:focus + .slider-round {
    box-shadow: 0 0 1px #2196f3;
  }
  &:checked + .slider-round:before {
    -webkit-transform: translateX(18px);
    -ms-transform: translateX(18px);
    transform: translateX(18px);
  }
`;

const ToggleRound = styled.span`
  border-radius: 34px;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  background-color: ${props => (props.fullWidth ? "#2196f3" : null)};
  box-shadow: ${props => (props.fullWidth ? "0 0 1px #2196f3" : null)};

  &::before {
    -webkit-transform: ${props =>
      props.fullWidth ? "#translateX(18px)" : null};
    -ms-transform: ${props => (props.fullWidth ? "translateX(18px)" : null)};
    transform: ${props => (props.fullWidth ? "translateX(18px)" : null)};
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    left: 4px;
    bottom: 2.6px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const SearchButton = styled.button`
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 33px;
  width: 35px;
  transition: font-size 0.2s ease, box-shadow 0.2s ease;
  background-color: white;
  border: 1px solid #ced4da;
  border-left: none;
  &:hover {
    font-size: 14px;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  }
`;

class BlockOptions extends Component {
  showOptions = () => {
    const {
      selectedIndex,
      selectedContent,
      handleOnChange,
      OnChangeCards
    } = this.props;
    if (selectedIndex.length === 2 || selectedIndex.length === 3) {
      switch (selectedContent.content) {
        case "BUTTON":
          return (
            <OptionRows>
              <Option>
                <OptionHeader>
                  <OptionTitle>BUTTON</OptionTitle>
                  <MinimizeButton>
                    <i className="fas fa-angle-up" />
                  </MinimizeButton>
                </OptionHeader>
                <FeatureColumn>
                  <FunctionColumn dir={"column"}>
                    <FunctionTitleContainer>
                      <FunctionTitle>Button Link</FunctionTitle>
                    </FunctionTitleContainer>
                    <UrlColumn>
                      <UrlColumnInput
                        type="text"
                        value={selectedContent.link}
                        onChange={e =>
                          handleOnChange(
                            e.target.value,
                            selectedIndex,
                            "BUTTON",
                            "LINK"
                          )
                        }
                      />
                    </UrlColumn>
                  </FunctionColumn>
                  {/* <FunctionColumn>
                    <FunctionTitle>Text Color</FunctionTitle>
                    <SketchExample
                      OnChangeCards={OnChangeCards}
                      selectedIndex={selectedIndex}
                      type="textColor"
                      color={selectedContent.textColor}
                    />
                  </FunctionColumn> */}
                  <FunctionColumn>
                    <FunctionTitle>Background Color</FunctionTitle>
                    <SketchExample
                      OnChangeCards={OnChangeCards}
                      selectedIndex={selectedIndex}
                      type="backgroundColor"
                      color={selectedContent.backgroundColor}
                    />
                  </FunctionColumn>
                  <FunctionColumn>
                    <FunctionTitle>Hover Color</FunctionTitle>
                    <SketchExample
                      OnChangeCards={OnChangeCards}
                      selectedIndex={selectedIndex}
                      type="hoverColor"
                      color={selectedContent.hoverColor}
                    />
                  </FunctionColumn>
                  <FunctionColumn>
                    <FunctionTitle>Alignments</FunctionTitle>
                    <ActionColumn>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-start")
                        }
                        isSelected={selectedContent.align === "flex-start"}
                      >
                        <i className="fas fa-align-left" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "center")
                        }
                        isSelected={
                          selectedContent.align === "center" ||
                          selectedContent.align === undefined
                        }
                      >
                        <i className="fas fa-align-center" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-end")
                        }
                        isSelected={selectedContent.align === "flex-end"}
                      >
                        <i className="fas fa-align-right" />
                      </Align>
                    </ActionColumn>
                  </FunctionColumn>
                  <FunctionColumn isLast={true}>
                    <FunctionTitle>Text Alignments</FunctionTitle>
                    <ActionColumn>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "textAlign", "left")
                        }
                        isSelected={selectedContent.textAlign === "left"}
                      >
                        <i className="fas fa-align-left" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "textAlign", "center")
                        }
                        isSelected={
                          selectedContent.textAlign === "center" ||
                          selectedContent.textAlign === undefined
                        }
                      >
                        <i className="fas fa-align-center" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "textAlign", "right")
                        }
                        isSelected={selectedContent.textAlign === "right"}
                      >
                        <i className="fas fa-align-right" />
                      </Align>
                    </ActionColumn>
                  </FunctionColumn>
                </FeatureColumn>
              </Option>
            </OptionRows>
          );
        case "HTML":
          return (
            <OptionRows>
              <Option>
                <OptionHeader>
                  <OptionTitle>HTML</OptionTitle>
                  <MinimizeButton>
                    <i className="fas fa-angle-up" />
                  </MinimizeButton>
                </OptionHeader>
                <FeatureColumn>
                  <FunctionColumn isLast={true} dir={"column"}>
                    <FunctionTitleContainer>
                      <FunctionTitle>Html Code</FunctionTitle>
                    </FunctionTitleContainer>
                    <UrlColumn>
                      <HtmlInput
                        style={{ height: "250px" }}
                        type="text"
                        value={selectedContent.link}
                        onChange={e =>
                          handleOnChange(
                            e.target.value,
                            selectedIndex,
                            "HTML",
                            "CODE"
                          )
                        }
                      />
                    </UrlColumn>
                  </FunctionColumn>
                </FeatureColumn>
              </Option>
            </OptionRows>
          );
        case "TEXT":
          return (
            <OptionRows>
              <Option>
                <OptionHeader>
                  <OptionTitle>TEXT</OptionTitle>
                  <MinimizeButton>
                    <i className="fas fa-angle-up" />
                  </MinimizeButton>
                </OptionHeader>
                <FeatureColumn>
                  {/* <FunctionColumn>
                    <FunctionTitle>Text Color</FunctionTitle>
                    <SketchExample
                      OnChangeCards={OnChangeCards}
                      selectedIndex={selectedIndex}
                      type="textColor"
                      color={selectedContent.textColor}
                    />
                  </FunctionColumn> */}
                  {/* <FunctionColumn>
                    <FunctionTitle>Background Color</FunctionTitle>
                    <SketchExample
                      masterCallback={this.props.masterCallback}
                      type="Background"
                      color={selectedContent.backgroundColor}
                    />
                  </FunctionColumn> */}
                  <FunctionColumn>
                    <FunctionTitle>Alignments</FunctionTitle>
                    <ActionColumn>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-start")
                        }
                        isSelected={selectedContent.align === "flex-start"}
                      >
                        <i className="fas fa-align-left" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "center")
                        }
                        isSelected={
                          selectedContent.align === "center" ||
                          selectedContent.align === undefined
                        }
                      >
                        <i className="fas fa-align-center" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-end")
                        }
                        isSelected={selectedContent.align === "flex-end"}
                      >
                        <i className="fas fa-align-right" />
                      </Align>
                    </ActionColumn>
                  </FunctionColumn>
                  <FunctionColumn>
                    <FunctionTitle>Text Alignments</FunctionTitle>
                    <ActionColumn>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "textAlign", "left")
                        }
                        isSelected={
                          selectedContent.textAlign === "left" ||
                          selectedContent.textAlign === undefined
                        }
                      >
                        <i className="fas fa-align-left" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "textAlign", "center")
                        }
                        isSelected={selectedContent.textAlign === "center"}
                      >
                        <i className="fas fa-align-center" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "textAlign", "right")
                        }
                        isSelected={selectedContent.textAlign === "right"}
                      >
                        <i className="fas fa-align-right" />
                      </Align>
                    </ActionColumn>
                  </FunctionColumn>
                  <Wiki
                    handleOnChange={handleOnChange}
                    selectedIndex={selectedIndex}
                    selectedContent={selectedContent}
                  />
                  {/* <FunctionColumn dir={"column"} isLast={true}>
                    <FunctionTitleContainer>
                      <FunctionTitle>Wiki Search</FunctionTitle>
                    </FunctionTitleContainer>
                    <UrlColumn>
                      <UrlColumnInput
                        type="text"
                        value={selectedContent.link}
                        onChange={e =>
                          handleOnChange(
                            e.target.value,
                            selectedIndex,
                            "BUTTON",
                            "LINK"
                          )
                        }
                        hasRightButton="true"
                      />
                      <SearchButton>
                        <i className="fas fa-search" />
                      </SearchButton>
                    </UrlColumn>
                  </FunctionColumn> */}
                </FeatureColumn>
              </Option>
            </OptionRows>
          );
        case "IMAGE":
          console.log(selectedContent.align);
          return (
            <OptionRows>
              <Option>
                <OptionHeader>
                  <OptionTitle>IMAGE</OptionTitle>
                  <MinimizeButton>
                    <i className="fas fa-angle-up" />
                  </MinimizeButton>
                </OptionHeader>
                <FeatureColumn>
                  <FunctionColumn dir={"column"}>
                    <FunctionTitleContainer>
                      <FunctionTitle>Image URL</FunctionTitle>
                    </FunctionTitleContainer>
                    <UrlColumn>
                      <ImageSrc
                        type="text"
                        value={selectedContent.imageSrc}
                        onChange={e =>
                          handleOnChange(
                            e.target.value,
                            selectedIndex,
                            "IMAGE",
                            "URL"
                          )
                        }
                      />
                    </UrlColumn>
                  </FunctionColumn>
                  <FunctionColumn>
                    <FunctionTitle>Alignments</FunctionTitle>
                    <ActionColumn>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-start")
                        }
                        isSelected={selectedContent.align === "flex-start"}
                      >
                        <i className="fas fa-align-left" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "center")
                        }
                        isSelected={
                          selectedContent.align === "center" ||
                          selectedContent.align === undefined
                        }
                      >
                        <i className="fas fa-align-center" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-end")
                        }
                        isSelected={selectedContent.align === "flex-end"}
                      >
                        <i className="fas fa-align-right" />
                      </Align>
                    </ActionColumn>
                  </FunctionColumn>
                  <FunctionColumn>
                    <FunctionTitle>Full Width</FunctionTitle>
                    <ActionColumn>
                      <ToggleContainer>
                        <Toggle
                          onClick={() =>
                            OnChangeCards(selectedIndex, "fullWidth", "toggle")
                          }
                          type="checkbox"
                        />
                        <ToggleRound fullWidth={selectedContent.fullWidth} />
                      </ToggleContainer>
                    </ActionColumn>
                  </FunctionColumn>
                  <FunctionColumn dir={"column"}>
                    <FunctionTitleContainer>
                      <FunctionTitle>Alternate Text</FunctionTitle>
                    </FunctionTitleContainer>
                    <UrlColumn>
                      <UrlColumnInput
                        style={{ borderRadius: "5px" }}
                        type="text"
                        value={selectedContent.alt}
                        onChange={e =>
                          handleOnChange(
                            e.target.value,
                            selectedIndex,
                            "IMAGE",
                            "ALT"
                          )
                        }
                      />
                    </UrlColumn>
                  </FunctionColumn>
                  <FunctionColumn dir={"column"} isLast={"true"}>
                    <FunctionTitleContainer>
                      <FunctionTitle>Image Link</FunctionTitle>
                    </FunctionTitleContainer>
                    <UrlColumn>
                      {/* <button className={styles.btn}>URL</button> */}
                      <UrlColumnInput
                        type="text"
                        value={selectedContent.link}
                        onChange={e =>
                          handleOnChange(
                            e.target.value,
                            selectedIndex,
                            "IMAGE",
                            "LINK"
                          )
                        }
                      />
                    </UrlColumn>
                  </FunctionColumn>
                </FeatureColumn>
              </Option>
            </OptionRows>
          );
        case "VIDEO":
          return (
            <OptionRows>
              <Option>
                <OptionHeader>
                  <OptionTitle>VIDEO</OptionTitle>
                  <MinimizeButton>
                    <i className="fas fa-angle-up" />
                  </MinimizeButton>
                </OptionHeader>
                <FeatureColumn>
                  <FunctionColumn dir={"column"}>
                    <FunctionTitleContainer>
                      <FunctionTitle>Video URL</FunctionTitle>
                    </FunctionTitleContainer>
                    <UrlColumn>
                      {/* <button className={styles.btn}>URL</button> */}
                      <UrlColumnInput
                        type="text"
                        value={selectedContent.videoSrc}
                        onChange={e =>
                          handleOnChange(
                            e.target.value,
                            selectedIndex,
                            "VIDEO",
                            "URL"
                          )
                        }
                      />
                    </UrlColumn>
                  </FunctionColumn>
                  <FunctionColumn>
                    <FunctionTitle>Alignments</FunctionTitle>
                    <ActionColumn>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-start")
                        }
                        isSelected={selectedContent.align === "flex-start"}
                      >
                        <i className="fas fa-align-left" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "center")
                        }
                        isSelected={
                          selectedContent.align === "center" ||
                          selectedContent.align === undefined
                        }
                      >
                        <i className="fas fa-align-center" />
                      </Align>
                      <Align
                        onClick={() =>
                          OnChangeCards(selectedIndex, "align", "flex-end")
                        }
                        isSelected={selectedContent.align === "flex-end"}
                      >
                        <i className="fas fa-align-right" />
                      </Align>
                    </ActionColumn>
                  </FunctionColumn>
                </FeatureColumn>
              </Option>
            </OptionRows>
          );
        default:
          return null;
      }
    }
  };

  render() {
    return (
      <BlockOptionContainer
        isSelected={
          // this.props.selectedContent !== null ||
          this.props.selectedContent !== undefined
        }
      >
        <Header>
          <ButtonTitle>CONTENT</ButtonTitle>
          <ButtonColumn>
            <Button>
              <i className="fas fa-trash-alt" />
            </Button>
            <Button>
              <i className="fas fa-copy" />
            </Button>
            <Button>
              <i className="fas fa-angle-down" />
            </Button>
          </ButtonColumn>
        </Header>
        {this.props.selectedContent ? this.showOptions() : null}
      </BlockOptionContainer>
    );
  }
}

export default BlockOptions;
