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
import Column from "./Column";
import { Value } from "slate";

const update = require("immutability-helper");

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
      cards: [
        // ex 1
        // { type: "builder" },
        // {
        //   type: "content",
        //   OnDrag: "content",
        //   content: "BUTTON",
        //   value: Value.fromJSON({
        //     document: {
        //       nodes: [
        //         {
        //           object: "block",
        //           type: "paragraph",
        //           nodes: [
        //             {
        //               object: "text",
        //               leaves: [
        //                 {
        //                   text: "CLICK ME!"
        //                 }
        //               ]
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   })
        // },
        // { type: "builder" },
        // {
        //   type: "content",
        //   OnDrag: "content",
        //   content: "TEXT",
        //   value: Value.fromJSON({
        //     document: {
        //       nodes: [
        //         {
        //           object: "block",
        //           type: "paragraph",
        //           nodes: [
        //             {
        //               object: "text",
        //               leaves: [
        //                 {
        //                   text: "A line of text in a paragraph."
        //                 }
        //               ]
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   })
        // },
        // { type: "builder" },
        // {
        //   type: "content",
        //   OnDrag: "content",
        //   content: "IMAGE",
        //   imageSrc: "https://media.giphy.com/media/26BoDtH35vKPiELnO/giphy.gif"
        // },
        // { type: "builder" },
        // {
        //   type: "columnList",
        //   OnDrag: "columnList",
        //   content: [1, 1, 1],
        //   columnListArray: [
        //     [{ type: "builder" }],
        //     [{ type: "builder" }],
        //     [{ type: "builder" }]
        //   ]
        // },
        // { type: "builder" },
        // {
        //   type: "content",
        //   OnDrag: "content",
        //   content: "VIDEO",
        //   videoSrc: "https://www.youtube.com/embed/TRmdXDH9b1s?ecver=1"
        // },
        // { type: "builder" },
        // {
        //   type: "content",
        //   OnDrag: "content",
        //   content: "HTML",
        //   value: Value.fromJSON({
        //     document: {
        //       nodes: [
        //         {
        //           object: "block",
        //           marks: {
        //             b: "bold"
        //           },
        //           type: "paragraph",
        //           nodes: [
        //             {
        //               object: "text",
        //               leaves: [
        //                 {
        //                   text: "Hello, world!"
        //                 }
        //               ]
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   })
        // },
        // { type: "builder" }

        // ex2
        { type: "builder" },
        {
          type: "columnList",
          OnDrag: "columnList",
          content: [1],
          columnListArray: [
            [
              { type: "builder" },
              {
                type: "content",
                OnDrag: "content",
                content: "IMAGE",
                fullWidth: false,
                alt: "Image",
                imageSrc:
                  "https://media.giphy.com/media/26BoDtH35vKPiELnO/giphy.gif"
              },
              { type: "builder" },
              {
                type: "content",
                OnDrag: "content",
                content: "VIDEO",
                videoSrc: "TRmdXDH9b1s"
              },
              { type: "builder" }
            ]
          ]
        },
        { type: "builder" }
      ],
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
        console.log(cards[dataFromChild[0]]);
        console.log(cards[dataFromChild[0]].columnListArray);
        console.log(cards[dataFromChild[0]].columnListArray[dataFromChild[1]]);

        if (
          selectedIndex.length === dataFromChild.length &&
          selectedIndex.every((v, i) => v === dataFromChild[i])
        ) {
          this.setState({
            selectedIndex: null
          });
        }
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
        );
      } else if (dataFromChild.length === 2) {
        if (
          selectedIndex.length === dataFromChild.length &&
          selectedIndex.every((v, i) => v === dataFromChild[i])
        ) {
          this.setState({ selectedIndex: null });
        }
        this.setState(
          update(this.state, {
            cards: {
              $splice: [[dataFromChild[0] - 1, 2]]
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

  masterCallback = (type, dataFromChild) => {
    if (type === "backgroundColor") {
      this.setState({ color: dataFromChild });
    } else if (type === "width") {
      console.log("change width: " + dataFromChild);
      this.setState({ contentWidth: dataFromChild });
    } else if (type === "font") {
      this.setState({ font: dataFromChild });
    } else if (type === "onDrag") {
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
    const selected = null;
    if (!Array.isArray(index)) {
      // console.log(cards[index]);
      const selected = cards[index];
      return cards[index];
    } else {
      if (index.length === 2) {
        console.log(cards[index[0]]);
        const selected = cards[index[0]];
        return cards[index[0]];
      } else if (index.length === 3) {
        console.log(cards[index[0]].columnListArray[index[1]][index[2]]);
        const selected = cards[index[0]].columnListArray[index[1]][index[2]];
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
                imageSrc={item.imageSrc}
                videoSrc={item.videoSrc}
                OnDrag={item.OnDrag}
                content={item.content}
                columnListArray={item.columnListArray}
                callbackfromparent={this.buttonCallback}
                contentWidth={contentWidth}
                selectedIndex={selectedIndex}
                hoveredIndex={hoveredIndex}
                index={[index, 0]}
                align={item.align}
                fullWidth={item.fullWidth}
                onChange={({ value }) => {
                  this.handleOnChange({ value }, [index, 0], item.content);
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
              <Column
                columnArray={item.content}
                columnListArray={item.columnListArray}
                index={[index, 0, 0]}
                callbackfromparent={this.buttonCallback}
                handleDrop={this.handleDrop}
                moveCard={this.moveCard}
                handleOnChange={this.props.handleOnChange}
                selectedIndex={selectedIndex}
                hoveredIndex={hoveredIndex}
                contentWidth={contentWidth}
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
              }, ${this.state.color.b}, ${this.state.color.a})`
            }}
            className={styles.left}
          >
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
          {/* <div
            style={{
              position: "absolute",
              width: "100px",
              right: "300px",
              bottom: "200px"
            }}
          >
            selectedIndex: {selectedIndex}
            <br />
            {JSON.stringify(this.showSelected(selectedIndex))}
            <button onClick={() => this.showSelected(selectedIndex)}>
              selectedInfo
            </button>
          </div> */}
        </div>
      </Fragment>
    );
  }
}

export default DragDropContext(HTML5Backend)(Editor);
