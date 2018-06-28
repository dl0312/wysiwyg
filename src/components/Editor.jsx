import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./Editor.scss";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import MasterBuilder from "./MasterBuilder";
import BlockBuilder from "./BlockBuilder";
import Card from "./Card";
import Container from "./Container";
import { Value } from "slate";

const update = require("immutability-helper");

class Editor extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool,
    greedy: PropTypes.bool,
    children: PropTypes.node
  };
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      color: { r: "255", g: "255", b: "255", a: "1" },
      contentWidth: 600,
      font: null,
      OnDrag: null,
      hasDropped: false,
      hasDroppedOnChild: false,
      contentHover: false,
      selectedIndex: null,
      hoveredIndex: null,
      cards: [
        { type: "builder" },
        {
          type: "content",
          OnDrag: "content",
          content: "BUTTON",
          value: Value.fromJSON({
            document: {
              nodes: [
                {
                  object: "block",
                  type: "paragraph",
                  nodes: [
                    {
                      object: "text",
                      leaves: [
                        {
                          text: "CLICK ME!"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          })
        },
        { type: "builder" },
        {
          type: "content",
          OnDrag: "content",
          content: "TEXT",
          value: Value.fromJSON({
            document: {
              nodes: [
                {
                  object: "block",
                  type: "paragraph",
                  nodes: [
                    {
                      object: "text",
                      leaves: [
                        {
                          text: "A line of text in a paragraph."
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          })
        },
        { type: "builder" },
        { type: "content", OnDrag: "content", content: "IMAGE" },
        { type: "builder" },
        {
          type: "columnList",
          OnDrag: "columnList",
          content: [1, 1, 1],
          columnListArray: [
            [{ type: "builder" }],
            [{ type: "builder" }],
            [{ type: "builder" }]
          ]
        },
        { type: "builder" },
        { type: "content", OnDrag: "content", content: "VIDEO" },
        { type: "builder" },
        {
          type: "content",
          OnDrag: "content",
          content: "HTML",
          value: Value.fromJSON({
            document: {
              nodes: [
                {
                  object: "block",
                  marks: {
                    b: "bold"
                  },
                  type: "paragraph",
                  nodes: [
                    {
                      object: "text",
                      leaves: [
                        {
                          text: "Hello, world!"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          })
        },
        { type: "builder" }
      ],
      maxId: 13,
      cardsExample: [{ OnDrag: "content", content: "TEXT" }]
    };
  }

  buttonCallback = (type, dataFromChild) => {
    const { cards, hoveredIndex, selectedIndex } = this.state;
    console.log(`type: ${type}, data: ${dataFromChild}`);
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
          this.setState({ selectedIndex: null });
        } else {
          this.setState({ selectedIndex: dataFromChild });
        }
      } else {
        this.setState({ selectedIndex: dataFromChild });
      }
    } else if (type === "delete") {
      // block
      if (dataFromChild.length === 3) {
        console.log(cards[dataFromChild[0]]);
        console.log(cards[dataFromChild[0]].columnListArray);
        console.log(cards[dataFromChild[0]].columnListArray[dataFromChild[1]]);

        if (selectedIndex === dataFromChild) {
          this.setState({ selectedIndex: null });
        }
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
        );
      } else {
        // frame
        if (selectedIndex === dataFromChild) {
          this.setState({ selectedIndex: null });
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
        if (dataFromChild.length === 2) {
          const targetCard = cards[dataFromChild[0]];
          const masterBuilder = { type: "builder" };
          this.setState(
            update(this.state, {
              cards: {
                $splice: [
                  [dataFromChild[0], 0, masterBuilder],
                  [dataFromChild[0], 0, targetCard]
                ]
              }
            })
          );
        } else if (dataFromChild.length === 3) {
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
    }
  };

  // 오른쪽 버튼 Drop Here에 놨을 때
  handleDrop = (hoverItem, hoverIndex) => {
    // on column
    if (hoverIndex.length === 3) {
      console.log(this.state.cards[hoverIndex[0]]);
      console.log(this.state.cards[hoverIndex[0]].columnListArray);
      console.log(
        this.state.cards[hoverIndex[0]].columnListArray[hoverIndex[1]]
      );
      console.log(hoverIndex[2]);
      console.log(hoverItem);

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
        console.log(this.state.cards);
      }
    } else {
      // on frame
      console.log(hoverItem);
      console.log(hoverIndex);
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

  // frame과 block들간의 이동 4가지
  // block on column -> block on column ([1,2,1] > [3,1,1])
  // block on column -> frame ([1,2,1] > 5)
  // block on frame -> block ([5,0] > [1,2,1])
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
    } else if (dragIndex.length === 3 && !Array.isArray(hoverIndex)) {
      // block => frame

      // copy
      const { cards } = this.state;
      const dragCard =
        cards[dragIndex[0]].columnListArray[dragIndex[1]][dragIndex[2]];
      const dragBuilder = { type: "builder" };
      // delete
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

      // drop
      this.setState(
        update(this.state, {
          cards: {
            $splice: [[hoverIndex, 0, dragCard], [hoverIndex, 0, dragBuilder]]
          }
        })
      );
    } else if (dragIndex.length === 2 && hoverIndex.length === 3) {
      // frame => block

      // copy
      const { cards } = this.state;
      const dragCard = cards[dragIndex[0]];
      const dragBuilder = { type: "builder" };

      // delete
      this.setState(
        update(this.state, {
          cards: {
            $splice: [[dragIndex[0] - 1, 2]]
          }
        })
      );

      console.log(cards[hoverIndex[0]].columnListArray[hoverIndex[1]]);
      // drop
      if (dragIndex[0] < hoverIndex[0]) {
        this.setState(
          update(this.state, {
            cards: {
              [hoverIndex[0] - 2]: {
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
      } else if (dragIndex[0] > hoverIndex[0]) {
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
      }
    } else if (!dragIndex.isArray && !Array.isArray(hoverIndex)) {
      // frame => frame
      const { cards } = this.state;
      const dragCard = cards[dragIndex];
      const dragBuilder = { type: "builder" };
      console.log(dragCard);
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

  myCallback = dataFromChild => {
    console.log(dataFromChild);
    this.setState({ color: dataFromChild });
  };

  widthCallback = dataFromChild => {
    console.log("change width: " + dataFromChild);
    this.setState({ contentWidth: dataFromChild });
  };

  fontCallback = dataFromChild => {
    this.setState({ font: dataFromChild });
  };

  dragCallback = dataFromChild => {
    this.setState({ OnDrag: dataFromChild });
  };

  handleOnChange = ({ value }, index) => {
    console.log({ value });
    console.log(index);
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
  };

  render() {
    const { cards, selectedIndex, hoveredIndex, contentWidth } = this.state;

    const compArray = [];
    cards.map((item, index) => {
      // console.log(item);
      switch (item.type) {
        case "builder":
          compArray.push(
            <MasterBuilder
              index={index}
              moveCard={this.moveCard}
              handleDrop={this.handleDrop}
            />
          );
          break;
        case "content":
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
            >
              <Container
                value={item.value}
                OnDrag={item.OnDrag}
                content={item.content}
                columnListArray={item.columnListArray}
                callbackfromparent={this.buttonCallback}
                contentWidth={contentWidth}
                selectedIndex={selectedIndex}
                hoveredIndex={hoveredIndex}
                index={[index, 0]}
                onChange={({ value }) => {
                  this.handleOnChange({ value }, [index, 0]);
                }}
              />
            </Card>
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
            >
              <Container
                onChange={this.onChange}
                OnDrag={item.OnDrag}
                content={item.content}
                index={[index, 0, 0]}
                callbackfromparent={this.buttonCallback}
                columnListArray={item.columnListArray}
                contentWidth={contentWidth}
                selectedIndex={selectedIndex}
                hoveredIndex={hoveredIndex}
                handleDrop={this.handleDrop}
                moveCard={this.moveCard}
                handleOnChange={this.handleOnChange}
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
          <div id="html" className={styles.left}>
            <EditorLeft
              color={this.state.color}
              contentWidth={this.state.contentWidth}
              font={this.state.font}
              greedy={false}
            >
              {compArray}
            </EditorLeft>
          </div>
          <div className={styles.right}>
            <EditorRight
              callbackfromparent={this.myCallback}
              callbackfromparentwidth={this.widthCallback}
              callbackfromparentfont={this.fontCallback}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DragDropContext(HTML5Backend)(Editor);
