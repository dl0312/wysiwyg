import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import styles from "./Editor.scss";
import EditorLeft from "./EditorLeft";
import EditorRight from "./EditorRight";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Builder from "./MasterBuilder";
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
      selectedCardsId: null,
      hoveredCardId: null,
      cards: [
        { id: 1, type: "builder" },
        {
          id: 2,
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
        { id: 3, type: "builder" },
        {
          id: 4,
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
        { id: 5, type: "builder" },
        { id: 6, type: "content", OnDrag: "content", content: "IMAGE" },
        { id: 7, type: "builder" },
        {
          id: 8,
          type: "columnList",
          OnDrag: "columnList",
          content: [1, 1, 1],
          columnListArray: [
            [{ id: 5, type: "builder" }],
            [{ id: 5, type: "builder" }],
            [{ id: 5, type: "builder" }]
          ]
        },
        { id: 9, type: "builder" },
        { id: 10, type: "content", OnDrag: "content", content: "VIDEO" },
        { id: 11, type: "builder" },
        {
          id: 12,
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
        { id: 13, type: "builder" }
      ],
      maxId: 13,
      cardsExample: [{ id: 1, OnDrag: "content", content: "TEXT" }]
    };
  }

  buttonCallback = (type, dataFromChild, component) => {
    console.log(`type: ${type}, data: ${dataFromChild}, comp: ${component}`);
    if (type === "hover") {
      if (this.state.selectedCardsId === dataFromChild) {
        this.setState({ selectedCardsId: null });
      } else {
        this.setState({ selectedCardsId: dataFromChild });
      }
    } else if (type === "select") {
      if (this.state.selectedCardsId === dataFromChild) {
        this.setState({ selectedCardsId: null });
      } else {
        this.setState({ selectedCardsId: dataFromChild });
      }
    } else if (type === "delete") {
      // block
      if (dataFromChild.length === 3) {
        console.log(this.state.cards[dataFromChild[0]]);
        console.log(this.state.cards[dataFromChild[0]].columnListArray);
        console.log(
          this.state.cards[dataFromChild[0]].columnListArray[dataFromChild[1]]
        );

        if (this.state.selectedCardsId === dataFromChild) {
          this.setState({ selectedCardsId: null });
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
        if (this.state.selectedCardsId === dataFromChild) {
          this.setState({ selectedCardsId: null });
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
      // const { cards } = this.state;
      console.log(component);
      const targetCard = this.state.cards[dataFromChild];
      this.setState(
        update(this.state, {
          cards: {
            $splice: [[dataFromChild, 0, targetCard]]
          }
        })
      );

      this.setState({ maxId: this.state.maxId + 1 });
    }
  };

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
        hoverItem = { id: this.state.maxId + 1, ...hoverItem };
        const builder = { id: this.state.maxId + 2, type: "builder" };
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
        this.setState({ maxId: this.state.maxId + 2 });
        console.log(this.state.cards);
      }
    } else {
      // on frame
      console.log(hoverItem);
      console.log(hoverIndex);
      if (!!hoverItem) {
        hoverItem = { id: this.state.maxId + 1, ...hoverItem };
        const builder = { id: this.state.maxId + 2, type: "builder" };
        this.setState(
          update(this.state, {
            cards: {
              $splice: [[hoverIndex, 0, hoverItem], [hoverIndex, 0, builder]]
            }
          })
        );
        this.setState({ maxId: this.state.maxId + 2 });
        console.log(this.state.cards);
      }
    }
  };

  // frame 움직이기
  moveCard = (dragIndex, hoverIndex) => {
    // block => block

    // block => frame

    // frame => block

    // frame => frame
    const { cards } = this.state;
    const dragCard = cards[dragIndex];
    const dragBuilder = cards[dragIndex - 1];
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
    this.setState(
      update(this.state, { cards: { [index]: { value: { $set: value } } } })
    );
  };

  render() {
    const {
      cards,
      hasDropped,
      hasDroppedOnChild,
      selectedCardsId,
      hoveredCardId,
      contentWidth
    } = this.state;

    const compArray = [];
    cards.map((item, index) => {
      // console.log(item);
      switch (item.type) {
        case "builder":
          compArray.push(
            <Builder
              id={item.id}
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
              id={item.id}
              moveCard={this.moveCard}
              callbackfromparent={this.buttonCallback}
              selected={selectedCardsId}
              hovered={hoveredCardId}
            >
              <Container
                value={item.value}
                OnDrag={item.OnDrag}
                content={item.content}
                columnListArray={item.columnListArray}
                callbackfromparent={this.buttonCallback}
                contentWidth={contentWidth}
                index={[index, 0, 0]}
                onChange={({ value }) => {
                  this.handleOnChange({ value }, index);
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
              key={item.id}
              index={index}
              id={item.id}
              moveCard={this.moveCard}
              callbackfromparent={this.buttonCallback}
              selected={selectedCardsId}
              hovered={hoveredCardId}
            >
              <Container
                onChange={this.onChange}
                OnDrag={item.OnDrag}
                content={item.content}
                index={[index, 0, 0]}
                callbackfromparent={this.buttonCallback}
                columnListArray={item.columnListArray}
                contentWidth={contentWidth}
                selected={item.id === selectedCardsId}
                handleDrop={this.handleDrop}
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
