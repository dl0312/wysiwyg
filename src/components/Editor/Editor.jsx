import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";
import { DragDropContext } from "react-dnd";
import HTML5Backend, { NativeTypes } from "react-dnd-html5-backend";
import Card from "./Card";
import Column from "./Column";
import { Button } from "./Components";
import db from "./db";
import styled from "styled-components";
import EditorDefaults from "./EditorDefaults";
import JsonView from "./JsonView";
import UserView from "./UserView";
import BlockOptions from "./BlockOptions";
import { media } from "../../config/_mixin";
import imageExtensions from "image-extensions";
import ImagePopup from "../../utility/ImagePopup";
import Pos from "../../utility/Pos";
import { Value } from "slate";
import isUrl from "is-url";
import { resetKeyGenerator } from "slate";
import { getEventRange, getEventTransfer } from "slate-react";
import _ from "lodash";
import EmptyCard from "./EmptyCard";
import SketchExample from "./SketchExample";

const update = require("immutability-helper");
const DEFAULT_NODE = "paragraph";
const DEFAULT_POST = 0;
const EditorContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  /* min-width: $max-page-width; */
  overflow: hidden;
  position: absolute;
  top: 100px;
  bottom: 0px;
  right: 0;
  left: 0;

  border-top: 2px solid #eee;
`;

const EditorLeftContainer = styled.div`
  position: relative;
  width: 75%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${props =>
    `rgba(${props.color.r}, ${props.color.g}, ${props.color.b}, ${
      props.color.a
    })`};
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  transition: width 0.5s ease;
  ${media.tablet`width: 100%;`};
  ${media.phone`width: 100%;`};
`;

const TextEditor = styled.div`
  border-bottom: 2px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease;
  background-color: white;
  margin-top: 1px;
  position: absolute;
  right: 0px;
  left: 0px;
  z-index: 200;
  opacity: ${props => props.opacity};
`;

const EditorRightContainer = styled.div`
  outline: 0.05px solid rgb(172, 172, 172);
  transition: width 1s ease;
  width: 25%;
  min-width: 400px;
  ${media.tablet`display: none;`};
  ${media.phone`display: none;`};
`;

function isImage(url) {
  return !!imageExtensions.find(url.endsWith);
}

const Image = styled.img`
  width: ${props => (props.small ? "20px" : null)};
  margin-left: ${props => (props.small ? "2px" : null)};
  margin-right: ${props => (props.small ? "2px" : null)};
  max-width: 100%;
  max-height: 20em;
  margin-bottom: ${props => (props.small ? "-4px" : null)};
  box-shadow: ${props => (props.selected ? "0 0 0 2px blue;" : "none")};
`;

const ClapImageContainer = styled.span`
  margin-left: ${props => (props.small ? "2px" : null)};
  margin-right: ${props => (props.small ? "2px" : null)};
  cursor: pointer;
`;

const ClapImageText = styled.span`
  font-weight: bolder;
  color: ${props => props.color};
`;

const MarkListContainer = styled.ul`
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  top: 42.5px;
  background-color: white;
  margin-left: ${props => (props.type === "font-size" ? "-25px" : "-10px")};
  border: ${props =>
    props.isActive ? "1px solid #eee" : "1px solid transparent"};
  overflow: hidden;
  transition: height 0.5s ease, border 0.5s ease;
  height: ${props =>
    props.isActive ? (props.type === "font-size" ? "150px" : "80px") : "0px"};
  color: black;
`;

const Icon = styled.div`
  font-size: 15px;
  letter-spacing: -1px;
  width: ${props => (props.type === "font-family" ? "90px" : null)};
  vertical-align: text-bottom;
`;

const MarkListItem = styled.li`
  list-style: none;
  padding: 5px 10px;
  color: ${props => (props.active ? "black" : null)};
  letter-spacing: -1px;
