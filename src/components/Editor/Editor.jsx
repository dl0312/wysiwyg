import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./Editor.scss";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import MasterBuilder from "./MasterBuilder";
import Card from "./Card";
import Column from "./Column";
import { Button, Icon } from "./Components";
import EditorTemplates from "./EditorTemplates";
const update = require("immutability-helper");

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = "paragraph";

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

/**
 * The rich text example.
 *
 * @type {Component}
 */

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
      color: { r: "255", g: "255", b: "255", a: "1" },
      contentWidth: 600,
      font: null,
      OnDrag: null,
      hasDropped: false,
      hasDroppedOnChild: false,
      contentHover: false,
      selectedIndex: null,
      hoveredIndex: null,
      selectedContent: null,
      cards: EditorTemplates.TEMPLATE[1]
    };
  }

  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    if (
      this.state.selectedIndex !== null &&
      (this.state.selectedContent.content === "TEXT" ||
        this.state.selectedContent.content === "BUTTON" ||
        this.state.selectedContent.content === "HTML")
    ) {
      // console.log(this.state.selectedIndex);
      // console.log(this.showSelected(this.state.selectedIndex));
      const { value } = this.showSelected(this.state.selectedIndex);
      return value.activeMarks.some(mark => mark.type === type);
    }
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

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
   * Render.
   *
   * @return {Element}
   */

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
        // console.log(cards[dataFromChild[0]]);
        // console.log(cards[dataFromChild[0]].columnListArray);
        // console.log(cards[dataFromChild[0]].columnListArray[dataFromChild[1]]);
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
        console.log(masterBuilder);
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
        console.log(this.state.cards);
      }
    }
  };

  // 이동
  // block on column -> block on column ([1,2,1] > [3,1,1])
  // frame -> frame (5 > 7)
  moveCard = (dragIndex, hoverIndex) => {
    console.log(`${dragIndex}, ${hoverIndex}`);
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
      console.log(dragIndex);
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
    console.log(value);
    console.log(index);
    console.log(content);
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
          console.log(this.state.cards[index[0]]);
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
          console.log(this.state.cards[index[0]]);
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
          console.log(this.state.cards[index[0]]);
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
          console.log(this.state.cards[index[0]]);
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
      contentWidth
    } = this.state;

    const compArray = [];
    cards.map((item, index) => {
      // console.log(item);
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
        <div className={styles.editor}>
          <div
            style={{
              backgroundColor: `rgba(${this.state.color.r}, ${
                this.state.color.g
              }, ${this.state.color.b}, ${this.state.color.a})`,
              position: "relative"
            }}
            className={styles.left}
          >
            <EditorLeft
              color={this.state.color}
              contentWidth={this.state.contentWidth}
              font={this.state.font}
              greedy={false}
            >
              <div
                style={{
                  position: "fixed",
                  padding: "15px 15px",
                  borderBottom: "2px solid #eee",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "opacity 0.5s ease",
                  backgroundColor: "white",
                  marginTop: "1px",
                  zIndex: "200",
                  opacity:
                    this.state.selectedContent !== null
                      ? (this.state.selectedContent.content === "TEXT") |
                        (this.state.selectedContent.content === "BUTTON") |
                        (this.state.selectedContent.content === "HTML")
                        ? "1"
                        : "0"
                      : "0"
                }}
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
              </div>
              <div style={{ marginTop: "60px" }} />
              {compArray}
            </EditorLeft>
          </div>
          <div className={styles.right}>
            <EditorRight
              rightMenu={this.state.rightMenu}
              cards={this.state.cards}
              selectedIndex={selectedIndex}
              selectedContent={selectedContent}
              masterCallback={this.masterCallback}
              handleOnChange={this.handleOnChange}
              showSelected={this.showSelected}
              OnChangeCards={this.OnChangeCards}
            />
          </div>
        </div>
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
