import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import MasterBuilder from "./MasterBuilder";
import Card from "./Card";
import Column from "./Column";
import { Button, Icon } from "./Components";
import EditorTemplates from "./EditorTemplates";
import styled from "styled-components";
import EditorDefaults from "./EditorDefaults";
import JsonView from "./JsonView";
import UserView from "./UserView";
const update = require("immutability-helper");
const DEFAULT_NODE = "paragraph";

const EditorContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  min-width: $max-page-width;
  overflow: hidden;
  position: absolute;
  top: 100px;
  bottom: 0px;
  right: 0;
  left: 0;
`;

const EditorLeftContainer = styled.div`
  position: relative;
  width: 75%;
  overflow: auto;
  background-color: ${props =>
    `rgba(${props.color.r}, ${props.color.g}, ${props.color.b}, ${
      props.color.a
    })`};
  border-right: 1px solid rgba(0, 0, 0, 0.2);
`;

const TextEditor = styled.div`
  position: fixed;
  padding: 15px 15px;
  border-bottom: 2px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease;
  background-color: white;
  margin-top: 1px;
  z-index: 200;
  opacity: ${props => props.opacity};
`;

const EditorRightContainer = styled.div`
  outline: 0.05px solid rgb(172, 172, 172);
  transition: width 1s ease;
  width: 25%;
  min-width: 350px;
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
      color: EditorDefaults.BACKGROUNDCOLOR,
      contentWidth: EditorDefaults.WIDTH,
      font: null,
      OnDrag: null,
      hasDropped: false,
      hasDroppedOnChild: false,
      contentHover: false,
      selectedIndex: null,
      hoveredIndex: null,
      selectedContent: null,
      cards: EditorTemplates.TEMPLATE[0]
    };
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
            selectedIndex: dataFromChild,
            selectedContent: this.showSelected(dataFromChild),
            rightMenu: null
          });
        }
      } else {
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
                      $splice: [[dataFromChild[2] - 1, 2]]
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
              $splice: [[dataFromChild - 1, 2]]
            }
          })
        );
      }
    } else if (type === "duplicate") {
      if (!Array.isArray(dataFromChild)) {
        const targetCard = cards[dataFromChild];
        const masterBuilder = { type: "builder" };
        this.setState(
          update(this.state, {
            cards: {
              $splice: [
                [dataFromChild, 0, masterBuilder],
                [dataFromChild, 0, targetCard]
              ]
            }
          })
        );
      } else {
        const targetCard =
          cards[dataFromChild[0]].columnListArray[dataFromChild[1]][
            dataFromChild[2]
          ];
        const blockBuilder = { type: "builder" };
        this.setState(
          update(this.state, {
            cards: {
              [dataFromChild[0]]: {
                columnListArray: {
                  [dataFromChild[1]]: {
                    $splice: [
                      [dataFromChild[2], 0, blockBuilder],
                      [dataFromChild[2], 0, targetCard]
                    ]
                  }
                }
              }
            }
          })
        );
      }
    }
  };

  // 오른쪽 버튼 Drop Here에 놨을 때
  handleDrop = (hoverItem, hoverIndex) => {
    // on column
    if (hoverIndex.length === 3) {
      if (!!hoverItem) {
        const builder = { type: "builder" };
        this.setState(
          update(this.state, {
            cards: {
              [hoverIndex[0]]: {
                columnListArray: {
                  [hoverIndex[1]]: {
                    $splice: [
                      [hoverIndex[2], 0, hoverItem],
                      [hoverIndex[2], 0, builder]
                    ]
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
        const builder = { type: "builder" };
        this.setState(
          update(this.state, {
            cards: {
              $splice: [[hoverIndex, 0, hoverItem], [hoverIndex, 0, builder]]
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
      const dragBuilder =
        cards[dragIndex[0]].columnListArray[dragIndex[1]][dragIndex[2] - 1];

      this.setState({
        selectedIndex: null,
        selectedContent: null
      });
      this.setState(
        update(this.state, {
          cards: {
            [dragIndex[0]]: {
              columnListArray: {
                [dragIndex[1]]: {
                  $splice: [[dragIndex[2] - 1, 2]]
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
                  $splice: [
                    [hoverIndex[2], 0, dragCard],
                    [hoverIndex[2], 0, dragBuilder]
                  ]
                }
              }
            }
          }
        })
      );
    } else if (!Array.isArray(dragIndex) && !Array.isArray(hoverIndex)) {
      // frame => frame
      const { cards } = this.state;
      const dragCard = cards[dragIndex];
      const dragBuilder = { type: "builder" };
      if (dragIndex < hoverIndex) {
        this.setState(
          update(this.state, {
            cards: {
              $splice: [
                [dragIndex - 1, 2],
                [hoverIndex - 2, 0, dragCard],
                [hoverIndex - 2, 0, dragBuilder]
              ]
            }
          })
        );
      } else if (dragIndex > hoverIndex) {
        this.setState(
          update(this.state, {
            cards: {
              $splice: [
                [dragIndex - 1, 2],
                [hoverIndex, 0, dragCard],
                [hoverIndex, 0, dragBuilder]
              ]
            }
          })
        );
      }
    }
  };

  masterCallback = (type, dataFromChild) => {
    if (type === "backgroundColor") {
      this.setState({ color: dataFromChild });
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

  handleOnChange = ({ value }, index, content, type) => {
    if (content === "BUTTON" || content === "TEXT" || content === "HTML") {
      if (index.length === 2) {
        this.setState(
          update(this.state, {
            cards: { [index[0]]: { value: { $set: value } } }
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
                      value: { $set: value }
                    }
                  }
                }
              }
            }
          })
        );
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
      selectedContent,
      contentWidth,
      view
    } = this.state;

    const compArray = [];
    cards.map((item, index) => {
      switch (item.type) {
        case "builder":
          compArray.push(
            <MasterBuilder
              key={index}
              index={index}
              moveCard={this.moveCard}
              handleDrop={this.handleDrop}
              contentWidth={contentWidth}
              OnDrag={this.state.OnDrag}
              masterCallback={this.masterCallback}
            />
          );
          break;
        case "columnList":
          compArray.push(
            <Card
              inColumn={false}
              cards={this.state.cards.length}
              key={index}
              index={index}
              moveCard={this.moveCard}
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
                handleOnChange={this.handleOnChange}
                onKeyDown={this.onKeyDown}
                renderNode={this.renderNode}
                renderMark={this.renderMark}
                selectedIndex={selectedIndex}
                hoveredIndex={hoveredIndex}
                contentWidth={contentWidth}
                OnDrag={this.state.OnDrag}
                masterCallback={this.masterCallback}
              />
            </Card>
          );
          break;
        default:
          break;
      }
    });

    return (
      <Fragment>
        <EditorContainer>
          <EditorLeftContainer color={this.state.color}>
            {view === "EDIT" ? (
              <EditorLeft
                color={this.state.color}
                contentWidth={this.state.contentWidth}
                font={this.state.font}
                greedy={false}
              >
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
                  {this.renderMarkButton("bold", <i className="fas fa-bold" />)}
                  {this.renderMarkButton(
                    "italic",
                    <i className="fas fa-italic" />
                  )}
                  {this.renderMarkButton(
                    "underlined",
                    <i className="fas fa-underline" />
                  )}
                  {this.renderMarkButton("code", <i className="fas fa-code" />)}
                  {this.renderBlockButton("heading-one", "H1")}
                  {this.renderBlockButton("heading-two", "H2")}
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
                <div style={{ marginTop: "60px" }} />
                {compArray}
              </EditorLeft>
            ) : view === "USER" ? (
              <UserView json={this.state} />
            ) : view === "JSON" ? (
              <JsonView json={this.state} />
            ) : null}
          </EditorLeftContainer>
          <EditorRightContainer>
            <EditorRight
              rightMenu={this.state.rightMenu}
              cards={this.state.cards}
              view={this.state.view}
              selectedIndex={selectedIndex}
              selectedContent={selectedContent}
              masterCallback={this.masterCallback}
              handleOnChange={this.handleOnChange}
              showSelected={this.showSelected}
              OnChangeCards={this.OnChangeCards}
            />
          </EditorRightContainer>
        </EditorContainer>
      </Fragment>
    );
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

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
    const { attributes, children, node } = props;

    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      default:
        return;
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
      this.handleOnChange(change, this.state.selectedIndex, "TEXT", "change");
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
      this.handleOnChange(change, this.state.selectedIndex, "TEXT", "change");
    }
  };
}

export default DragDropContext(HTML5Backend)(Editor);