`;

class Editor extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func,
    greedy: PropTypes.bool,
    children: PropTypes.node
  };
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      rightMenu: null,
      view: EditorDefaults.VIEW,
      color: EditorDefaults.BACKGROUND_COLOR,
      contentWidth: EditorDefaults.WIDTH,
      font: null,
      OnDrag: null,
      hasDropped: false,
      hasDroppedOnChild: false,
      contentHover: false,
      selectedIndex: null,
      hoveredIndex: null,
      selectedContent: null,
      hoverImgJson: null,
      onImage: false,
      fontStylePopUp: false,
      pos: new Pos(0, 0),
      title: db.Posts[DEFAULT_POST].title,
      cards: db.Posts[DEFAULT_POST].cards
    };
  }

  getPos = e => {
    const pos = new Pos(e.clientX, e.clientY - 100);
    console.log(pos);
    this.setState({ pos });
  };

  buttonCallback = (type, dataFromChild) => {
    const { cards, hoveredIndex, selectedIndex } = this.state;
    if (type === "mouseover") {
      this.setState({ hoveredIndex: dataFromChild });
    } else if (type === "mouseleave") {
      if (hoveredIndex === dataFromChild) {
        this.setState({ hoveredIndex: null });
      }
    } else if (type === "select") {
      if (selectedIndex !== null) {
        if (
          (!Array.isArray(selectedIndex) && selectedIndex === dataFromChild) ||
          (Array.isArray(selectedIndex) &&
            (selectedIndex.length === dataFromChild.length &&
              selectedIndex.every((v, i) => v === dataFromChild[i])))
        ) {
        } else {
          this.setState({
            selectedIndex: undefined,
            selectedContent: undefined,
            rightMenu: null
          });
          this.setState({
            selectedIndex: dataFromChild,
            selectedContent: this.showSelected(dataFromChild),
            rightMenu: null
          });
        }
      } else {
        this.setState({
          selectedIndex: undefined,
          selectedContent: undefined,
          rightMenu: null
        });
        this.setState({
          selectedIndex: dataFromChild,
          selectedContent: this.showSelected(dataFromChild),
          rightMenu: null
        });
      }
    } else if (type === "delete") {
      if (dataFromChild.length === 3) {
        // block
        this.setState(
          {
            selectedIndex: null,
            selectedContent: null
          },
          this.setState(
            update(this.state, {
              cards: {
                [dataFromChild[0]]: {
                  columnListArray: {
                    [dataFromChild[1]]: {
                      $splice: [[dataFromChild[2], 1]]
                    }
                  }
                }
              }
            })
          )
        );
      } else if (!Array.isArray(dataFromChild)) {
        // frame
        if (selectedIndex === dataFromChild) {
          this.setState({ selectedIndex: null, selectedContent: null });
        }
        this.setState(
          update(this.state, {
            cards: {
              $splice: [[dataFromChild, 1]]
            }
          })
        );
      }
    } else if (type === "duplicate") {
      if (!Array.isArray(dataFromChild)) {
        let targetCard = JSON.parse(JSON.stringify(cards[dataFromChild]));
        this.setState(
          update(this.state, {
            cards: {
              $splice: [[dataFromChild, 0, targetCard]]
            }
          })
        );
      } else {
        let targetCard = JSON.parse(
          JSON.stringify(
            cards[dataFromChild[0]].columnListArray[dataFromChild[1]][
              dataFromChild[2]
            ]
          )
        );
        if (targetCard.content === "BUTTON" || targetCard.content === "TEXT")
          targetCard.value = Value.fromJSON(targetCard.value);
        this.setState(
          update(this.state, {
            cards: {
              [dataFromChild[0]]: {
                columnListArray: {
                  [dataFromChild[1]]: {
                    $splice: [[dataFromChild[2], 0, targetCard]]
                  }
                }
              }
            }
          })
        );
        // this.setState(
        //   update(this.state, {
        //     cards: {
        //       [dataFromChild[0]]: {
        //         columnListArray: {
        //           [dataFromChild[1]]: {
        //             $set: { [dataFromChild[2] + 1]: targetCard }
        //           }
        //         }
        //       }
        //     }
        //   })
        // );
      }
    }
  };

  // 오른쪽 버튼 Drop Here에 놨을 때
  handleDrop = (hoverItem, hoverIndex) => {
    // on column
    if (hoverIndex.length === 3) {
      if (!!hoverItem) {
        if (hoverIndex[2] === -1) {
          hoverIndex[2] = 0;
        }
        this.setState(
          update(this.state, {
            cards: {
              [hoverIndex[0]]: {
                columnListArray: {
                  [hoverIndex[1]]: {
                    $splice: [[hoverIndex[2], 0, hoverItem]]
                  }
                }
              }
            }
          })
        );
      }
    } else if (hoverIndex.length === 2) {
      if (!!hoverItem) {
        this.setState(
          update(this.state, {
            cards: {
              [hoverIndex[0]]: {
                columnListArray: {
                  [hoverIndex[1]]: {
                    $splice: [[0, 0, hoverItem]]
                  }
                }
              }
            }
          })
        );
      }
    } else {
      // on frame
      if (!!hoverItem) {
        this.setState(
          update(this.state, {
            cards: {
              $splice: [[hoverIndex, 0, hoverItem]]
            }
          })
        );
      }
    }
  };

  // 이동
  // block on column -> block on column ([1,2,1] > [3,1,1])
  // frame -> frame (5 > 7)
  moveCard = (dragIndex, hoverIndex) => {
    if (dragIndex.length === 3 && hoverIndex.length === 3) {
      // block => block
      const { cards } = this.state;
      const dragCard =
        cards[dragIndex[0]].columnListArray[dragIndex[1]][dragIndex[2]];
      console.log(dragIndex);
      console.log(hoverIndex);
      this.setState({
        selectedIndex: null,
        selectedContent: null
      });
      if (
        dragIndex[0] === hoverIndex[0] &&
        dragIndex[1] === hoverIndex[1] &&
        dragIndex[2] === hoverIndex[2]
      ) {
      } else {
        if (dragIndex[2] < hoverIndex[2]) {
          this.setState(
            update(this.state, {
              cards: {
                [dragIndex[0]]: {
                  columnListArray: {
                    [dragIndex[1]]: {
                      $splice: [[dragIndex[2], 1]]
                    }
                  }
                }
              }
            })
          );
          this.setState(
            update(this.state, {
              cards: {
                [hoverIndex[0]]: {
                  columnListArray: {
                    [hoverIndex[1]]: {
                      $splice: [[hoverIndex[2] - 1, 0, dragCard]]
                    }
                  }
                }
              }
            })
          );
        } else {
          this.setState(
            update(this.state, {
              cards: {
                [dragIndex[0]]: {
                  columnListArray: {
                    [dragIndex[1]]: {
                      $splice: [[dragIndex[2], 1]]
                    }
                  }
                }
              }
            })
          );
          this.setState(
            update(this.state, {
              cards: {
                [hoverIndex[0]]: {
                  columnListArray: {
                    [hoverIndex[1]]: {
                      $splice: [[hoverIndex[2] + 1, 0, dragCard]]
                    }
                  }
                }
              }
            })
          );
        }
      }
    } else if (dragIndex.length === 3 && hoverIndex.length === 2) {
      // block => block
      const { cards } = this.state;
      const dragCard =
        cards[dragIndex[0]].columnListArray[dragIndex[1]][dragIndex[2]];
      console.log(dragIndex);
      console.log(hoverIndex);
      this.setState({
        selectedIndex: null,
        selectedContent: null
      });
      if (!!dragCard) {
        this.setState(
          update(this.state, {
            cards: {
              [dragIndex[0]]: {
                columnListArray: {
                  [dragIndex[1]]: {
                    $splice: [[dragIndex[2], 1]]
                  }
                }
              }
            }
          })
        );
        this.setState(
          update(this.state, {
            cards: {
              [hoverIndex[0]]: {
                columnListArray: {
                  [hoverIndex[1]]: {
                    $splice: [[0, 0, dragCard]]
                  }
                }
              }
            }
          })
        );
      }
    } else if (!Array.isArray(dragIndex) && !Array.isArray(hoverIndex)) {
      // frame => frame
      const { cards } = this.state;
      const dragCard = cards[dragIndex];
      console.log(dragIndex);
      console.log(hoverIndex);
      this.setState({ selectedIndex: null, selectedContent: null });
      if (dragIndex < hoverIndex) {
        this.setState(
          update(this.state, {
            cards: {
              $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
            }
          })
        );
      } else if (dragIndex > hoverIndex) {
        this.setState(
          update(this.state, {
            cards: {
              $splice: [[dragIndex, 1], [hoverIndex + 1, 0, dragCard]]
            }
          })
        );
      }
    }
  };

  masterCallback = (type, dataFromChild) => {
    console.log(dataFromChild);
    if (type === "BodyBackgroundColor") {
      this.setState({ color: dataFromChild });
    } else if (type === "Title") {
      this.setState({ title: dataFromChild });
    } else if (type === "width") {
      this.setState({ contentWidth: dataFromChild });
    } else if (type === "font") {
      this.setState({ font: dataFromChild });
    } else if (type === "view") {
      this.setState({ view: dataFromChild });
    } else if (type === "OnDrag") {
      this.setState({ OnDrag: dataFromChild });
    } else if (type === "rightMenu") {
      this.setState({
        rightMenu: dataFromChild,
        selectedIndex: null,
        selectedContent: null
      });
    }
  };

  OnChangeCards = (index, props, value) => {
    if (value === "toggle") {
      if (index.length === 2) {
        this.setState(
          update(this.state, {
            cards: {
              [index[0]]: {
                [props]: { $set: !this.state.cards[index[0]][props] }
              }
            }
          })
        );
      } else if (index.length === 3) {
        this.setState(
          update(this.state, {
            cards: {
              [index[0]]: {
                columnListArray: {
                  [index[1]]: {
                    [index[2]]: {
                      [props]: {
                        $set: !this.state.cards[index[0]].columnListArray[
                          index[1]
                        ][index[2]][props]
                      }
                    }
                  }
                }
              }
            }
          })
        );
      }
    } else {
      if (index.length === 2) {
        this.setState(
          update(this.state, {
            cards: { [index[0]]: { [props]: { $set: value } } }
          })
        );
      } else if (index.length === 3) {
        this.setState(
          update(this.state, {
            cards: {
              [index[0]]: {
                columnListArray: {
                  [index[1]]: {
                    [index[2]]: {
                      [props]: { $set: value }
                    }
                  }
                }
              }
            }
          })
        );
      }
    }
  };

  handleOnChange = (value, index, content, type) => {
    if (type === "TEXT_CHANGE") {
      if (index.length === 2) {
        this.setState(
          update(this.state, {
            cards: { [index[0]]: { value: { $set: value.value } } }
          })
        );
      } else if (index.length === 3) {
        this.setState(
          update(this.state, {
            cards: {
              [index[0]]: {
                columnListArray: {
                  [index[1]]: {
                    [index[2]]: {
                      value: { $set: value.value }
                    }
                  }
                }
              }
            }
          })
        );
        // let cards = this.state.cards.slice();
        // cards[index[0]].columnListArray[index[1]][index[2]].value = value;
        // this.setState({ cards });
      }
    } else if (content === "IMAGE") {
      if (type === "URL") {
        if (index.length === 2) {
          this.setState(
            update(this.state, {
              cards: { [index[0]]: { imageSrc: { $set: value } } }
            })
          );
        } else if (index.length === 3) {
          this.setState(
            update(this.state, {
              cards: {
                [index[0]]: {
                  columnListArray: {
                    [index[1]]: {
                      [index[2]]: {
                        imageSrc: { $set: value }
                      }
                    }
                  }
                }
              }
            })
          );
        }
      } else if (type === "ALT") {
        if (index.length === 2) {
          this.setState(
            update(this.state, {
              cards: { [index[0]]: { alt: { $set: value } } }
            })
          );
        } else if (index.length === 3) {
          this.setState(
            update(this.state, {
              cards: {
                [index[0]]: {
                  columnListArray: {
                    [index[1]]: {
                      [index[2]]: {
                        alt: { $set: value }
                      }
                    }
                  }
                }
              }
            })
          );
        }
      }
    } else if (type === "LINK") {
      if (index.length === 2) {
        this.setState(
          update(this.state, {
            cards: { [index[0]]: { link: { $set: value } } }
          })
        );
      } else if (index.length === 3) {
        this.setState(
          update(this.state, {
            cards: {
              [index[0]]: {
                columnListArray: {
                  [index[1]]: {
                    [index[2]]: {
                      link: { $set: value }
                    }
                  }
                }
              }
            }
          })
        );
      }
    } else if (content === "VIDEO") {
      if (type === "URL") {
        if (index.length === 2) {
          this.setState(
            update(this.state, {
              cards: { [index[0]]: { videoSrc: { $set: value } } }
            })
          );
        } else if (index.length === 3) {
          this.setState(
            update(this.state, {
              cards: {
                [index[0]]: {
                  columnListArray: {
                    [index[1]]: {
                      [index[2]]: {
                        videoSrc: { $set: value }
                      }
                    }
                  }
                }
              }
            })
          );
        }
      }
    }
  };

  showSelected = index => {
    const { cards } = this.state;
    if (!Array.isArray(index)) {
      return cards[index];
    } else {
      if (index.length === 2) {
        return cards[index[0]];
      } else if (index.length === 3) {
        return cards[index[0]].columnListArray[index[1]][index[2]];
      }
    }
  };

  render() {
    const {
      cards,
      selectedIndex,
      hoveredIndex,
      contentWidth,
      view,
      pos,
      hoverImgJson,
      onImage
    } = this.state;

    return (
      <Fragment>
        <EditorContainer>
          <EditorLeftContainer view={view} color={this.state.color}>
            {view === "EDIT" ? (
              <React.Fragment>
                <TextEditor
                  opacity={
                    this.state.selectedContent !== null
                      ? (this.state.selectedContent.content === "TEXT") |
                        (this.state.selectedContent.content === "BUTTON") |
                        (this.state.selectedContent.content === "HTML")
                        ? "1"
                        : "0.5"
                      : "0.5"
                  }
                >
                  {this.renderMarkList(
                    "font-family",
                    this.getMarkData("font-family")
                  )}
                  {this.renderMarkList(
                    "font-size",
                    this.getMarkData("font-size")
                  )}
                  {this.renderMarkList(
                    "font-color",
                    this.getMarkData("font-color")
                  )}
                  {this.renderMarkButton("bold", <i className="fas fa-bold" />)}
                  {this.renderMarkButton(
                    "italic",
                    <i className="fas fa-italic" />
                  )}
                  {this.renderMarkButton(
                    "underlined",
                    <i
                      style={{ transform: "translateY(1px)" }}
                      className="fas fa-underline"
                    />
                  )}
                  {this.renderMarkButton("code", <i className="fas fa-code" />)}
                  {this.renderBlockButton(
                    "block-quote",
                    <i className="fas fa-quote-right" />
                  )}
                  {this.renderBlockButton(
                    "numbered-list",
                    <i className="fas fa-list-ol" />
                  )}
                  {this.renderBlockButton(
                    "bulleted-list",
                    <i className="fas fa-list-ul" />
                  )}
                </TextEditor>
                <EditorLeft
                  color={this.state.color}
                  contentWidth={this.state.contentWidth}
                  font={this.state.font}
                  view="EDIT"
                >
                  {cards.map((item, index) => {
                    if (item.type === "columnList") {
                      return (
                        <Card
                          inColumn={false}
                          cards={this.state.cards.length}
                          key={index}
                          index={index}
                          moveCard={this.moveCard}
                          handleDrop={this.handleDrop}
                          OnDrag={this.state.OnDrag}
                          callbackfromparent={this.buttonCallback}
                          selectedIndex={selectedIndex}
                          hoveredIndex={hoveredIndex}
                          masterCallback={this.masterCallback}
                        >
                          <Column
                            columnArray={item.content}
                            columnListArray={item.columnListArray}
                            index={[index, 0, 0]}
                            callbackfromparent={this.buttonCallback}
                            handleDrop={this.handleDrop}
                            moveCard={this.moveCard}
                            handleOnChange={this.handleOnChange.bind(this)}
                            renderNode={this.renderNode}
                            renderMark={this.renderMark}
                            selectedIndex={selectedIndex}
                            hoveredIndex={hoveredIndex}
                            contentWidth={contentWidth}
                            OnDrag={this.state.OnDrag}
                            masterCallback={this.masterCallback}
                            onDropOrPaste={this.onDropOrPaste}
                          />
                        </Card>
                      );
                    } else {
                      return null;
                    }
                  })}
                  {cards.length !== 0 ? null : (
                    <EmptyCard
                      index={0}
                      masterCallback={this.masterCallback}
                      moveCard={this.moveCard}
                      handleDrop={this.handleDrop}
                      OnDrag={this.state.OnDrag}
                    />
                  )}
                </EditorLeft>
              </React.Fragment>
            ) : view === "USER" ? (
              <UserView
                renderNode={this.renderNode}
                renderMark={this.renderMark}
                json={this.state}
              />
            ) : view === "JSON" ? (
              <JsonView json={this.state} />
            ) : null}
          </EditorLeftContainer>
          <EditorRightContainer>
            <EditorRight
              rightMenu={this.state.rightMenu}
              cards={this.state.cards}
              view={this.state.view}
              title={this.state.title}
              selectedIndex={selectedIndex}
              selectedContent={this.showSelected(selectedIndex)}
              masterCallback={this.masterCallback}
              handleOnChange={this.handleOnChange}
              showSelected={this.showSelected}
              OnChangeCards={this.OnChangeCards}
            />
            <BlockOptions
              handleOnChange={this.handleOnChange}
              selectedIndex={selectedIndex}
              selectedContent={this.showSelected(selectedIndex)}
              showSelected={this.showSelected}
              OnChangeCards={this.OnChangeCards}
              masterCallback={this.masterCallback}
            />
          </EditorRightContainer>
        </EditorContainer>
        <ImagePopup
          pos={pos}
          json={hoverImgJson ? hoverImgJson.slice(1, -1) : null}
          onImage={onImage}
        />
      </Fragment>
    );
  }

  hasMark = type => {
    if (
      this.state.selectedIndex !== null &&
      (this.state.selectedContent.content === "TEXT" ||
        this.state.selectedContent.content === "BUTTON" ||
        this.state.selectedContent.content === "HTML")
    ) {
      const { value } = this.showSelected(this.state.selectedIndex);
      return value.activeMarks.some(mark => mark.type === type);
    }
  };

  getMarkData = type => {
    if (type === "font-size") {
      if (
        this.state.selectedIndex !== null &&
        (this.state.selectedContent.content === "TEXT" ||
          this.state.selectedContent.content === "BUTTON" ||
          this.state.selectedContent.content === "HTML")
      ) {
        const { value } = this.showSelected(this.state.selectedIndex);
        if (value.marks.filter(mark => mark.type === "font-size").first()) {
          const fontSize = value.marks
            .filter(mark => mark.type === "font-size")
            .first()
            .data.get("fontSize");
          switch (fontSize) {
            case 28:
              return "Text1";
            case 19:
              return "Text2";
            case 16:
              return "Text3";
            case 13:
              return "Text4";
            case 11:
              return "Text5";
            default:
              return "Text3";
          }
        } else {
          return "Text3";
        }
      } else {
        return "Text3";
      }
    } else if (type === "font-family") {
      if (
        this.state.selectedIndex !== null &&
        (this.state.selectedContent.content === "TEXT" ||
          this.state.selectedContent.content === "BUTTON" ||
          this.state.selectedContent.content === "HTML")
      ) {
        const { value } = this.showSelected(this.state.selectedIndex);
        if (value.marks.filter(mark => mark.type === "font-family").first()) {
          const fontFamily = value.marks
            .filter(mark => mark.type === "font-family")
            .first()
            .data.get("fontFamily");
          switch (fontFamily) {
            case "Nanum Gothic":
              return "Nanum Gothic";
            case "Roboto":
              return "Roboto";
            case "Open Sans":
              return "Open Sans";
            default:
              return "Nanum Gothic";
          }
        } else {
          return "Nanum Gothic";
        }
      } else {
        return "Nanum Gothic";
      }
    } else if (type === "font-color") {
      if (
        this.state.selectedIndex !== null &&
        (this.state.selectedContent.content === "TEXT" ||
          this.state.selectedContent.content === "BUTTON" ||
          this.state.selectedContent.content === "HTML")
      ) {
        const { value } = this.showSelected(this.state.selectedIndex);
        if (value.marks.filter(mark => mark.type === "font-color").first()) {
          const fontColor = value.marks
            .filter(mark => mark.type === "font-color")
            .first()
            .data.get("fontColor");
          return fontColor;
        }
      }
    }
  };

  hasBlock = type => {
    if (
      this.state.selectedIndex !== null &&
      (this.state.selectedContent.content === "TEXT" ||
        this.state.selectedContent.content === "BUTTON" ||
        this.state.selectedContent.content === "HTML")
    ) {
      const { value } = this.showSelected(this.state.selectedIndex);
      return value.blocks.some(node => node.type === type);
    }
  };

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkList = (type, icon) => {
    if (type === "font-color") {
      return (
        <React.Fragment>
          {icon ? (
            <SketchExample
              type={type}
              color={{
                r: icon.rgb.r,
                g: icon.rgb.g,
                b: icon.rgb.b,
                a: icon.rgb.a
              }}
              onChange={this.onClickMarkFont}
            />
          ) : (
            <SketchExample
              type={type}
              color={{
                r: 1,
                g: 0,
                b: 0,
                a: 1
              }}
              onChange={this.onClickMarkFont}
            />
          )}
        </React.Fragment>
      );
    }
    return (
      <Button type={type}>
        <Icon
          onMouseDown={e => {
            e.preventDefault();
            this.state.fontStylePopUp === type
              ? this.setState({
                  fontStylePopUp: null
                })
              : this.setState({ fontStylePopUp: type });
          }}
          type={type}
          style={{ color: "black" }}
        >
          {icon}
        </Icon>
        {type === "font-size" ? (
          <MarkListContainer
            type={type}
            isActive={this.state.fontStylePopUp === type}
          >
            <MarkListItem
              style={{ fontSize: "28px" }}
              onMouseDown={event => this.onClickMarkFont(event, type, 28)}
            >
              Text1
            </MarkListItem>
            <MarkListItem
              style={{ fontSize: "19px" }}
              onMouseDown={event => this.onClickMarkFont(event, type, 19)}
            >
              Text2
            </MarkListItem>
            <MarkListItem
              style={{ fontSize: "16px" }}
              onMouseDown={event => this.onClickMarkFont(event, type, 16)}
            >
              Text3
            </MarkListItem>
            <MarkListItem
              style={{ fontSize: "13px" }}
              onMouseDown={event => this.onClickMarkFont(event, type, 13)}
            >
              Text4
            </MarkListItem>
            <MarkListItem
              style={{ fontSize: "11px" }}
              onMouseDown={event => this.onClickMarkFont(event, type, 11)}
            >
              Text5
            </MarkListItem>
          </MarkListContainer>
        ) : type === "font-family" ? (
          <MarkListContainer
            type={type}
            isActive={this.state.fontStylePopUp === type}
          >
            <MarkListItem
              style={{ fontFamily: "Nanum Gothic" }}
              onMouseDown={event =>
                this.onClickMarkFont(event, type, "Nanum Gothic")
              }
            >
              Nanum Gothic
            </MarkListItem>
            <MarkListItem
              style={{ fontFamily: "Roboto" }}
              onMouseDown={event => this.onClickMarkFont(event, type, "Roboto")}
            >
              Roboto
            </MarkListItem>
            <MarkListItem
              style={{ fontFamily: "Open Sans" }}
              onMouseDown={event =>
                this.onClickMarkFont(event, type, "Open Sans")
              }
            >
              Open Sans
            </MarkListItem>
          </MarkListContainer>
        ) : null}
      </Button>
    );
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].includes(type)) {
      if (
        this.state.selectedIndex !== null &&
        (this.state.selectedContent.content === "TEXT" ||
          this.state.selectedContent.content === "BUTTON" ||
          this.state.selectedContent.content === "HTML")
      ) {
        const { value } = this.showSelected(this.state.selectedIndex);
        const parent = value.document.getParent(value.blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node, isFocused } = props;

    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "clap-image":
        {
          const represent_src = node.data.get("represent");
          const hover_src = node.data.get("hover");
          const name = node.data.get("name");
          const type = node.data.get("type");
          switch (type) {
            case "TEXT":
              return (
                <ClapImageContainer
                  onMouseOver={() =>
                    this.setState({
                      hoverImgJson: hover_src,
                      onImage: true
                    })
                  }
                  onMouseMove={this.getPos}
                  onMouseOut={() => {
                    this.setState({ onImage: false });
                  }}
                  small={true}
                >
                  <ClapImageText color={EditorDefaults.CLAP_IMG_TEXT_COLOR}>
                    {name}
                  </ClapImageText>
                </ClapImageContainer>
              );
            case "MINI_IMG":
              return (
                <ClapImageContainer
                  onMouseOver={() =>
                    this.setState({
                      hoverImgJson: hover_src,
                      onImage: true
                    })
                  }
                  onMouseMove={this.getPos}
                  onMouseOut={() => {
                    this.setState({ onImage: false });
                  }}
                  small={true}
                >
                  <Image
                    small={true}
                    src={represent_src}
                    alt={"hover"}
                    selected={isFocused}
                    {...attributes}
                  />
                  <ClapImageText color={EditorDefaults.CLAP_IMG_TEXT_COLOR}>
                    {name}
                  </ClapImageText>
                </ClapImageContainer>
              );
            case "NORMAL_IMG":
              return (
                <Image
                  src={represent_src}
                  alt={"hover"}
                  selected={isFocused}
                  onMouseOver={() =>
                    this.setState({
                      hoverImgJson: hover_src,
                      onImage: true
                    })
                  }
                  onMouseMove={this.getPos}
                  onMouseOut={() => {
                    this.setState({ onImage: false });
                  }}
                  {...attributes}
                />
              );
            default:
              break;
          }
        }
        break;
      default:
        break;
    }
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = props => {
    const { children, mark, attributes } = props;
    switch (mark.type) {
      case "font-family":
        return (
          <span style={{ fontFamily: mark.data.get("fontFamily") }}>
            {children}
          </span>
        );
      case "font-size":
        return (
          <span style={{ fontSize: mark.data.get("fontSize") }}>
            {children}
          </span>
        );
      case "font-color":
        return (
          <span
            style={{
              color: `rgba(${mark.data.get("fontColor").rgb.r},
              ${mark.data.get("fontColor").rgb.g},
              ${mark.data.get("fontColor").rgb.b},
              ${mark.data.get("fontColor").rgb.a})`
            }}
          >
            {children}
          </span>
        );
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return;
    }
  };

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault();
    if (
      this.state.selectedIndex !== null &&
      (this.state.selectedContent.content === "TEXT" ||
        this.state.selectedContent.content === "BUTTON" ||
        this.state.selectedContent.content === "HTML")
    ) {
      const { value } = this.showSelected(this.state.selectedIndex);
      const change = value.change().toggleMark(type);
      this.handleOnChange(
        change,
        this.state.selectedIndex,
        "TEXT",
        "TEXT_CHANGE"
      );
    }
  };

  onClickMarkFont = (event, type, prop) => {
    event.preventDefault();
    if (type === "font-size") {
      if (
        this.state.selectedIndex !== null &&
        (this.state.selectedContent.content === "TEXT" ||
          this.state.selectedContent.content === "BUTTON" ||
          this.state.selectedContent.content === "HTML")
      ) {
        const { value } = this.showSelected(this.state.selectedIndex);
        let change;

        if (
          !value.document.getMarksByType(type).some(mark => mark.type === type)
        ) {
          change = value.change().addMark({ type, data: { fontSize: prop } });
        } else {
          change = value
            .change()
            .removeMark(value.marks.filter(mark => mark.type === type).first())
            .removeMark(value.marks.filter(mark => mark.type === type).last())
            .addMark({ type, data: { fontSize: prop } });
        }
        this.handleOnChange(
          change,
          this.state.selectedIndex,
          "TEXT",
          "TEXT_CHANGE"
        );
      }
    } else if (type === "font-family") {
      if (
        this.state.selectedIndex !== null &&
        (this.state.selectedContent.content === "TEXT" ||
          this.state.selectedContent.content === "BUTTON" ||
          this.state.selectedContent.content === "HTML")
      ) {
        const { value } = this.showSelected(this.state.selectedIndex);
        let change;
        console.log(value.document.getMarksByType(type));

        if (
          !value.document.getMarksByType(type).some(mark => mark.type === type)
        ) {
          change = value.change().addMark({
            type,
            data: { fontFamily: prop }
          });
        } else {
          change = value
            .change()
            .removeMark(value.marks.filter(mark => mark.type === type).first())
            .removeMark(value.marks.filter(mark => mark.type === type).last())
            .addMark({
              type,
              data: { fontFamily: prop }
            });
        }
        this.handleOnChange(
          change,
          this.state.selectedIndex,
          "TEXT",
          "TEXT_CHANGE"
        );
      }
    } else if (type === "font-color") {
      if (
        this.state.selectedIndex !== null &&
        (this.state.selectedContent.content === "TEXT" ||
          this.state.selectedContent.content === "BUTTON" ||
          this.state.selectedContent.content === "HTML")
      ) {
        const { value } = this.showSelected(this.state.selectedIndex);
        let change;
        console.log(
          value.document.getMarksByType(type).some(mark => mark.type === type)
        );
        console.log(value.marks.filter(mark => mark.type === type).size);
        if (value.marks.filter(mark => mark.type === type).size === 0) {
          change = value.change().addMark({
            type,
            data: { fontColor: prop }
          });
        } else {
          change = value
            .change()
            .removeMark(value.marks.filter(mark => mark.type === type).first())
            .removeMark(value.marks.filter(mark => mark.type === type).last())
            .addMark({ type, data: { fontColor: prop } });
        }
        this.handleOnChange(
          change,
          this.state.selectedIndex,
          "TEXT",
          "TEXT_CHANGE"
        );
      }
    }
  };

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault();
    if (
      this.state.selectedIndex !== null &&
      (this.state.selectedContent.content === "TEXT" ||
        this.state.selectedContent.content === "BUTTON" ||
        this.state.selectedContent.content === "HTML")
    ) {
      console.log(this.state.selectedContent);
      const { value } = this.showSelected(this.state.selectedIndex);
      const change = value.change();
      const { document } = value;

      // Handle everything but list buttons.
      if (type !== "bulleted-list" && type !== "numbered-list") {
        const isActive = this.hasBlock(type);
        const isList = this.hasBlock("list-item");

        if (isList) {
          change
            .setBlocks(isActive ? DEFAULT_NODE : type)
            .unwrapBlock("bulleted-list")
            .unwrapBlock("numbered-list");
        } else {
          change.setBlocks(isActive ? DEFAULT_NODE : type);
        }
      } else {
        // Handle the extra wrapping required for list buttons.
        const isList = this.hasBlock("list-item");
        const isType = value.blocks.some(block => {
          return !!document.getClosest(
            block.key,
            parent => parent.type === type
          );
        });

        if (isList && isType) {
          change
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock("bulleted-list")
            .unwrapBlock("numbered-list");
        } else if (isList) {
          change
            .unwrapBlock(
              type === "bulleted-list" ? "numbered-list" : "bulleted-list"
            )
            .wrapBlock(type);
        } else {
          change.setBlocks("list-item").wrapBlock(type);
        }
      }
      this.handleOnChange(
        change,
        this.state.selectedIndex,
        "TEXT",
        "TEXT_CHANGE"
      );
    }
  };

  // onDropOrPaste = (event, change, editor) => {
  //   const target = getEventRange(event, change.value);
  //   if (!target && event.type === "drop") return;

  //   const transfer = getEventTransfer(event);
  //   const { type, text, files } = transfer;

  //   if (type === "files") {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       const [mime] = file.type.split("/");
  //       if (mime !== "image") continue;

  //       reader.addEventListener("load", () => {
  //         editor.change(c => {
  //           c.call(insertImage, reader.result, target);
  //         });
  //       });

  //       reader.readAsDataURL(file);
  //     }
  //   }

  //   if (type === "text") {
  //     if (!isUrl(text)) return;
  //     if (!isImage(text)) return;
  //     change.call(insertImage, text, target);
  //   }
  // };
}

export default DragDropContext(HTML5Backend)(Editor);
